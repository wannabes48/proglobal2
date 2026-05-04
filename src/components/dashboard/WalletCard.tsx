import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const WalletCard = ({ balance, totalEarned }: { balance: number; totalEarned: number }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-card-luxury text-card-foreground border-none overflow-hidden relative shadow-elegant card-scan">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Wallet className="w-32 h-32 rotate-12 text-gold" />
      </div>
      
      <CardContent className="p-8 space-y-8 relative z-10">
        <div>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Total Balance</p>
          <h2 className="text-4xl md:text-5xl font-bold shimmer-text">${balance.toLocaleString()}</h2>
        </div>

        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Total Earned</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xl font-bold text-foreground">${totalEarned.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button 
            className="flex-1 bg-[hsl(43_85%_52%/0.1)] hover:bg-[hsl(43_85%_52%/0.2)] border border-[hsl(43_85%_52%/0.2)] backdrop-blur-md text-gold hover:text-gold shadow-gold transition-all"
            onClick={() => navigate("/dashboard/deposit")}
          >
            <ArrowDownCircle className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button 
            className="flex-1 bg-[hsl(225_12%_16%/0.5)] hover:bg-[hsl(225_12%_16%/0.8)] border border-border backdrop-blur-md text-foreground transition-all hover:border-[hsl(43_85%_52%/0.2)] hover:text-gold"
            onClick={() => navigate("/dashboard/withdraw")}
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
