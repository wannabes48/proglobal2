import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const KYCAMLPolicy = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)] text-gold text-xs font-bold uppercase tracking-widest mb-6">Compliance</div>
            <h1 className="font-display text-5xl font-bold mb-4">KYC / AML Policy</h1>
            <p className="text-muted-foreground">Last Updated: April 1, 2024</p>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="p-6 rounded-2xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.15)] mb-10">
              <p className="text-muted-foreground leading-relaxed">ProGlobal Markets is committed to the highest standards of Anti-Money Laundering (AML) compliance and requires all customers to complete Know Your Customer (KYC) verification. This policy describes our procedures for identifying customers, monitoring transactions, and reporting suspicious activity.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {[
                { label: "Verification Time", value: "24–48 hrs", desc: "Standard review period" },
                { label: "Documents Required", value: "1+", desc: "Government-issued ID" },
                { label: "Data Retention", value: "5+ Years", desc: "As required by law" },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-card/30 border border-[hsl(43_85%_52%/0.15)] text-center">
                  <p className="text-2xl font-bold text-gold">{item.value}</p>
                  <p className="text-sm font-medium mt-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            {[
              { title: "Customer Identification Program (CIP)", content: "Before conducting any investment transactions, ProGlobal Markets collects and verifies the following information for all customers: Full legal name, Date of birth, Residential address, Government-issued photo identification (passport, national ID, or driver's license), and Proof of address (utility bill or bank statement dated within 90 days)." },
              { title: "Enhanced Due Diligence (EDD)", content: "For high-risk customers, including Politically Exposed Persons (PEPs), high-volume investors, and customers from high-risk jurisdictions, we conduct Enhanced Due Diligence. This may include source of funds verification, additional document requests, and more frequent account reviews." },
              { title: "Transaction Monitoring", content: "We monitor all transactions on our platform for suspicious patterns, including large or unusual transactions, rapid movement of funds, transactions that appear to have no legitimate business purpose, and patterns that suggest structuring to avoid reporting thresholds. Suspicious transactions are reported to appropriate authorities." },
              { title: "Sanctions Screening", content: "All customers and transactions are screened against international sanctions lists, including those maintained by OFAC (US), HM Treasury (UK), EU, and the United Nations. Accounts associated with sanctioned individuals or entities are immediately frozen and reported to authorities." },
              { title: "Record Keeping", content: "In accordance with AML regulations, we maintain records of all customer identification documents and transaction records for a minimum of five (5) years from the date of account closure. Records are stored securely and accessible to authorized personnel and regulatory authorities upon request." },
              { title: "Staff Training and Compliance", content: "All ProGlobal Markets employees involved in customer-facing operations and transaction processing receive mandatory AML/KYC training upon onboarding and annually thereafter. Our compliance officer oversees all AML/KYC procedures and reports directly to senior management." },
            ].map((s, i) => (
              <div key={i} className="py-8 border-b border-border/40 last:border-0">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center text-[hsl(225_20%_6%)] text-xs font-black shrink-0">{i + 1}</span>
                  {s.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{s.content}</p>
              </div>
            ))}

            <div className="pt-8 p-6 rounded-2xl bg-card/30 border border-border">
              <h3 className="font-bold mb-2">Compliance Officer Contact</h3>
              <p className="text-muted-foreground text-sm">For KYC/AML enquiries, please contact our compliance team at <a href="mailto:compliance@proglobalmarkets.com" className="text-gold hover:underline">compliance@proglobalmarkets.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default KYCAMLPolicy;
