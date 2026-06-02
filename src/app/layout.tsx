import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'

export const metadata: Metadata = {
  title: {
    default: 'Seraine Creations — Printing Perfected',
    template: '%s | Seraine Creations',
  },
  description: 'Seraine Creations — Printing Perfected. DESIGN | PRINTING | BRANDING | GIFTS | EVENT DECOR. Large format printing, t-shirt printing, mug branding, bouquets, event decor and more in Nairobi, Kenya.',
  keywords: ['printing', 'Kenya', 'branding', 'Seraine Creations', 't-shirt printing', 'mug branding', 'large format', 'event decor', 'Nairobi'],
  icons: {
    icon: '/assets/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: 'Seraine Creations',
    title: 'Seraine Creations — Printing Perfected',
    description: 'DESIGN | PRINTING | BRANDING | GIFTS | EVENT DECOR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="font-body antialiased" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: "'Inter', system-ui, sans-serif", borderRadius: '12px' },
          }}
          richColors
          closeButton
          visibleToasts={3}
          duration={4000}
        />
      </body>
    </html>
  )
}
