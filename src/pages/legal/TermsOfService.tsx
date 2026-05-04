import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using the ProGlobal Markets platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this platform are protected by applicable copyright and trademark law." },
  { title: "Eligibility", content: "You must be at least 18 years of age and a legal resident of a country where online investment platforms are permitted. By using our services, you represent and warrant that you meet all eligibility requirements. We reserve the right to refuse service, terminate accounts, or cancel transactions at our discretion." },
  { title: "Account Registration", content: "To access investment features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for safeguarding your account credentials and for all activities that occur under your account." },
  { title: "KYC and AML Compliance", content: "In compliance with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations, we require identity verification before enabling deposit, withdrawal, and investment functionality. Failure to complete KYC verification within 30 days of account creation may result in account suspension." },
  { title: "Investment Plans and Returns", content: "The return rates displayed on our platform are projections based on historical performance and current market conditions. Past performance is not indicative of future results. All investments carry risk, including the potential loss of principal. You should carefully consider your investment objectives, level of experience, and risk appetite before investing." },
  { title: "Deposits and Withdrawals", content: "Deposits are credited to your account after network confirmation. Minimum deposit amounts apply per payment method. Withdrawals are processed within 24-48 hours subject to security verification. ProGlobal Markets reserves the right to place holds on withdrawal requests pending fraud review." },
  { title: "Prohibited Activities", content: "You agree not to use our platform for money laundering, fraud, or any illegal activity; to manipulate market prices or gaming our referral system; to access the platform through automated means without our written consent; to impersonate another user or ProGlobal Markets personnel; or to violate any applicable law or regulation." },
  { title: "Limitation of Liability", content: "To the maximum extent permitted by law, ProGlobal Markets shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, the service. Our total liability to you for any claims arising from these Terms shall not exceed the amount you have invested with us in the 30 days preceding the claim." },
  { title: "Modifications to Terms", content: "We reserve the right to modify these Terms at any time. We will notify users of significant changes via email and platform notification. Continued use of the platform after changes constitutes acceptance of the new Terms." },
];

const TermsOfService = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main>
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[hsl(43_85%_52%/0.03)] rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)] text-gold text-xs font-bold uppercase tracking-widest mb-6">Legal</div>
            <h1 className="font-display text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Effective Date: January 1, 2024 · Last Updated: April 1, 2024</p>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl space-y-2">
            <div className="p-6 rounded-2xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.15)] mb-10">
              <p className="text-muted-foreground leading-relaxed">Please read these Terms of Service carefully before using ProGlobal Markets. These terms govern your use of our platform and constitute a legally binding agreement between you and ProGlobal Markets Ltd.</p>
            </div>
            {sections.map((s, i) => (
              <div key={i} className="py-8 border-b border-border/40 last:border-0">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center text-[hsl(225_20%_6%)] text-xs font-black shrink-0">{i + 1}</span>
                  {s.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{s.content}</p>
              </div>
            ))}
            <div className="pt-10 p-6 rounded-2xl bg-card/30 border border-border">
              <h3 className="font-bold mb-2">Questions About These Terms?</h3>
              <p className="text-muted-foreground text-sm">Contact us at <a href="mailto:legal@proglobalmarkets.com" className="text-gold hover:underline">legal@proglobalmarkets.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;
