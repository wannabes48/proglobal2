import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InvestmentPlans } from "@/components/sections/InvestmentPlans";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { MarketTicker } from "@/components/sections/MarketTicker";
import { Shield, TrendingUp, Zap } from "lucide-react";

const Plans = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main>
        {/* ── Plans Page Hero ── */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[hsl(43_85%_52%/0.03)] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(225_20%_15%/0.05)] rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)] text-gold text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                <Shield className="w-3 h-3" />
                Institutional-Grade Security
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Designed for <span className="text-gold-gradient">Maximum Yield</span>, Engineered for <span className="text-gold-gradient">Safety</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light mb-12 max-w-2xl mx-auto">
                Explore our meticulously crafted investment tiers. Whether you are starting small or managing a large portfolio, our plans provide the stability and growth you deserve.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {[
                  { icon: Zap, title: "Instant Execution", desc: "Your capital starts earning from the moment of deposit." },
                  { icon: TrendingUp, title: "Daily Accruals", desc: "Watch your wealth grow in real-time with daily profit distributions." },
                  { icon: Shield, title: "Capital Protection", desc: "Our advanced risk-mitigation strategies ensure your principal is secure." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card-luxury group hover:-translate-y-1 transition-all duration-300">
                    <item.icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <MarketTicker />

        {/* ── Investment Tiers ── */}
        <InvestmentPlans />

        {/* ── Plan Comparison / Features Detail ── */}
        <section className="py-24 bg-[hsl(225_20%_5%)] border-y border-border/40">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-4xl font-bold mb-8">
                  The <span className="text-gold-gradient">Obsidian Standard</span> of Investing
                </h2>
                <div className="space-y-6">
                  {[
                    "Fixed daily returns paid out 7 days a week",
                    "Principal returned in full at the end of the investment cycle",
                    "No hidden management fees or performance charges",
                    "Automated reinvestment options for compounded growth",
                    "Withdraw your earnings instantly with zero latency"
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-gold" />
                      </div>
                      <p className="text-lg text-foreground/80">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden border border-gold/20 shadow-glow">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000" 
                    alt="Luxury Finance" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating Stats */}
                <div className="absolute -bottom-8 -left-8 p-6 rounded-2xl bg-card-luxury shadow-elegant z-20">
                  <p className="text-gold text-2xl font-bold">$4.2B+</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Assets Managed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQ />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Plans;
