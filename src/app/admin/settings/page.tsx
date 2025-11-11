import { createClient } from "@/lib/supabase/server"
import { SettingsClient } from "@/components/admin/settings-client"

export default async function AdminSettingsPage() {
  const supabase = createClient()
  const { data: rows } = await supabase.from("settings").select("key, value")
  const map = new Map<string, string>((rows || []).map((r: any) => [r.key as string, r.value as string]))

  const initial = {
    shipping_rate: map.has("shipping_rate") ? Number(map.get("shipping_rate")) : undefined,
    sender_email: map.get("sender_email") || "",
    site_url: map.get("site_url") || "",
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsClient initial={initial} />
    </div>
  )
}
