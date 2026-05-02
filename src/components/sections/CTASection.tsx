import { ArrowRight, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-32 relative overflow-hidden" style={{ background: "hsl(225 20% 5%)" }}>
      {/* Gold divider top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-25" />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full opacity-[0.06] pointer-events-none animate-glow"
        style={{ background: "radial-gradient(ellipse, hsl(43 85% 52%), transparent 65%)" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div
          className="max-w-5xl mx-auto text-center p-14 md:p-20 rounded-3xl relative overflow-hidden"
          style={{
            background: "var(--gradient-card)",
            border: "1px solid hsl(43 85% 52% / 0.2)",
            boxShadow: "var(--shadow-gold), var(--shadow-elegant)",
          }}
        >
          {/* Corner gold accents */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-30" />
          <div className="absolute top-6 left-6 w-12 h-px bg-gradient-gold opacity-50" />
          <div className="absolute top-6 left-6 h-12 w-px bg-gradient-gold opacity-50" />
          <div className="absolute top-6 right-6 w-12 h-px bg-gradient-gold opacity-50" />
          <div className="absolute top-6 right-6 h-12 w-px bg-gradient-gold opacity-50" />
          <div className="absolute bottom-6 left-6 w-12 h-px bg-gradient-gold opacity-50" />
          <div className="absolute bottom-6 right-6 w-12 h-px bg-gradient-gold opacity-50" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.25)] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Live Platform · Open to New Members
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Wealth Journey{" "}
            <br />
            <span className="text-gold-gradient">Starts Today.</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
            Join over 45,000 investors worldwide who trust ProGlobal Markets to grow
            their wealth — consistently, securely, and transparently.
          </p>

          {/* Trust indicators */}
          <div className="flex justify-center gap-8 mb-10 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-gold" />
              Capital Protected
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-gold" />
              Instant Withdrawals
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-gold" />
              Up to 15% Daily ROI
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="gradient"
              size="lg"
              className="gap-3 h-14 px-10 text-sm font-bold tracking-widest uppercase min-w-[220px]"
              onClick={() => navigate("/auth")}
            >
              Open Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-10 min-w-[180px]"
              onClick={() => navigate("/plans")}
            >
              Explore Plans
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
