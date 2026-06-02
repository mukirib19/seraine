'use client'
import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  return (
    <a href="https://wa.me/254705525890" target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110"
      style={{ backgroundColor: '#25D366' }} aria-label="Chat on WhatsApp">
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  )
}
