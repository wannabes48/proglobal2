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
    <Card className="bg-card/30 border-border">
      <CardHeader>
        <CardTitle className="text-xl">Active Investments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {investments.map((inv) => (
          <div key={inv.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{inv.plan_name}</p>
                <p className="text-xs text-muted-foreground">Invested: ${inv.amount}</p>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                ACTIVE
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{inv.progress}%</span>
              </div>
              <Progress value={inv.progress} className="h-1.5" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
