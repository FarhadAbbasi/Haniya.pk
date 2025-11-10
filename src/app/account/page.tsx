export const dynamic = "force-dynamic"

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Your Account</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <section className="md:col-span-2 overflow-hidden rounded-lg border bg-white">
          <div className="border-b p-4 text-sm font-medium">Recent Orders</div>
          <div className="p-4 text-sm text-muted-foreground">
            Sign in to view your orders. This section will list order ID, date, total, and status.
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border bg-white">
          <div className="border-b p-4 text-sm font-medium">Addresses</div>
          <div className="p-4 text-sm text-muted-foreground">
            Save your delivery addresses for faster checkout. Coming soon.
          </div>
        </section>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <div className="border-b p-4 text-sm font-medium">Sign In</div>
        <div className="p-4 text-sm text-muted-foreground">
          Account authentication will be added here (email or OAuth). For now, please proceed with guest checkout.
        </div>
      </div>
    </div>
  )
}
