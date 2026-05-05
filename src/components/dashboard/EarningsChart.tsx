import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export const EarningsChart = ({ data }: { data: any[] }) => {
  const latestAmount = data.length > 0 ? data[data.length - 1].amount : 0;
  
  return (
    <Card className="bg-card-luxury border-gold/10 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="w-16 h-16 text-gold" />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-xl font-display font-bold text-gold">Earnings Overview</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">${latestAmount.toLocaleString()}</span>
            <div className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              LIVE ROI
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(43 85% 52%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(43 85% 52%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(225 18% 10% / 0.9)", 
                  borderColor: "hsl(43 85% 52% / 0.2)",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--foreground))",
                  backdropFilter: "blur(8px)"
                }}
                itemStyle={{ color: "hsl(43 85% 52%)", fontWeight: "bold" }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(43 85% 52%)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
