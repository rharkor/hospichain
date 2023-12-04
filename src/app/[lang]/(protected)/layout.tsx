import requireAuth from "@/components/auth/require-auth"
import LocaleSwitcher from "@/components/locale-switcher"
import { ThemeSwitch } from "@/components/theme/theme-switch"
import { Web3Modal } from "@/contexts/web3-modal"
import { Locale } from "i18n-config"

export default async function ProtectedLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: {
    lang: Locale
  }
}) {
  await requireAuth()

  return (
    <Web3Modal>
      {children}
      <div className="fixed right-2 top-2 z-10 flex flex-row gap-3">
        <ThemeSwitch />
        <LocaleSwitcher lang={lang} />
      </div>
    </Web3Modal>
  )
}
