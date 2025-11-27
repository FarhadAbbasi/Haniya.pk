import Link from "next/link"
import { Phone, Mail, Facebook, Instagram, MessageCircle, Send } from "lucide-react"
// import VapiWidget from "./vapi-widget"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-slate-100">
          {/* AI VOICE Assistant - Widget */}
          {/* <VapiWidget /> */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 text-sm text-foreground/60 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-base font-semibold tracking-tight">NEED HELP?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                {/* <MessageCircle className="h-4 w-4 text-foreground/70" /> */}
                <Send className="h-4 w-4 text-foreground/70" />
                <a href="https://wa.me/923118197775" target="_blank" className="hover:underline" rel="noreferrer">0092 311-8197775</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-foreground/70" />
                <a href="tel:+923118197775" className="hover:underline">0092 311-8197775</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-foreground/70" />
                <a href="mailto:haniyastore@gmail.com" className="hover:underline">haniyastore@gmail.com</a>
              </li>
            </ul>
            <div className="mt-4 md:px-6 text-white flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-1 rounded  bg-gray-700 hover:scale-105 transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-1 rounded bg-gray-700 hover:scale-105 transition-all">
                <Instagram className="h-5  w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold tracking-tight">POLICIES</h3>
            <ul className="space-y-2  text-foreground/60">
              <li><Link href="/policies/refund" className="hover:underline">Refund policy</Link></li>
              <li><Link href="/policies/exchange" className="hover:underline">Exchange Policy</Link></li>
              <li><Link href="/policies/shipping" className="hover:underline">Shipping Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold tracking-tight">COMPANY</h3>
            <ul className="space-y-2  text-foreground/60">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/faqs" className="hover:underline">FAQS</Link></li>
              <li><Link href="/blog" className="hover:underline">Blogs and News</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold tracking-tight">NEWSLETTER</h3>
            <p className="mb-2 text-sm text-foreground/60">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form method="post" action="/api/marketing/subscribe" className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-foreground/40"
              />
              <button type="submit" className="inline-flex items-center justify-center rounded-md border bg-foreground px-3 py-2 text-sm text-white hover:opacity-90">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t justify-center items-center flex pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Haniya.pk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
