import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shield, Globe, Award, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero -z-10" />
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Mission</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ProGlobal Markets is dedicated to democratizing access to high-yield investment opportunities through technology, security, and financial innovation.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-card/20 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Global Reach", icon: Globe, desc: "Serving investors in over 150 countries worldwide." },
                { title: "Strict Security", icon: Shield, desc: "Bank-level encryption and cold storage for all assets." },
                { title: "Fast Execution", icon: Zap, desc: "Near-instant deposits and automated withdrawal processing." },
                { title: "Expert Support", icon: Award, desc: "24/7 dedicated support from financial professionals." },
              ].map((item) => (
                <div key={item.title} className="p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Founded in 2024, ProGlobal Markets emerged from a simple observation: the world of high-yield investments was too often restricted to institutional players or obscured by complex barriers. Our founders, veterans of both traditional finance and blockchain technology, set out to build a bridge.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we provide a seamless, secure, and transparent platform where anyone can participate in the global financial markets. By combining traditional asset management principles with cutting-edge digital infrastructure, we offer consistent ROI and peace of mind.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border">
                <div>
                  <p className="text-3xl font-bold text-primary">2024</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Founded</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">45K+</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">150+</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Countries</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">$12M+</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Paid Out</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
