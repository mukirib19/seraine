import { HeroSection } from './sections/hero'
import { MarqueeStrip } from './sections/marquee-strip'
import { ServicesSection } from './sections/services'
import { FeaturedProducts } from './sections/featured-products'
import { PortfolioTeaser } from './sections/portfolio-teaser'
import { HowItWorks } from './sections/how-it-works'
import { ReviewsCarousel } from './sections/reviews-carousel'
import { AvailabilityBanner } from './sections/availability-banner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <ServicesSection />
      <FeaturedProducts />
      <PortfolioTeaser />
      <AvailabilityBanner />
      <HowItWorks />
      <ReviewsCarousel />
    </>
  )
}
