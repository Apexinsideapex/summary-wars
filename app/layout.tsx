import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Summary Wars",
  description: "Compare AI model summaries",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.cdnfonts.com/css/radion-73225f" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialiased font-radion`}>
        <Providers>
          <div className="geometric-pattern min-h-screen">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

import './globals.css'