import Link from "next/link"
// import VapiWidget from "./vapi-widget"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-100">
          {/* AI VOICE Assistant - Widget */}
          {/* <VapiWidget /> */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 text-sm text-foreground/80 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-base font-semibold tracking-tight">NEED HELP?</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground">Cell:</span> <a href="tel:+923118197775" className="hover:underline">0092 311-8197775</a>
              </li>
              <li>
                <span className="text-muted-foreground">Whatsapp:</span> <a href="https://wa.me/923118197775" target="_blank" className="hover:underline" rel="noreferrer">0092 311-8197775</a>
              </li>
              <li>
                <span className="text-muted-foreground">Email:</span> <a href="mailto:haniyastore@gmail.com" className="hover:underline">haniyastore@gmail.com</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold tracking-tight">POLICIES</h3>
            <ul className="space-y-2">
              <li><Link href="/policies/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="/policies/refund" className="hover:underline">Refund policy</Link></li>
              <li><Link href="/policies/shipping" className="hover:underline">Shipping Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold tracking-tight">COMPANY</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/faqs" className="hover:underline">FAQS</Link></li>
              <li><Link href="/blog" className="hover:underline">Blogs and News</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-base font-semibold tracking-tight">SOCIAL</h3>
            <ul className="space-y-2">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t justify-center items-center flex pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Haniya.pk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
