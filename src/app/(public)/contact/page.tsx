'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('quotations').insert({ customer_name: fd.get('name') as string, customer_email: fd.get('email') as string, customer_phone: fd.get('phone') as string, service_type: fd.get('service') as string, brief: fd.get('message') as string })
    setLoading(false)
    if (error) { toast.error('Failed to send. Please try again.'); return }
    toast.success('Message sent! We\'ll get back to you shortly.')
    ;(e.target as HTMLFormElement).reset()
  }
  return (
    <div className="container-wide section-padding">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <h1 className="mb-4">Get in Touch</h1>
          <p className="mb-8" style={{ color: 'var(--muted)' }}>Have a project in mind? Send us the details and we&apos;ll get back to you with a quote.</p>
          <div className="space-y-5">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(37,99,196,0.1)' }}><Phone className="w-5 h-5" style={{ color: 'var(--primary)' }} /></div><div><p className="text-sm" style={{ color: 'var(--muted)' }}>Phone</p><p className="font-medium">0705525890</p></div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(37,99,196,0.1)' }}><Mail className="w-5 h-5" style={{ color: 'var(--primary)' }} /></div><div><p className="text-sm" style={{ color: 'var(--muted)' }}>Email</p><p className="font-medium">seraine.creation@gmail.com</p></div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(37,99,196,0.1)' }}><MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} /></div><div><p className="text-sm" style={{ color: 'var(--muted)' }}>Address</p><p className="font-medium">AFYA BUSINESS PLAZA, KOJA 5th Floor Rm 506A</p></div></div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="lg:col-span-3 rounded-2xl p-6 space-y-5" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input name="name" label="Full Name" required placeholder="Your name" />
            <Input name="email" label="Email" type="email" required placeholder="you@example.com" />
          </div>
          <Input name="phone" label="Phone" placeholder="0705525890" />
          <Input name="service" label="Service Type" required placeholder="e.g. T-Shirt Printing" />
          <Textarea name="message" label="Project Brief" required placeholder="Describe your project..." rows={5} />
          <Button type="submit" isLoading={loading} rightIcon={!loading ? <Send className="w-4 h-4" /> : undefined} className="w-full sm:w-auto btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>Send Message</Button>
        </form>
      </div>
    </div>
  )
}
