'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: 'var(--dark)' }}>
      <div className="container-wide relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill text-sm font-medium mb-6" style={{ backgroundColor: 'rgba(37,99,196,0.15)', color: '#2563C4' }}>
              <span>Printing Perfected</span>
            </div>

            <h1 className="text-white mb-4 text-balance">
              Your Vision,{' '}
              <span style={{ color: '#A020C8' }}>Perfectly</span>{' '}
              Printed.
            </h1>

            <p className="text-lg max-w-lg mb-3 leading-relaxed text-white/60">
              DESIGN | PRINTING | BRANDING | GIFTS | EVENT DECOR
            </p>
            <p className="text-base max-w-lg mb-8 leading-relaxed text-white/50">
              From large-format banners to custom apparel, mug branding to event decor — Seraine Creations brings your ideas to life with precision and care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog" className="inline-flex items-center justify-center h-12 px-8 rounded-pill font-medium transition-all hover:opacity-90" style={{ backgroundColor: '#A020C8', color: '#fff' }}>
                Browse Catalog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center h-12 px-8 rounded-pill font-medium transition-all" style={{ border: '1px solid rgba(37,99,196,0.5)', color: '#2563C4' }}>
                Get a Quote
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-white/40">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5BBD2F' }} /><span>Fast Turnaround</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5BBD2F' }} /><span>Quality Guaranteed</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5BBD2F' }} /><span>Delivery Available</span></div>
            </div>
          </motion.div>

          {/* Right — Large Logo */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:flex items-center justify-center">
            <Image src="/assets/logo.png" alt="Seraine Creations" width={400} height={400} className="w-[340px] h-auto object-contain drop-shadow-2xl" priority />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
