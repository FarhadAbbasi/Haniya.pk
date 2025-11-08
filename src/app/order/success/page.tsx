export default function OrderSuccessPage({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  const id = typeof searchParams?.id === "string" ? searchParams.id : undefined
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Order Placed</h1>
      <p className="text-muted-foreground">Thank you for your order. We will contact you shortly.</p>
      {id && (
        <p className="mt-4 text-sm">
          Your order ID is <span className="font-medium">{id}</span>
        </p>
      )}
      <a href="/" className="mt-6 inline-block rounded-md border px-4 py-2 text-sm">Back to Home</a>
    </div>
  )
}
