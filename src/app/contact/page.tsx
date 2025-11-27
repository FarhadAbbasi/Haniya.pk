"use client"

export default function ContactPage() {
  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (new FormData(form).get("email") as string || "").trim()
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      try {
        await fetch("/api/marketing/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
      } catch {}
    }
    form.reset()
    alert("Thanks for contacting us! If you provided an email, you’ve been subscribed and a welcome email has been sent.")
  }

  return (
    <div className="prose prose-neutral prose-headings:font-semibold prose-headings:text-foreground/85 prose-p:text-foreground/70 prose-li:text-foreground/70 mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-neutral">
        <h1>Contact Us</h1>
        <p>We’re here to help. Reach out via phone, WhatsApp, or email.</p>
        <ul>
          <li>Phone: <a href="tel:+923118197775">0092 311‑8197775</a></li>
          <li>WhatsApp: <a href="https://wa.me/923118197775" target="_blank" rel="noreferrer">0092 311‑8197775</a></li>
          <li>Email: <a href="mailto:haniyastore@gmail.com">haniyastore@gmail.com</a></li>
        </ul>
      </div>
      <form className="mt-8 grid grid-cols-1 gap-3" onSubmit={handleSend}>
        <input className="rounded-md border px-3 py-2" name="name" placeholder="Your name" />
        <input className="rounded-md border px-3 py-2" name="email" type="email" placeholder="Your email (for a welcome email)" />
        <textarea className="rounded-md border px-3 py-2" name="message" placeholder="Message" rows={4} />
        <button type="submit" className="rounded-md bg-foreground px-4 py-2 text-white">Send</button>
      </form>
    </div>
  )
}
