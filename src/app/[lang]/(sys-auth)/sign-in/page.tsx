import { LoginUserAuthForm } from "@/components/auth/login-user-auth-form"
import { getDictionary } from "@/lib/langs"
import { Locale } from "i18n-config"
import PrivacyAcceptance from "../privacy-acceptance"

export default async function SignInPage({
  searchParams,
  params: { lang },
}: {
  searchParams: { [key: string]: string | string[] | undefined }
  params: {
    lang: Locale
  }
}) {
  const dictionary = await getDictionary(lang)

  return (
    <main className="container relative m-auto grid min-h-screen flex-1 flex-col items-center justify-center px-2 lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="hidden h-full bg-muted lg:block"></div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{dictionary.signInPage.loginToYourAccount}</h1>
            <p className="text-sm text-muted-foreground">{dictionary.signInPage.enterDetails}</p>
          </div>
          <div className="grid gap-6">
            <LoginUserAuthForm searchParams={searchParams} dictionary={dictionary} />
          </div>
          <PrivacyAcceptance dictionary={dictionary} />
        </div>
      </div>
    </main>
  )
}
