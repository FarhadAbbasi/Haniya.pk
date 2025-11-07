import axios from "axios"

export type RateQuoteRequest = {
  fromCity: string
  toCity: string
  weightKg: number
  codAmount?: number
}

export async function getTcsRateQuote(req: RateQuoteRequest) {
  // TODO: replace with real TCS API with credentials
  const res = await axios.post("/api/shipping/tcs/rate", req)
  return res.data as { cost: number; currency: string; etaDays?: number }
}

export async function trackTcs(consignmentNumber: string) {
  const res = await axios.get(`/api/shipping/tcs/track?cn=${encodeURIComponent(consignmentNumber)}`)
  return res.data as { status: string; history?: Array<{ time: string; location: string; message: string }> }
}
