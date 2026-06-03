import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Terms of Service | Seraine Creations',
  description: 'Terms and conditions for using Seraine Creations printing and branding services.',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container-narrow py-16 min-h-screen">
        <h1 className="text-4xl font-heading font-bold mb-2" style={{ color: 'var(--text)' }}>Terms of Service</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>Last updated: June 2025</p>

        <div className="space-y-8 prose-custom">

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>1. Acceptance of Terms</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              By accessing or placing an order through Seraine Creations (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>2. Services</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              Seraine Creations provides custom printing, branding, and design services including but not limited to: large format printing, notebook branding, t-shirt printing, mug branding, event decor, and bouquets. All orders are subject to availability and confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>3. Orders & Payment</h2>
            <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              <li>All prices are in Kenyan Shillings (KES) and inclusive of any applicable taxes.</li>
              <li>A deposit may be required before production begins.</li>
              <li>Full payment is required before delivery or collection.</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>We reserve the right to cancel orders that cannot be fulfilled.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>4. Turnaround Time</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              Standard turnaround times are provided as estimates and may vary based on order complexity, material availability, and volume. Rush orders may attract additional charges. We are not liable for delays caused by factors outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>5. Design & Content</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              By submitting artwork or content, you confirm that you own the rights to that content and grant Seraine Creations the right to reproduce it for your order. We reserve the right to decline orders containing offensive, illegal, or inappropriate content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>6. Returns & Refunds</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              Custom printed products are non-refundable unless there is a manufacturing defect or error on our part. Claims must be raised within 48 hours of delivery with photographic evidence. Approved refunds will be processed within 7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>7. Intellectual Property</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              All designs created by Seraine Creations remain our intellectual property unless explicitly transferred in writing. You may not reproduce, resell, or distribute our original designs without written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>8. Limitation of Liability</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              Seraine Creations shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific order in dispute.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>9. Governing Law</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              These terms shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes shall be subject to the jurisdiction of Kenyan courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>10. Contact</h2>
            <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              For questions about these terms, contact us at{' '}
              <a href="mailto:seraine.creation@gmail.com" style={{ color: 'var(--primary)' }}>seraine.creation@gmail.com</a>{' '}
              or call <a href="tel:0705525890" style={{ color: 'var(--primary)' }}>0705525890</a>.
              <br />AFYA BUSINESS PLAZA, KOJA 5th Floor Rm 506A, Nairobi, Kenya.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link href="/privacy" style={{ color: 'var(--primary)' }} className="hover:underline text-sm">
            View Privacy Policy →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
