import {
  UserPlus, Mail, ShieldCheck, Wallet,
  TrendingUp, Send, Users, Lock,
} from "lucide-react"

const steps = [
  { title: "Register an Account", description: "Create your secure account with basic details to get started instantly.", icon: UserPlus },
  { title: "Verify Your Email",   description: "Confirm your email address to secure your account and communications.", icon: Mail },
  { title: "Complete KYC",        description: "Quick identity verification for full platform access and enhanced limits.", icon: ShieldCheck },
  { title: "Fund Your Wallet",    description: "Deposit using Bitcoin, Ethereum, USDT, or bank transfer.", icon: Wallet },
  { title: "Choose a Plan",       description: "Select an investment tier aligned with your financial goals.", icon: TrendingUp },
  { title: "Transfer Funds",      description: "Move capital seamlessly between accounts or to other users.", icon: Send },
  { title: "Refer & Earn",        description: "Invite others and earn commissions on their first investment.", icon: Users },
  { title: "Bank-Grade Security", description: "Your assets are protected by military-grade encryption protocols.", icon: Lock },
]

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(43 85% 52%) 1px, transparent 1px), linear-gradient(90deg, hsl(43 85% 52%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-4">How It Works</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Simple. Secure.{" "}
            <span className="text-gold-gradient">Profitable.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
            From first deposit to first payout — our streamlined process gets you earning in minutes, not days.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative p-7 rounded-2xl transition-all duration-400 hover:-translate-y-1 card-scan"
              style={{
                background: "var(--gradient-card)",
                border: "1px solid hsl(43 85% 52% / 0.1)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Top gold accent line on hover */}
              <div
                className="absolute top-0 left-6 right-6 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "var(--gradient-gold)" }}
              />

              {/* Step number */}
              <div
                className="absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold"
                style={{ background: "var(--gradient-gold)", color: "hsl(225 20% 6%)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                style={{ background: "hsl(43 85% 52% / 0.08)", border: "1px solid hsl(43 85% 52% / 0.15)" }}
              >
                <step.icon className="w-6 h-6 text-gold" />
              </div>

              <h3 className="font-semibold text-base mb-2.5 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
