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

const data = [
  { name: "Mon", amount: 400 },
  { name: "Tue", amount: 700 },
  { name: "Wed", amount: 600 },
  { name: "Thu", amount: 1200 },
  { name: "Fri", amount: 900 },
  { name: "Sat", amount: 1500 },
  { name: "Sun", amount: 2100 },
];

export const EarningsChart = () => {
  return (
    <Card className="bg-card/30 border-border">
      <CardHeader>
        <CardTitle className="text-xl">Earnings Overview</CardTitle>
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
