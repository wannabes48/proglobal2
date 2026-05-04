import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const CookiePolicy = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)] text-gold text-xs font-bold uppercase tracking-widest mb-6">Legal</div>
            <h1 className="font-display text-5xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last Updated: April 1, 2024</p>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="p-6 rounded-2xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.15)] mb-10">
              <p className="text-muted-foreground">This Cookie Policy explains how ProGlobal Markets uses cookies and similar tracking technologies when you visit our platform. By using our services, you consent to our use of cookies in accordance with this policy.</p>
            </div>
            {[
              { title: "What Are Cookies?", content: "Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, to provide a better user experience, and to provide information to the owners of the site." },
              { title: "Essential Cookies", content: "These cookies are strictly necessary for the platform to function. They include session cookies that keep you logged in, security cookies that detect fraud and abuse, and cookies that remember your preferences. You cannot opt out of these cookies as they are required for the platform to work." },
              { title: "Analytics Cookies (Firebase Analytics)", content: "We use Firebase Analytics to understand how users interact with our platform. These cookies collect anonymized information about pages visited, features used, and time spent on the platform. This data helps us improve our services. We use Google Firebase, and their privacy policy applies to these analytics cookies." },
              { title: "Performance Cookies", content: "Performance cookies help us understand which areas of our platform are most popular and how visitors move around the site. All information collected is aggregated and therefore anonymous. Disabling these cookies will not affect your ability to use the platform." },
              { title: "Functional Cookies", content: "These cookies allow the platform to remember choices you make (such as your preferred language or the region you are in) and provide enhanced, more personal features. They may also be used to provide services you have asked for." },
              { title: "Managing Cookies", content: "You can control and/or delete cookies as you wish. Most browsers allow you to refuse cookies or to alert you when cookies are being sent. However, if you disable cookies, some features of our platform may not function properly. To manage cookies, check your browser's documentation for instructions." },
            ].map((s, i) => (
              <div key={i} className="py-8 border-b border-border/40 last:border-0">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center text-[hsl(225_20%_6%)] text-xs font-black shrink-0">{i + 1}</span>
                  {s.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default CookiePolicy;
