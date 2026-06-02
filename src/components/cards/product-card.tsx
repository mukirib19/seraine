'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  category: string
  price: number
  currency?: string
  imageUrl: string | null
  isAvailable: boolean
  hasBulkPricing?: boolean
  isFavourited?: boolean
  onToggleFavourite?: (id: string) => void
}

export function ProductCard({
  id,
  name,
  slug,
  category,
  price,
  currency = 'KES',
  imageUrl,
  isAvailable,
  hasBulkPricing,
  isFavourited = false,
  onToggleFavourite,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="group bg-white rounded-lg border border-border-subtle overflow-hidden card-hover">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-cream overflow-hidden">
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-border-subtle flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-xs">No image</span>
            </div>
          </div>
        )}

        {/* Availability badge */}
        {!isAvailable && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-error text-white">
              Out of Stock
            </span>
          </div>
        )}

        {/* Favourite button */}
        {onToggleFavourite && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavourite(id)
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-burgundy"
            aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors',
                isFavourited ? 'fill-burgundy text-burgundy' : 'text-muted'
              )}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category pill */}
        <span className="inline-block text-[11px] font-medium text-muted uppercase tracking-wider mb-1.5">
          {category}
        </span>

        {/* Product name */}
        <h3 className="font-heading text-lg font-semibold text-charcoal truncate mb-1">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-charcoal">
            {formatCurrency(price, currency)}
          </span>
          {hasBulkPricing && (
            <span className="text-xs text-gold font-medium">Bulk pricing available</span>
          )}
        </div>

        {/* View button */}
        <Link
          href={`/catalog/${slug}`}
          className="mt-3 w-full inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-md border border-burgundy text-burgundy transition-colors hover:bg-burgundy hover:text-white focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
