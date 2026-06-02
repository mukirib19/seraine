'use client'
import { StatCard } from '@/components/cards/stat-card'
import { Package, Clock, CheckCircle } from 'lucide-react'

export default function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl">Staff Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Assigned Orders" value={0} icon={Package} />
        <StatCard label="In Production" value={0} icon={Clock} />
        <StatCard label="Completed Today" value={0} icon={CheckCircle} />
      </div>
      <div className="bg-white rounded-lg border border-border-subtle p-6 text-center text-muted py-16">Production queue will appear here.</div>
    </div>
  )
}
