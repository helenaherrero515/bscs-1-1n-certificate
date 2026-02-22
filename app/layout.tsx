import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Poppins } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'PUP BSCS 1-1N Certificate Portal',
  description:
    "Get your President's Lister & Dean's Lister certificate here. BSCS 1-1N, CTRL+ 1-1N.",
}

export const viewport: Viewport = {
  themeColor: '#2551b1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
