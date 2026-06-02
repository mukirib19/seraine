'use client'

import { Search, ShoppingBag, Truck } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Browse & Customise',
    description: 'Explore our catalog, select your product, upload your design, and choose your options.',
  },
  {
    icon: ShoppingBag,
    title: 'Place Your Order',
    description: 'Pay securely via M-Pesa or card. We confirm and get to work immediately.',
  },
  {
    icon: Truck,
    title: 'We Deliver',
    description: 'Track your order in real-time. We deliver across Kenya or you can pick up.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container-wide">
        <div className="text-center mb-14">
          <h2 className="text-charcoal mb-4">How It Works</h2>
          <p className="text-muted">Three simple steps from idea to delivery.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-12 left-[16.67%] right-[16.67%] h-[2px] bg-border" />

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step number circle */}
                <div className="relative mx-auto w-24 h-24 rounded-full bg-burgundy/10 flex items-center justify-center mb-6 z-10">
                  <step.icon className="w-8 h-8 text-burgundy" />
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-burgundy text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>

                {/* Connecting line — mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute top-24 left-1/2 w-[2px] h-10 bg-border -translate-x-1/2" />
                )}

                <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
