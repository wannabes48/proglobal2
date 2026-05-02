import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Professional Trader",
    location: "London, UK",
    content: "ProGlobal Markets has completely transformed how I manage my investments. The returns are consistent, the platform is secure, and withdrawals are always on time. Truly world-class.",
    stars: 5,
    plan: "Diamond Plan",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Crypto Investor",
    location: "Singapore",
    content: "The daily payouts on the Diamond plan are exactly what I was looking for. After six months with ProGlobal, I've reinvested three times. The ROI is unmatched in this space.",
    stars: 5,
    plan: "Diamond Plan",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Real Estate Developer",
    location: "Madrid, Spain",
    content: "I've diversified my portfolio significantly using ProGlobal. It's the most reliable financial platform I've encountered. The KYC process was smooth and support is exceptional.",
    stars: 5,
    plan: "Gold Plan",
  },
  {
    id: 4,
    name: "David Smith",
    role: "Retired Executive",
    location: "New York, USA",
    content: "Started with the Gold plan after careful research. The transparency is remarkable — every transaction is logged and my account manager keeps me informed. Absolutely recommend.",
    stars: 5,
    plan: "VIP Plan",
  },
]

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = (idx: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(idx)
      setIsTransitioning(false)
    }, 200)
  }

  const next = () => goTo((currentIndex + 1) % testimonials.length)
  const prev = () => goTo(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const t = testimonials[currentIndex]

  return (
    <section
      className="py-32 relative overflow-hidden"
      style={{ background: "hsl(225 20% 5%)" }}
    >
      {/* Gold divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(43 85% 52%), transparent 70%)" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-4">Client Testimonials</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold">
            Voices of{" "}
            <span className="text-gold-gradient">Success</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div
            className="relative p-12 md:p-16 rounded-3xl transition-opacity duration-200"
            style={{
              background: "var(--gradient-card)",
              border: "1px solid hsl(43 85% 52% / 0.15)",
              boxShadow: "var(--shadow-card)",
              opacity: isTransitioning ? 0 : 1,
            }}
          >
            {/* Gold top accent */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-gold opacity-40" />

            {/* Large quote mark */}
            <Quote
              className="w-16 h-16 mb-8 opacity-[0.07] absolute top-8 left-10"
              style={{ color: "hsl(43 85% 52%)" }}
            />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.stars }).map((_, i) => (
                <span key={i} className="text-gold text-lg">★</span>
              ))}
            </div>

            {/* Quote Text */}
            <blockquote className="font-display text-2xl md:text-3xl font-light leading-relaxed text-foreground/90 mb-10 italic">
              "{t.content}"
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl font-bold"
                  style={{ background: "var(--gradient-gold)", color: "hsl(225 20% 6%)" }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-base">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role} · {t.location}</p>
                </div>
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: "hsl(43 85% 52% / 0.1)", color: "hsl(43 85% 62%)", border: "1px solid hsl(43 85% 52% / 0.2)" }}
              >
                {t.plan}
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-gold opacity-20" />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-[hsl(43_85%_52%/0.2)] text-muted-foreground hover:text-gold hover:border-[hsl(43_85%_52%/0.5)] transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-gold" : "w-2 bg-muted-foreground/30"}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full border border-[hsl(43_85%_52%/0.2)] text-muted-foreground hover:text-gold hover:border-[hsl(43_85%_52%/0.5)] transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
