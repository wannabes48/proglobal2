import { Globe, MessageSquare, Send, Share2, Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

const quickLinks = [
  { label: "Home",             href: "/" },
  { label: "About Us",         href: "/about" },
  { label: "Investment Plans", href: "/plans" },
  { label: "How It Works",     href: "/how-it-works" },
  { label: "Investor Ranking", href: "/ranking" },
  { label: "Blog",             href: "/blog" },
]

const legalLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Risk Disclosure",
  "Cookie Policy",
  "KYC / AML Policy",
]

const socialLinks = [
  { icon: MessageSquare, href: "#", label: "Twitter"  },
  { icon: Share2,        href: "#", label: "LinkedIn" },
  { icon: Send,          href: "#", label: "Telegram" },
  { icon: Mail,          href: "#", label: "Email"    },
]

export const Footer = () => {
  return (
    <footer style={{ background: "hsl(225 22% 4%)" }}>
      {/* Gold top divider */}
      <div className="h-px bg-gradient-gold opacity-30" />

      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* ── Brand Column ── */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="text-gold w-7 h-7" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-wide">ProGlobal</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold opacity-70 font-medium">Markets</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A premier investment platform delivering institutional-grade returns
              across Forex, Crypto, Real Estate, and Global Equities.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground transition-all duration-200 hover:text-gold"
                  style={{ border: "1px solid hsl(43 85% 52% / 0.15)", background: "hsl(43 85% 52% / 0.05)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(43 85% 52% / 0.4)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(43 85% 52% / 0.15)")}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-sm text-muted-foreground hover:text-gold transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  123 Financial District, Canary Wharf, London, E14 5AB
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span className="text-muted-foreground text-sm">+44 20 7946 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span className="text-muted-foreground text-sm">support@proglobalmarkets.com</span>
              </li>
            </ul>

            {/* Risk disclaimer */}
            <div
              className="mt-6 p-3 rounded-lg text-[11px] text-muted-foreground leading-relaxed"
              style={{ background: "hsl(43 85% 52% / 0.04)", border: "1px solid hsl(43 85% 52% / 0.1)" }}
            >
              ⚠️ Investing involves risk. Past performance does not guarantee future results.
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid hsl(43 85% 52% / 0.1)" }}>
          <p className="text-muted-foreground text-xs text-center md:text-left">
            © {new Date().getFullYear()} ProGlobal Markets Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies", "Sitemap"].map((label) => (
              <a key={label} href="#" className="text-xs text-muted-foreground hover:text-gold transition-colors duration-200">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
