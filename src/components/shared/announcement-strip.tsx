'use client'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

export function AnnouncementStrip({ text, url, onDismiss }: { text: string; url?: string; onDismiss: () => void }) {
  return (
    <motion.div initial={{ y: -40 }} animate={{ y: 0 }} className="bg-burgundy text-white text-sm text-center py-2.5 px-4 relative">
      {url ? <a href={url} className="hover:underline">{text}</a> : <span>{text}</span>}
      <button onClick={onDismiss} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" aria-label="Dismiss"><X className="w-4 h-4" /></button>
    </motion.div>
  )
}
