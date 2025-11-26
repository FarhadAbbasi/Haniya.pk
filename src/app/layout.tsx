import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import { Toaster } from "@/components/ui/sonner";
import WhatsAppFab from "@/components/site/whatsapp-fab";
import MarketingWelcomeModal from "@/components/site/marketing-welcome-modal";
import NotificationsPrompt from "@/components/site/notifications-prompt";
import PushInit from "@/components/site/push-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haniya — Premium Lawn, Khaddar, Cotton Suits",
  description: "Modern Pakistani women’s clothing. Premium lawn, khaddar, and cotton suits with effortless style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Header />
          <main className="min-h-[calc(100dvh-64px)]">
            {children}
          </main>
          <Footer />
          <WhatsAppFab />
          <Toaster richColors closeButton position="top-right" />
          <MarketingWelcomeModal />
          <NotificationsPrompt />
          <PushInit />
        </ThemeProvider>
      </body>
    </html>
  );
}
