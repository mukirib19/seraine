export function MarqueeStrip() {
  const items = 'Large Format Printing · T-Shirt Printing · Mug Branding · Event Decor · Notebooks · Bouquets · Graphic Design · Bottle Branding · Custom Gifts ·'

  return (
    <div className="marquee-container py-3 border-y" style={{ backgroundColor: 'var(--dark)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="marquee-content">
        {[items, items].map((text, i) => (
          <span key={i} className="text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap px-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
