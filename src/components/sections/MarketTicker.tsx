import { TrendingUp, TrendingDown } from "lucide-react"

const marketData = [
  { symbol: "BTC/USD",  price: "64,230.50", change: "+2.4%", isPositive: true  },
  { symbol: "ETH/USD",  price: "3,450.20",  change: "+1.8%", isPositive: true  },
  { symbol: "GOLD",     price: "2,340.80",  change: "+0.8%", isPositive: true  },
  { symbol: "EUR/USD",  price: "1.0845",    change: "-0.12%",isPositive: false },
  { symbol: "GBP/USD",  price: "1.2630",    change: "+0.05%",isPositive: true  },
  { symbol: "S&P 500",  price: "5,230.15",  change: "-0.4%", isPositive: false },
  { symbol: "SOL/USD",  price: "145.20",    change: "+5.2%", isPositive: true  },
  { symbol: "USD/JPY",  price: "151.20",    change: "-0.08%",isPositive: false },
  { symbol: "NASDAQ",   price: "18,340.50", change: "+1.1%", isPositive: true  },
  { symbol: "XAU/USD",  price: "2,339.10",  change: "+0.7%", isPositive: true  },
]

export const MarketTicker = () => {
  return (
    <div
      className="w-full overflow-hidden py-3 relative z-40"
      style={{
        background: "hsl(225 20% 5%)",
        borderTop:    "1px solid hsl(43 85% 52% / 0.15)",
        borderBottom: "1px solid hsl(43 85% 52% / 0.15)",
      }}
    >
      {/* Left fade mask */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, hsl(225 20% 5%), transparent)" }} />
      {/* Right fade mask */}
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, hsl(225 20% 5%), transparent)" }} />

      <div className="flex whitespace-nowrap" style={{ animation: "ticker 35s linear infinite" }}>
        {[...marketData, ...marketData].map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="inline-flex items-center gap-2.5 px-8 border-r border-[hsl(43_85%_52%/0.1)] last:border-0"
          >
            <span className="text-xs font-bold tracking-wide text-foreground/70 uppercase">{item.symbol}</span>
            <span className="text-xs font-semibold">{item.price}</span>
            <span className={`flex items-center gap-0.5 text-[11px] font-bold ${item.isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {item.isPositive
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
              }
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
