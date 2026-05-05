import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { PieChart } from "lucide-react";

export const AllocationChart = ({ investments }: { investments: any[] }) => {
  // Aggregate data by plan name
  const aggregation = investments.reduce((acc: any, inv: any) => {
    const name = inv.plan_name;
    acc[name] = (acc[name] || 0) + parseFloat(inv.amount);
    return acc;
  }, {});

  const data = Object.keys(aggregation).map(name => ({
    name,
    value: aggregation[name]
  }));

  const COLORS = ['#EAB308', '#FDE047', '#CA8A04', '#854D0E'];

  return (
    <Card className="bg-card-luxury border-gold/10 overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-gold">Capital Allocation</CardTitle>
        <PieChart className="w-4 h-4 text-gold opacity-50" />
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(234, 179, 8, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: "hsl(225 18% 10% / 0.9)", 
                    borderColor: "hsl(43 85% 52% / 0.2)",
                    borderRadius: "var(--radius)",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
              No active allocations detected.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
