import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks as HowItWorksSection } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { MarketTicker } from "@/components/sections/MarketTicker";
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main>
        {/* ── How It Works Hero ── */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[hsl(43_85%_52%/0.04)] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[hsl(225_20%_15%/0.06)] rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)] text-gold text-xs font-bold uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3" />
                Streamlined Wealth Creation
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Your Journey to <span className="text-gold-gradient">Financial Mastery</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light mb-12 max-w-2xl mx-auto">
                We've simplified the complexities of global markets. Follow our transparent, four-stage process to begin building your institutional-grade portfolio today.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="gradient" onClick={() => navigate("/auth")}>
                  Start Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline">
                  View Plans
                </Button>
              </div>
            </div>
          </div>
        </section>

        <MarketTicker />

        {/* ── Detailed Step-by-Step ── */}
        <section className="py-24 bg-[hsl(225_20%_5%)]">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-gold/10 shadow-elegant">
                  <img 
                    src="/platform.png" 
                    alt="Platform Interface" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(225_20%_5%)] via-transparent to-transparent" />
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 p-6 rounded-2xl bg-card-luxury shadow-gold animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">Transaction</p>
                      <p className="font-bold">Verified Instantly</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="font-display text-4xl font-bold mb-12">
                  The <span className="text-gold-gradient">4-Step</span> Process
                </h2>
                <div className="space-y-12">
                  {[
                    { step: "01", title: "Global Registration", desc: "Access our ecosystem with a single, secure login. Use biometric-ready authentication for peace of mind." },
                    { step: "02", title: "Institutional KYC", desc: "Complete our swift identity verification. We adhere to global AML and KYC standards to protect your assets." },
                    { step: "03", title: "Precision Funding", desc: "Deposit capital using diverse methods including Cryptocurrency and Swift Bank Transfers." },
                    { step: "04", title: "Algorithmic Growth", desc: "Deploy your capital into our high-performance investment tiers and watch your wealth grow daily." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="font-display text-4xl font-black text-gold/20 group-hover:text-gold/40 transition-colors shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main How It Works Section (The Cards) ── */}
        <HowItWorksSection />

        {/* ── Security Section ── */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-card-luxury p-12 rounded-[2rem] border border-gold/20 relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="w-32 h-32 text-gold" />
              </div>
              <div className="relative z-10">
                <h2 className="font-display text-3xl font-bold mb-6">Security is Not an Option, It's Our <span className="text-gold-gradient">Foundation</span></h2>
                <p className="text-lg text-muted-foreground mb-10">
                  Every transaction on ProGlobal Markets is secured by multi-signature vaults and end-to-end encryption. Your funds are held in segregated accounts, separate from company operations.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <Lock className="w-6 h-6 text-gold shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1">Cold Storage</h4>
                      <p className="text-sm text-muted-foreground">95% of digital assets are held in offline, air-gapped vaults.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-gold shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1">256-bit Encryption</h4>
                      <p className="text-sm text-muted-foreground">Bank-level security for all data transfers and personal information.</p>
                    </div>
                  </div>
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

export default HowItWorks;
