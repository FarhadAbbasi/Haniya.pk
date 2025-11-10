import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies()
          return store.get(name)?.value
        },
        // Server Components cannot modify cookies; provide async no-ops here.
        async set() {},
        async remove() {},
      },
    }
  )
}
