'use client'
import { StatCard } from '@/components/cards/stat-card'
import { Truck, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function LogisticsDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl">Logistics Dashboard</h1>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Deliveries" value={0} icon={Truck} />
        <StatCard label="Pending Assignment" value={0} icon={Clock} />
        <StatCard label="Delivered Today" value={0} icon={CheckCircle} />
        <StatCard label="Failed" value={0} icon={AlertTriangle} />
      </div>
      <div className="bg-white rounded-lg border border-border-subtle p-6 text-center text-muted py-16">Delivery management will appear here.</div>
    </div>
  )
}
