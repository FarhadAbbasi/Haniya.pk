import { createClient } from "@/lib/supabase/server"
import { ContentClient } from "@/components/admin/content-client"

export default async function AdminContentPage() {
  const supabase = createClient()
  const { data: rows } = await supabase.from("settings").select("key, value")
  const map = new Map<string, string>((rows || []).map((r: any) => [r.key as string, r.value as string]))

  const initial = {
    home_highlights: map.get("home_highlights") || "",
    about: map.get("about") || "",
    privacy: map.get("privacy") || "",
    returns: map.get("returns") || "",
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
      <ContentClient initial={initial} />
    </div>
  )
}
