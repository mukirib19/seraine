import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format amount in KES */
export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/** Format date relative to now */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

/** Format date as readable string */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

/** Format date and time */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Truncate text with ellipsis */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/** Generate slug from text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Format phone number with +254 prefix */
export function formatPhoneKE(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('254')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  if (cleaned.startsWith('0')) {
    return `+254 ${cleaned.slice(1, 4)} ${cleaned.slice(4)}`
  }
  return `+254 ${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
}

/** Get initials from full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/** Check if currently within business hours */
export function isWithinHours(
  hours: { is_open: boolean; open_time: string | null; close_time: string | null } | null
): boolean {
  if (!hours || !hours.is_open || !hours.open_time || !hours.close_time) return false

  const now = new Date()
  const [openH, openM] = hours.open_time.split(':').map(Number)
  const [closeH, closeM] = hours.close_time.split(':').map(Number)

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

/** Order status color mapping */
export const ORDER_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:        { bg: 'bg-amber-50',     text: 'text-amber-800',    dot: 'bg-amber-500' },
  confirmed:      { bg: 'bg-blue-50',      text: 'text-info',         dot: 'bg-info' },
  in_production:  { bg: 'bg-burgundy/10',  text: 'text-burgundy',     dot: 'bg-burgundy' },
  quality_check:  { bg: 'bg-purple-50',    text: 'text-purple-800',   dot: 'bg-purple-500' },
  ready:          { bg: 'bg-teal-50',      text: 'text-teal-800',     dot: 'bg-teal-500' },
  dispatched:     { bg: 'bg-orange-50',    text: 'text-orange-800',   dot: 'bg-orange-500' },
  delivered:      { bg: 'bg-emerald-50',   text: 'text-success',      dot: 'bg-success' },
  cancelled:      { bg: 'bg-red-50',       text: 'text-error',        dot: 'bg-error' },
  refunded:       { bg: 'bg-gray-100',     text: 'text-muted',        dot: 'bg-muted' },
}

/** Payment status color mapping */
export const PAYMENT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:    { bg: 'bg-amber-50',    text: 'text-amber-800' },
  processing: { bg: 'bg-blue-50',    text: 'text-info' },
  confirmed:  { bg: 'bg-emerald-50', text: 'text-success' },
  failed:     { bg: 'bg-red-50',     text: 'text-error' },
  refunded:   { bg: 'bg-gray-100',   text: 'text-muted' },
}

/** Format order status for display */
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** Delivery type labels */
export const DELIVERY_TYPES: Record<string, string> = {
  delivery: 'Delivery',
  pickup: 'Pickup',
}

/** Role labels */
export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  staff: 'Staff',
  logistics: 'Logistics Manager',
  delivery_agent: 'Delivery Agent',
  customer: 'Customer',
}

/** Role dashboard paths */
export const ROLE_DASHBOARD_PATHS: Record<string, string> = {
  admin: '/dashboard/admin',
  staff: '/dashboard/staff',
  logistics: '/dashboard/logistics',
  delivery_agent: '/dashboard/agent',
  customer: '/dashboard/customer',
}
