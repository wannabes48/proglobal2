import { Globe, Menu, X } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const navItems = [
  { label: "Home",         href: "/" },
  { label: "Plans",        href: "/plans" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Ranking",      href: "/ranking" },
  { label: "About",        href: "/about" },
  { label: "Blog",         href: "/blog" },
  { label: "Contact",      href: "/contact" },
]

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-[hsl(225_20%_5%/0.95)] backdrop-blur-xl border-b border-[hsl(43_85%_52%/0.12)] py-3"
            : "bg-transparent border-b border-transparent py-5"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Globe className="w-7 h-7 text-gold transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-[hsl(43_85%_52%/0.15)] rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold tracking-wide text-foreground">
                ProGlobal
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold opacity-80 font-medium">
                Markets
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "relative text-sm font-medium tracking-wide transition-colors duration-200 group",
                    isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {/* Gold underline on hover / active */}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px bg-gradient-gold transition-all duration-300",
                      isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          {/* ── CTA Buttons ── */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm tracking-wide"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button
              variant="gradient"
              size="sm"
              className="tracking-wide uppercase text-xs font-bold"
              onClick={() => navigate("/auth")}
            >
              Open Account
            </Button>
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-gold transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── Thin gold bottom line when scrolled ── */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px">
            <div className="h-full bg-gradient-gold opacity-20" />
          </div>
        )}
      </header>

      {/* ── Mobile Drawer ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[hsl(225_20%_6%)] border-l border-[hsl(43_85%_52%/0.15)] flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between p-6 border-b border-[hsl(43_85%_52%/0.12)]">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-gold" />
                <span className="font-display font-bold text-lg">ProGlobal</span>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-6 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[hsl(43_85%_52%/0.1)] text-gold border border-[hsl(43_85%_52%/0.2)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Bottom CTA */}
            <div className="p-6 space-y-3 border-t border-[hsl(43_85%_52%/0.12)]">
              <Button variant="gradient" className="w-full" onClick={() => navigate("/auth")}>
                Open Account
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
