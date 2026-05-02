import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const WalletCard = ({ balance, totalEarned }: { balance: number; totalEarned: number }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-primary text-primary-foreground border-none overflow-hidden relative shadow-glow">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Wallet className="w-32 h-32 rotate-12" />
      </div>
      
      <CardContent className="p-8 space-y-8 relative z-10">
        <div>
          <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-1">Total Balance</p>
          <h2 className="text-4xl md:text-5xl font-bold">${balance.toLocaleString()}</h2>
        </div>

        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wider mb-1">Total Earned</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-300" />
              <span className="text-xl font-bold">${totalEarned.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            className="flex-1 bg-white/20 hover:bg-white/30 border-white/10 backdrop-blur-md"
            onClick={() => navigate("/dashboard/deposit")}
          >
            <ArrowDownCircle className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button 
            className="flex-1 bg-white/20 hover:bg-white/30 border-white/10 backdrop-blur-md"
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
