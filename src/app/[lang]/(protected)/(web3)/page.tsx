import { getDictionary } from "@/lib/langs"
import { Locale } from "i18n-config"
import HomeContent from "./content"

export default async function Home({
  params: { lang },
}: {
  params: {
    lang: Locale
  }
}) {
  const dictionary = await getDictionary(lang)

  return <HomeContent dictionary={dictionary} />
}
