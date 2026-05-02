import { ArrowRight, TrendingUp, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const portfolioItems = [
  { asset: "BTC/USD",   change: "+8.4%",  isUp: true,  value: "$64,230" },
  { asset: "ETH/USD",   change: "+5.1%",  isUp: true,  value: "$3,450"  },
  { asset: "Gold",      change: "+2.3%",  isUp: true,  value: "$2,340"  },
  { asset: "S&P 500",   change: "-0.4%",  isUp: false, value: "$5,230"  },
]

const trustBadges = [
  { icon: ShieldCheck, label: "SSL Secured"      },
  { icon: TrendingUp,  label: "15% Daily Max ROI" },
  { icon: Zap,         label: "Instant Withdrawals" },
]

export const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 min-h-[100vh] flex items-center overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* ── Background Orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large gold orb — left */}
        <div
          className="absolute -left-40 top-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06] animate-glow"
          style={{ background: "radial-gradient(circle, hsl(43 90% 55%), transparent 70%)" }}
        />
        {/* Smaller gold orb — right */}
        <div
          className="absolute -right-20 bottom-1/4 w-[400px] h-[400px] rounded-full opacity-[0.08] animate-float-delayed"
          style={{ background: "radial-gradient(circle, hsl(43 85% 52%), transparent 65%)" }}
        />
        {/* Fine grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(43 85% 52%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 85% 52%) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Top-center spotlight */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, hsl(43 85% 52%), transparent 60%)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Content ── */}
          <div className="space-y-10">

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[hsl(43_85%_52%/0.08)] border border-[hsl(43_85%_52%/0.25)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Trusted by 45,000+ Global Investors
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                Grow Wealth.{" "}
                <br />
                <span className="shimmer-text">Build Legacy.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg font-light">
                Access institutional-grade investment strategies. ProGlobal Markets delivers
                consistent, high-yield returns across Forex, Crypto, and Real Estate.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant="gradient"
                size="lg"
                className="gap-3 tracking-wide uppercase text-sm font-bold h-14 px-8"
                onClick={() => navigate("/auth")}
              >
                Start Investing Today
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-3 tracking-wide h-14 px-8"
                onClick={() => navigate("/plans")}
              >
                View All Plans
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-2">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <badge.icon className="w-4 h-4 text-gold" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Live Portfolio Card ── */}
          <div className="relative flex justify-center lg:justify-end animate-float">
            {/* Glow behind card */}
            <div
              className="absolute inset-0 rounded-3xl blur-3xl opacity-20 scale-95"
              style={{ background: "radial-gradient(ellipse, hsl(43 85% 52%), transparent 70%)" }}
            />

            <div className="relative w-full max-w-sm bg-card-luxury rounded-3xl overflow-hidden">
              {/* Gold top border */}
              <div className="h-px bg-gradient-gold opacity-60" />

              <div className="p-8 space-y-6">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Portfolio Value</p>
                    <p className="font-display text-4xl font-bold text-gold mt-1">$284,920</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)]">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    <span className="text-xs font-bold text-gold">+12.4%</span>
                  </div>
                </div>

                {/* Thin gold divider */}
                <div className="gold-divider" />

                {/* Live Assets */}
                <div className="space-y-4">
                  {portfolioItems.map((item) => (
                    <div key={item.asset} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[hsl(43_85%_52%/0.1)] flex items-center justify-center">
                          <span className="text-[10px] font-bold text-gold">{item.asset.slice(0, 2)}</span>
                        </div>
                        <span className="text-sm font-medium">{item.asset}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{item.value}</p>
                        <p className={`text-xs font-semibold ${item.isUp ? "text-emerald-400" : "text-red-400"}`}>
                          {item.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gold divider */}
                <div className="gold-divider" />

                {/* Monthly Earnings */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">This Month's Earnings</p>
                  <p className="font-display text-xl font-bold text-gold">+$14,320</p>
                </div>
              </div>

              {/* Gold bottom border */}
              <div className="h-px bg-gradient-gold opacity-60" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
