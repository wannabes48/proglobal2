import { useState } from "react"
import { ChevronDown, Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "How do I start investing with ProGlobal Markets?",
    answer: "Getting started takes under 5 minutes. Create a free account, complete identity verification, fund your wallet using crypto or bank transfer, and select any investment plan that matches your goals.",
  },
  {
    question: "Are my investments protected?",
    answer: "We employ bank-level 256-bit SSL encryption, multi-factor authentication, and cold storage for all crypto assets. Your principal is also protected under our Capital Protection Shield on Gold, Diamond, and VIP plans.",
  },
  {
    question: "When and how can I withdraw my earnings?",
    answer: "Withdrawals are processed instantly. Once your balance reaches the minimum threshold of $10, you may request a withdrawal at any time — 24 hours a day, 7 days a week — directly to your crypto wallet.",
  },
  {
    question: "What payment methods are accepted for deposits?",
    answer: "We accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT), and select bank wire transfers. New payment methods are added regularly based on user demand.",
  },
  {
    question: "How does the referral program work?",
    answer: "When a user you refer makes their first deposit, you instantly earn a commission credited directly to your wallet. The commission percentage increases with your own investment tier.",
  },
  {
    question: "Is there a minimum investment amount?",
    answer: "Yes — our Starter plan begins at just $50, making ProGlobal Markets accessible to investors at every level. Our VIP plan accommodates investments of $100,000 and above with unlimited upside.",
  },
]

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      className="py-32 relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-4">FAQ</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold">
            Common{" "}
            <span className="text-gold-gradient">Questions</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: "var(--gradient-card)",
                  border: isOpen
                    ? "1px solid hsl(43 85% 52% / 0.3)"
                    : "1px solid hsl(43 85% 52% / 0.08)",
                  boxShadow: isOpen ? "var(--shadow-gold)" : "none",
                }}
              >
                <button
                  className="w-full text-left px-7 py-5 flex items-center justify-between group"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`font-medium text-base transition-colors duration-200 pr-4 ${isOpen ? "text-gold" : "text-foreground group-hover:text-gold"}`}>
                    {faq.question}
                  </span>
                  <div
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isOpen ? "var(--gradient-gold)" : "hsl(43 85% 52% / 0.08)",
                      color: isOpen ? "hsl(225 20% 6%)" : "hsl(43 85% 52%)",
                    }}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
                >
                  <p className="px-7 pb-6 text-muted-foreground leading-relaxed text-[15px]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
