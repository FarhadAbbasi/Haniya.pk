import { AuthClient } from "@/components/account/auth-client"

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Sign In</h1>
      <p className="mb-6 text-sm text-neutral-600">Use your authorized admin email to receive a magic link.</p>
      <AuthClient redirectPath="/admin" />
    </div>
  )
}
