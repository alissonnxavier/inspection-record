
import dynamic from 'next/dynamic'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '../components/providers/Providers'
import { Toaster } from 'react-hot-toast';
import { ToasterProvider } from '@/components/providers/toast-provider'
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.description}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: '/logo.svg',
      href:'/logo.svg'
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider/>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
