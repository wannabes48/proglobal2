import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Note: I'll need a Progress component too. I'll create it next.

export const ActiveInvestments = ({ investments }: { investments: any[] }) => {
  if (!investments || investments.length === 0) {
    return (
      <Card className="bg-card/30 border-border">
        <CardHeader>
          <CardTitle className="text-xl">Active Investments</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">You have no active investments.</p>
          <button className="text-primary font-semibold hover:underline">Browse Plans</button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card-luxury border-none relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-glow group">
      {/* Decorative scan line on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(43_85%_52%/0.1)] to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
      
      <CardHeader className="relative z-10 border-b border-[hsl(43_85%_52%/0.1)] bg-[hsl(225_20%_6%/0.4)]">
        <CardTitle className="text-xl text-gold">Active Investments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 relative z-10">
        {investments.map((inv) => (
          <div key={inv.id} className="space-y-3 p-4 rounded-xl bg-[hsl(225_12%_16%/0.3)] border border-[hsl(43_85%_52%/0.1)] hover:border-[hsl(43_85%_52%/0.3)] transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-foreground tracking-wide">{inv.plan_name}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Invested: <span className="text-gold font-bold">${inv.amount}</span></p>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                ACTIVE
              </Badge>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Progress</span>
                <span className="text-gold">{inv.progress}%</span>
              </div>
              <Progress value={inv.progress} className="h-2 bg-background border border-[hsl(43_85%_52%/0.1)] [&>div]:bg-gradient-gold shadow-inner" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
