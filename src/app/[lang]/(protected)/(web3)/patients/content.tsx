"use client"
import {
  Button,
  Checkbox,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { AbiItem } from "viem/_types/types/contract"
import { useContractReads, useContractWrite, useWaitForTransaction } from "wagmi"
import { ModalHeader } from "@/components/ui/modal"
import patientsAbi from "blockchain/abi/contracts/patients.sol/Patients.json"
import { Patients as PatientsContract } from "blockchain/typechain-types"
import { env } from "env.mjs"

export default function PatientsContent() {
  const [isMounted, setIsMounted] = useState(false)
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const patientsContract = {
    address: env.NEXT_PUBLIC_PATIENTS as `0x${string}`,
    abi: patientsAbi as AbiItem[],
  }
  const { data, isLoading, refetch } = useContractReads({
    contracts: [
      {
        ...patientsContract,
        functionName: "patientCount",
        args: [],
      },
      {
        ...patientsContract,
        functionName: "getPatients",
        args: [(page - 1) * rowsPerPage, rowsPerPage],
      },
    ],
  })
  const result: [
    {
      patientCount: bigint | undefined
    },
    {
      getPatients: Awaited<ReturnType<PatientsContract["getPatients"]>> | undefined
    },
  ] = [
    {
      patientCount: data?.[0]?.result as bigint | undefined,
    },
    {
      getPatients: data?.[1]?.result as Awaited<ReturnType<PatientsContract["getPatients"]>> | undefined,
    },
  ]

  const pages = Math.ceil(Number(result[0].patientCount) / rowsPerPage)
  const patients = result[1].getPatients?.map((p, index) => ({ ...p, index }))

  const [createPatientInput, setCreatePatientInput] = useState({
    lastnames: "",
    firstnames: "",
    age: 0,
    nationality: "",
    email: "",
    alive: true,
    referringDoctor: 0,
    exams: [],
    operations: [],
    treatements: [],
    dead: 0,
  })
  const {
    isLoading: isAddPatientLoading,
    writeAsync,
    data: createPatientData,
  } = useContractWrite({
    address: env.NEXT_PUBLIC_PATIENTS as `0x${string}`,
    abi: patientsAbi,
    functionName: "addPatient",
  })
  const { isLoading: isAddPatientTxLoading, isSuccess } = useWaitForTransaction({ hash: createPatientData?.hash })

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const handleAddPatient = async () => {
    try {
      await writeAsync({
        args: [createPatientInput],
      })
    } catch (e) {
      console.error(e)
      if (
        typeof e === "object" &&
        e &&
        "cause" in e &&
        typeof e.cause === "object" &&
        e.cause &&
        "reason" in e.cause &&
        typeof e.cause.reason === "string"
      ) {
        toast.error(e.cause.reason)
      } else {
        toast.error("An error occured")
      }
    }
  }

  useEffect(() => {
    if (isSuccess) {
      refetch()
      onClose()
    }
  }, [isSuccess, refetch, onClose])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-end">
        <Button color="primary" onPress={onOpen}>
          New Patient
        </Button>
      </div>
      {isMounted && (
        <Table
          aria-label="Example table with client async pagination"
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="firstnames">Firstname</TableColumn>
            <TableColumn key="lastnames">Lastname</TableColumn>
            <TableColumn key="age">Age</TableColumn>
            <TableColumn key="nationality">Nationality</TableColumn>
            <TableColumn key="email">Email</TableColumn>
            <TableColumn key="alive">Alive</TableColumn>
            <TableColumn key="referringDoctor">Referring Doctor</TableColumn>
            <TableColumn key="exams">Exams</TableColumn>
            <TableColumn key="operations">Operations</TableColumn>
            <TableColumn key="treatements">Treatements</TableColumn>
            <TableColumn key="dead">Dead</TableColumn>
          </TableHeader>
          <TableBody items={patients} loadingContent={<Spinner />} isLoading={isLoading}>
            {(item) => (
              <TableRow key={item.index}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "alive"
                      ? item[columnKey]
                        ? "Yes"
                        : "No"
                      : columnKey === "age" || columnKey === "referringDoctor"
                        ? item[columnKey].toString()
                        : getKeyValue(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Patient</ModalHeader>
              <ModalBody>
                <Input
                  label="Firstnames"
                  value={createPatientInput.firstnames}
                  onValueChange={(value) => setCreatePatientInput({ ...createPatientInput, firstnames: value })}
                />
                <Input
                  label="Lastnames"
                  value={createPatientInput.lastnames}
                  onValueChange={(value) => setCreatePatientInput({ ...createPatientInput, lastnames: value })}
                />
                <Input
                  label="Age"
                  value={createPatientInput.age.toString()}
                  onValueChange={(value) => setCreatePatientInput({ ...createPatientInput, age: Number(value) })}
                  type="number"
                />
                <Input
                  label="Nationality"
                  value={createPatientInput.nationality}
                  onValueChange={(value) => setCreatePatientInput({ ...createPatientInput, nationality: value })}
                />
                <Input
                  label="Email"
                  value={createPatientInput.email}
                  onValueChange={(value) => setCreatePatientInput({ ...createPatientInput, email: value })}
                />
                <Checkbox
                  isSelected={createPatientInput.alive}
                  onValueChange={(value) => setCreatePatientInput({ ...createPatientInput, alive: value })}
                >
                  Alive
                </Checkbox>
                <Input
                  label="Referring Doctor"
                  value={createPatientInput.referringDoctor.toString()}
                  onChange={(e) =>
                    setCreatePatientInput({ ...createPatientInput, referringDoctor: Number(e.target.value) })
                  }
                  type="number"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleAddPatient}
                  isLoading={isAddPatientLoading || isAddPatientTxLoading}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
