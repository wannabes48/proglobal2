import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us, such as when you create an account, complete KYC verification, make a deposit or withdrawal, or contact us for support. This includes your name, email address, phone number, government-issued identification documents, financial information, and transaction history."
  },
  {
    title: "How We Use Your Information",
    content: "We use the information we collect to provide, maintain, and improve our services; to process transactions; to verify your identity for KYC/AML compliance; to send you technical notices and support messages; to detect and prevent fraudulent transactions and other illegal activities; and to comply with applicable laws and regulations."
  },
  {
    title: "Information Sharing",
    content: "We do not share, sell, rent or trade your personal information with third parties for their marketing purposes. We may share your information with service providers who assist in our operations (under strict confidentiality agreements), with law enforcement or regulatory authorities when required by law, and with our KYC verification partners for identity verification purposes."
  },
  {
    title: "Data Security",
    content: "We employ industry-standard security measures to protect your personal information, including AES-256 encryption for data at rest, TLS 1.3 encryption for data in transit, multi-factor authentication, cold storage for digital assets, and regular third-party security audits. However, no method of transmission over the internet is 100% secure."
  },
  {
    title: "Data Retention",
    content: "We retain your personal information for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements. KYC documents are retained for a minimum of 5 years as required by AML regulations."
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal information. You may also request that we restrict the processing of your data or object to our processing. To exercise these rights, please contact us at privacy@proglobalmarkets.com. Note that some data retention may be required by law and cannot be deleted upon request."
  },
  {
    title: "Cookies",
    content: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service."
  },
  {
    title: "Changes to This Policy",
    content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'effective date' at the top of this policy. We encourage you to review this policy periodically."
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[hsl(43_85%_52%/0.03)] rounded-full blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)] text-gold text-xs font-bold uppercase tracking-widest mb-6">
                Legal
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">Effective Date: January 1, 2024 · Last Updated: April 1, 2024</p>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl space-y-2">
              <div className="p-6 rounded-2xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.15)] mb-10">
                <p className="text-muted-foreground leading-relaxed">
                  ProGlobal Markets Ltd. ("ProGlobal," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our investment platform.
                </p>
              </div>

              {sections.map((section, i) => (
                <div key={i} className="py-8 border-b border-border/40 last:border-0">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center text-[hsl(225_20%_6%)] text-xs font-black shrink-0">{i + 1}</span>
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              ))}

              <div className="pt-10 p-6 rounded-2xl bg-card/30 border border-border">
                <h3 className="font-bold mb-2">Contact Us</h3>
                <p className="text-muted-foreground text-sm">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@proglobalmarkets.com" className="text-gold hover:underline">
                    privacy@proglobalmarkets.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
