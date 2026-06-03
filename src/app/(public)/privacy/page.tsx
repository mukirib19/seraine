import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Seraine Creations',
  description: 'How Seraine Creations collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container-narrow py-16 min-h-screen">
        <h1 className="text-4xl font-heading font-bold mb-2" style={{ color: 'var(--text)' }}>Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>Last updated: June 2025</p>

        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>1. Information We Collect</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>We collect information you provide directly to us:</p>
            <ul className="list-disc list-inside mt-2 space-y-1" style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              <li><strong>Account information:</strong> Full name, email address, phone number</li>
              <li><strong>Order information:</strong> Items ordered, delivery address, payment details</li>
              <li><strong>Design files:</strong> Artwork, logos, and content you submit for printing</li>
              <li><strong>Communication:</strong> Messages you send us via WhatsApp, email, or contact form</li>
              <li><strong>Usage data:</strong> Pages visited, browser type, device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              <li>To process and fulfil your orders</li>
              <li>To communicate with you about your orders and our services</li>
              <li>To send promotional offers (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>3. Information Sharing</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1" style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              <li><strong>Service providers:</strong> Supabase (database), Netlify (hosting), Google (authentication)</li>
              <li><strong>Delivery partners:</strong> Only your name and delivery address for fulfilment</li>
              <li><strong>Legal authorities:</strong> When required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>4. Data Storage & Security</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              Your data is stored securely using Supabase, which is hosted on AWS infrastructure. We implement industry-standard security measures including encrypted connections (HTTPS), row-level security policies, and access controls. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>5. Cookies</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              We use essential cookies to maintain your session and remember your preferences (such as dark mode). We do not use tracking or advertising cookies. You can disable cookies in your browser settings, but this may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>6. Your Rights</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1" style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Data portability — request a copy of your data</li>
            </ul>
            <p className="mt-3" style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              You can delete your account directly from your{' '}
              <Link href="/profile" style={{ color: 'var(--primary)' }}>profile page</Link>. For other requests, contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>7. Third-Party Links</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              Our website may contain links to third-party sites (Instagram, LinkedIn, WhatsApp). We are not responsible for the privacy practices of these sites and encourage you to read their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>8. Children&apos;s Privacy</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>9. Changes to This Policy</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>10. Contact Us</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              For privacy-related questions or requests, contact us at:<br />
              <a href="mailto:seraine.creation@gmail.com" style={{ color: 'var(--primary)' }}>seraine.creation@gmail.com</a><br />
              <a href="tel:0705525890" style={{ color: 'var(--primary)' }}>0705525890</a><br />
              AFYA BUSINESS PLAZA, KOJA 5th Floor Rm 506A, Nairobi, Kenya.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link href="/terms" style={{ color: 'var(--primary)' }} className="hover:underline text-sm">
            View Terms of Service →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
