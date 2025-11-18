"use client"

export default function WhatsAppFab() {
  const href = "https://wa.me/923118197775"
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-50 inline-flex h-10 w-4   items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 md:h-14 w-14"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.11 1.6 5.9L0 24l6.25-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22a9.93 9.93 0 0 1-5.06-1.38l-.36-.21-3.7.97.99-3.6-.23-.37A9.95 9.95 0 1 1 12 22Zm5.73-7.28c-.31-.16-1.84-.91-2.12-1.02-.28-.1-.48-.16-.68.16s-.78 1.02-.96 1.23c-.17.2-.35.23-.66.08-.31-.16-1.32-.49-2.52-1.56-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.53.16-.17.21-.29.31-.49.1-.2.05-.37-.02-.53-.08-.16-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.53.08-.81.37-.28.3-1.07 1.05-1.07 2.56s1.1 2.97 1.26 3.17c.16.2 2.17 3.32 5.26 4.66.74.32 1.32.51 1.77.65.74.23 1.41.2 1.94.12.59-.09 1.84-.75 2.1-1.47.26-.72.26-1.34.18-1.47-.08-.13-.28-.2-.59-.36Z"/>
      </svg>
    </a>
  )
}
