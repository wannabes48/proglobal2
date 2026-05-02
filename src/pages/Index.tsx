import { Header } from "@/components/layout/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { MarketTicker } from "@/components/sections/MarketTicker"
import { InvestmentPlans } from "@/components/sections/InvestmentPlans"
import { Stats } from "@/components/sections/Stats"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Testimonials } from "@/components/sections/Testimonials"
import { FAQ } from "@/components/sections/FAQ"
import { CTASection } from "@/components/sections/CTASection"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/toaster"

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      <Header />
      <main>
        <HeroSection />
        <MarketTicker />
        <Stats />
        <InvestmentPlans />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default Index
