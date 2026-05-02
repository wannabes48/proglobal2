import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Check, Crown, Star, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Starter",
    tagline: "Begin your journey",
    roi: "3.0%",
    period: "Daily",
    min: "$50",
    max: "$999",
    duration: "30 Days",
    features: ["Instant Withdrawals", "24/7 Support", "Secure Vault Storage"],
    icon: Star,
    isFeatured: false,
    borderStyle: "border-border/50 hover:border-[hsl(43_85%_52%/0.3)]",
    badgeStyle: "bg-muted text-muted-foreground",
  },
  {
    name: "Bronze",
    tagline: "Build momentum",
    roi: "4.0%",
    period: "Daily",
    min: "$1,000",
    max: "$4,999",
    duration: "45 Days",
    features: ["Instant Withdrawals", "Priority Support", "Secure Vault Storage"],
    icon: Star,
    isFeatured: false,
    borderStyle: "border-border/50 hover:border-[hsl(43_85%_52%/0.3)]",
    badgeStyle: "bg-[hsl(25_60%_30%/0.3)] text-[hsl(25_70%_65%)]",
  },
  {
    name: "Silver",
    tagline: "Accelerate returns",
    roi: "5.5%",
    period: "Daily",
    min: "$5,000",
    max: "$9,999",
    duration: "60 Days",
    features: ["Instant Withdrawals", "VIP Support", "Capital Protection Shield"],
    icon: Star,
    isFeatured: false,
    borderStyle: "border-border/50 hover:border-[hsl(43_85%_52%/0.3)]",
    badgeStyle: "bg-[hsl(220_15%_30%/0.5)] text-[hsl(220_15%_75%)]",
  },
  {
    name: "Gold",
    tagline: "The premium standard",
    roi: "7.0%",
    period: "Daily",
    min: "$10,000",
    max: "$49,999",
    duration: "90 Days",
    features: ["Instant Withdrawals", "Dedicated Account Manager", "Capital Protection Shield", "Auto-Compounding"],
    icon: Crown,
    isFeatured: true,
    borderStyle: "border-[hsl(43_85%_52%/0.4)] hover:border-[hsl(43_85%_52%/0.7)]",
    badgeStyle: "bg-gradient-gold text-[hsl(225_20%_6%)]",
  },
  {
    name: "Diamond",
    tagline: "Elite wealth creation",
    roi: "10.0%",
    period: "Daily",
    min: "$50,000",
    max: "$99,999",
    duration: "120 Days",
    features: ["Instant Withdrawals", "Private Wealth Advisor", "Capital Protection Shield", "Auto-Compounding", "Portfolio Analytics"],
    icon: Sparkles,
    isFeatured: false,
    borderStyle: "border-border/50 hover:border-[hsl(43_85%_52%/0.3)]",
    badgeStyle: "bg-[hsl(200_80%_30%/0.3)] text-[hsl(200_80%_75%)]",
  },
  {
    name: "VIP",
    tagline: "Unlimited potential",
    roi: "15.0%",
    period: "Daily",
    min: "$100,000",
    max: "Unlimited",
    duration: "180 Days",
    features: ["Instant Withdrawals", "C-Suite Wealth Team", "Full Capital Protection", "Auto-Compounding", "Portfolio Analytics", "Tax Optimization"],
    icon: Crown,
    isFeatured: false,
    borderStyle: "border-border/50 hover:border-[hsl(43_85%_52%/0.3)]",
    badgeStyle: "bg-[hsl(280_60%_30%/0.3)] text-[hsl(280_60%_75%)]",
  },
]

export const InvestmentPlans = () => {
  const navigate = useNavigate()

  return (
    <section id="plans" className="py-32 relative overflow-hidden" style={{ background: "var(--gradient-obsidian)" }}>
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(43 85% 52%), transparent 70%)" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-4">
            Investment Plans
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Choose Your{" "}
            <span className="text-gold-gradient">Wealth Tier</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
            From first-time investors to seasoned portfolio managers — each plan is engineered
            for consistent, risk-managed returns.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border transition-all duration-500 hover:-translate-y-2 overflow-hidden ${plan.borderStyle} ${
                  plan.isFeatured ? "shadow-gold" : "shadow-card"
                }`}
                style={{ background: "var(--gradient-card)" }}
              >
                {/* Gold scan shimmer on featured */}
                {plan.isFeatured && <div className="card-scan absolute inset-0 pointer-events-none z-0" />}

                {/* Featured banner */}
                {plan.isFeatured && (
                  <div className="bg-gradient-gold px-4 py-2 text-center">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[hsl(225_20%_6%)]">
                      ★ Most Popular ★
                    </p>
                  </div>
                )}

                {/* Gold top accent line */}
                <div className={`h-px ${plan.isFeatured ? "bg-gradient-gold opacity-80" : "bg-border/40"}`} />

                <div className="p-8 relative z-10">
                  {/* Plan badge & icon */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 ${plan.badgeStyle}`}>
                        <Icon className="w-3 h-3" />
                        {plan.name}
                      </div>
                      <p className="text-muted-foreground text-sm">{plan.tagline}</p>
                    </div>
                  </div>

                  {/* ROI */}
                  <div className="mb-8">
                    <div className="flex items-end gap-2">
                      <span className="font-display text-6xl font-bold text-gold-gradient">{plan.roi}</span>
                      <span className="text-muted-foreground mb-2 text-sm">{plan.period}</span>
                    </div>
                  </div>

                  {/* Investment range */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Min / Max</span>
                      <span className="font-semibold">{plan.min} — {plan.max}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Lock Period</span>
                      <span className="font-semibold">{plan.duration}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <div className="w-4 h-4 rounded-full bg-[hsl(43_85%_52%/0.15)] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-gold" />
                        </div>
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.isFeatured ? "gradient" : "outline"}
                    className="w-full h-12 text-sm font-semibold tracking-wide uppercase"
                    onClick={() => navigate("/auth")}
                  >
                    Invest in {plan.name}
                  </Button>
                </div>

                {/* Bottom gold accent line */}
                {plan.isFeatured && <div className="h-px bg-gradient-gold opacity-40" />}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
