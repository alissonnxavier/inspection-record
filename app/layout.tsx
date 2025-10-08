import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '../components/providers/Providers';
import { ToasterProvider } from '@/components/providers/toast-provider';
import { siteConfig } from '@/config/site';
import { ModalProvider } from '@/providers/modal-provider';
import { DrawerPressProvider } from '@/providers/drawer-provider-press';
import { DrawerPunchingProvider } from '@/providers/drawer-provider-punching';
import { DrawerThreaderProvider } from '@/providers/drawer-provider-threader';
import { DrawerFoldProvider } from '@/providers/drawer-provider-fold';
import { DrawerSoldierProvider } from '@/providers/drawer-provider-soldier';
import { DrawerFinishingProvider } from '@/providers/drawer-provider-finishing';
import { DrawerPlateProvider } from '@/providers/drawer-provider-plate';
import { DrawerSerigraphyProvider } from '@/providers/drawer-provider-serigraphy';
import { ProviderGallery } from '@/providers/modal-provider-gallery';
import { AdminProvider } from '@/providers/admin-provider';
import { EditFormProvider } from '@/providers/edit-form-provider';
import { ReportProvider } from '@/providers/report-provider';
import { Timeline } from '@/providers/timeline-provider';

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
      href: '/logo.svg'
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
            <ToasterProvider />
            <EditFormProvider />
            <ModalProvider />
            <AdminProvider />
            <DrawerPressProvider />
            <DrawerPunchingProvider />
            <DrawerThreaderProvider />
            <DrawerFoldProvider />
            <DrawerSoldierProvider />
            <DrawerFinishingProvider />
            <DrawerPlateProvider />
            <DrawerSerigraphyProvider />
            <ProviderGallery />
            <ReportProvider />
            <Timeline />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
