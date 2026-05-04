import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const RiskDisclosure = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main>
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(0_72%_51%/0.1)] border border-[hsl(0_72%_51%/0.2)] text-[hsl(0_72%_65%)] text-xs font-bold uppercase tracking-widest mb-6">Risk Warning</div>
            <h1 className="font-display text-5xl font-bold mb-4">Risk Disclosure Statement</h1>
            <p className="text-muted-foreground">Please read this document in full before investing. Last Updated: April 1, 2024</p>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="p-6 rounded-2xl bg-[hsl(0_72%_51%/0.05)] border border-[hsl(0_72%_51%/0.2)] mb-10">
              <p className="text-muted-foreground leading-relaxed font-medium">⚠️ IMPORTANT: All investment activities carry inherent risks. The value of investments can go down as well as up and you may not get back the original amount invested. This Risk Disclosure Statement is intended to inform you of the risks associated with investing on the ProGlobal Markets platform.</p>
            </div>
            {[
              { title: "Market Risk", content: "Financial markets are subject to volatility and fluctuations. Economic conditions, geopolitical events, regulatory changes, and market sentiment can all cause the value of investments to decline. Past performance of any investment plan is not indicative of future results." },
              { title: "Liquidity Risk", content: "Certain investment plans require a lock-up period during which your capital is committed. Early termination may not be possible or may result in penalties. Ensure you only invest capital that you can afford to have locked up for the duration of the investment term." },
              { title: "Cryptocurrency-Specific Risk", content: "Digital assets are highly volatile and speculative. Cryptocurrencies are subject to extreme price fluctuations, regulatory scrutiny, technical vulnerabilities (including smart contract bugs and exchange hacks), and the risk of total loss of value. Never invest more in crypto than you can afford to lose entirely." },
              { title: "Counterparty Risk", content: "ProGlobal Markets acts as the platform operator for your investments. While we take extensive measures to protect capital, there is always the risk that the platform could experience operational difficulties, insolvency, or regulatory shutdown. Digital assets are not covered by traditional deposit protection schemes (e.g., FDIC, FSCS)." },
              { title: "Regulatory Risk", content: "The regulatory landscape for online investment platforms and cryptocurrency is evolving rapidly. Changes in law or regulation in your jurisdiction or ours could affect the legality of your investments, our ability to operate, or your ability to withdraw funds. You are responsible for understanding the regulations in your country." },
              { title: "Technology and Cybersecurity Risk", content: "Online platforms are subject to technical failures, cyberattacks, phishing attempts, and human error. While we employ industry-leading security measures, no system is completely immune. You are responsible for the security of your own account credentials." },
              { title: "Foreign Exchange Risk", content: "If your home currency differs from the investment denomination (USD), exchange rate fluctuations can affect the real-world value of your returns when converted back to your local currency." },
            ].map((s, i) => (
              <div key={i} className="py-8 border-b border-border/40 last:border-0">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[hsl(0_72%_51%/0.2)] flex items-center justify-center text-[hsl(0_72%_65%)] text-xs font-black shrink-0">{i + 1}</span>
                  {s.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{s.content}</p>
              </div>
            ))}
            <div className="pt-8 p-8 rounded-2xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.15)]">
              <h3 className="font-bold text-lg mb-3">Acknowledgment</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">By investing on ProGlobal Markets, you acknowledge that you have read, understood, and accepted the risks described in this Risk Disclosure Statement. You confirm that you are investing based on your own independent research and judgment and that you can afford any potential losses.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default RiskDisclosure;
