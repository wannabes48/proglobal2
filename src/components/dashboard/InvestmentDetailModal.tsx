import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Calendar, Zap, ArrowUpRight, BarChart3 } from "lucide-react";

interface InvestmentDetailModalProps {
  investment: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvestmentDetailModal = ({ investment, isOpen, onClose }: InvestmentDetailModalProps) => {
  if (!investment) return null;

  const startDate = new Date(investment.start_date);
  const maturityDate = new Date(startDate.getTime() + (investment.duration_days * 24 * 60 * 60 * 1000));
  const remainingDays = Math.max(0, Math.ceil((maturityDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card-luxury border-gold/20 shadow-glow animate-in zoom-in-95 duration-200">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gold/10">
              <TrendingUp className="w-6 h-6 text-gold" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-display font-bold text-white">Investment Intelligence</DialogTitle>
              <DialogDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                Contract ID: {investment.id.slice(0, 8).toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* Left Column - Core Stats */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-gold/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <BarChart3 className="w-16 h-16 text-gold" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Accumulated Profit</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-extrabold text-gold">${investment.total_earned}</h3>
                <span className="text-emerald-400 text-xs font-bold flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {investment.roi_percentage}% / Day
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[hsl(225_12%_16%/0.3)] border border-white/5">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Days Left</span>
                </div>
                <p className="text-xl font-bold text-white">{remainingDays} Days</p>
              </div>
              <div className="p-4 rounded-xl bg-[hsl(225_12%_16%/0.3)] border border-white/5">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Zap className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Principal</span>
                </div>
                <p className="text-xl font-bold text-white">${investment.amount}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Projections & Progress */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Contract Progress</p>
                  <p className="text-lg font-bold text-white">{investment.progress}% Complete</p>
                </div>
                <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5">
                  {investment.status.toUpperCase()}
                </Badge>
              </div>
              <Progress value={investment.progress} className="h-3 bg-black/40 border border-white/5 [&>div]:bg-gradient-gold" />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Maturity Date</span>
                </div>
                <span className="text-sm font-bold text-white">{maturityDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Plan Tier</span>
                </div>
                <span className="text-sm font-bold text-gold uppercase">{investment.plan_name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-white/10">
          <p className="text-[10px] text-center text-muted-foreground italic">
            * Earnings are calculated in real-time based on your plan's ROI. Profit is automatically credited to your wallet upon contract maturity.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
