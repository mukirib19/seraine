'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'seraine-cookies-accepted'

interface CookieConsentProps {
  className?: string
  onAccept?: () => void
  onManage?: () => void
}

export function CookieConsent({ className, onAccept, onManage }: CookieConsentProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Delay check to avoid SSR mismatch
    const timer = setTimeout(() => {
      try {
        const accepted = localStorage.getItem(STORAGE_KEY)
        if (!accepted) {
          setVisible(true)
        }
      } catch {
        // localStorage not available
        setVisible(true)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // fail silently
    }
    setVisible(false)
    onAccept?.()
  }

  const handleManage = () => {
    onManage?.()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[55] bg-cream border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)]',
            className
          )}
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="container-default py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Icon + Text */}
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                <p className="text-sm text-charcoal leading-relaxed">
                  We use cookies to enhance your browsing experience and analyse site traffic.
                  By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleManage}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-charcoal/5 rounded-lg transition-colors duration-200 touch-target"
                >
                  <Settings className="w-4 h-4" />
                  Manage
                </button>

                <button
                  onClick={handleAccept}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-burgundy hover:bg-burgundy-hover rounded-lg transition-colors duration-200 touch-target flex-1 sm:flex-initial"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
