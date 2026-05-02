import { useEffect, useState } from "react"
import { Users, Globe, Briefcase, DollarSign } from "lucide-react"

const stats = [
  { label: "Active Investors",     value: 45200, prefix: "",  suffix: "+",   icon: Users,     decimals: 0 },
  { label: "Total Paid Out",       value: 12.5,  prefix: "$", suffix: "M+",  icon: DollarSign, decimals: 1 },
  { label: "Investment Plans",     value: 6,     prefix: "",  suffix: "",    icon: Briefcase,  decimals: 0 },
  { label: "Countries Supported",  value: 150,   prefix: "",  suffix: "+",   icon: Globe,      decimals: 0 },
]

const CountUp = ({ end, duration, decimals = 0 }: { end: number; duration: number; decimals?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const current = end * easeOut
      setCount(decimals > 0 ? Number(current.toFixed(decimals)) : Math.floor(current))
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
      else setCount(end)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, decimals])

  return <span>{count}</span>
}

export const Stats = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    const el = document.getElementById("stats-section")
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  return (
    <section id="stats-section" className="py-16 relative overflow-hidden" style={{ background: "hsl(225 20% 5%)" }}>
      {/* Ultra-thin gold divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-25" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-25" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[hsl(43_85%_52%/0.1)]">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col items-center justify-center p-10 bg-[hsl(225_20%_5%)] text-center">
              <stat.icon className="w-6 h-6 text-gold mb-4 opacity-60" />
              <div className="font-display text-4xl md:text-5xl font-bold text-gold mb-2">
                {stat.prefix}
                {isVisible ? <CountUp end={stat.value} duration={2000} decimals={stat.decimals} /> : "0"}
                {stat.suffix}
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
