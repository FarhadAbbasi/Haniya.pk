import axios from "axios"

export type EasypaisaInitPayload = {
  amount: number
  orderId: string
  customerEmail?: string
  customerPhone?: string
  returnUrl: string
  callbackUrl: string
}

export async function initEasypaisaPayment(payload: EasypaisaInitPayload) {
  // TODO: replace with real Easypaisa API endpoint and credentials
  // This is a stub for development integration
  const res = await axios.post("/api/payments/easypaisa/init", payload)
  return res.data as { redirectUrl: string; token?: string }
}
