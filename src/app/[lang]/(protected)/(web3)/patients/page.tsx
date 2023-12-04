import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import PatientsContent from "./content"

export default function Patients() {
  return (
    <div className="container m-auto flex flex-col gap-4 py-4">
      <div className="flex flex-row items-center gap-2">
        <Link href={"/"}>
          <ChevronLeft className="cursor-pointer transition-all hover:text-primary" size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Patients</h1>
      </div>
      <PatientsContent />
    </div>
  )
}
