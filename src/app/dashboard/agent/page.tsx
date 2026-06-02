'use client'
import { StatCard } from '@/components/cards/stat-card'
import { Truck, Clock, CheckCircle } from 'lucide-react'

export default function AgentDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl">My Deliveries</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Assigned" value={0} icon={Truck} />
        <StatCard label="In Transit" value={0} icon={Clock} />
        <StatCard label="Delivered Today" value={0} icon={CheckCircle} />
      </div>
      <div className="bg-white rounded-lg border border-border-subtle p-6 text-center text-muted py-16">Your assigned deliveries will appear here.</div>
    </div>
  )
}
