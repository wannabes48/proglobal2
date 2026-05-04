import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, TrendingUp, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, addDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

const plans = [
  { id: "starter", name: "Starter",  roi: "3.0%", roiNum: 3.0,  min: 50,     max: 999,     duration: 30,  features: ["Instant Accrual", "Capital Return", "Email Support"] },
  { id: "bronze",  name: "Bronze",   roi: "4.0%", roiNum: 4.0,  min: 1000,   max: 4999,    duration: 45,  features: ["Instant Accrual", "Capital Return", "Priority Support"] },
  { id: "silver",  name: "Silver",   roi: "5.5%", roiNum: 5.5,  min: 5000,   max: 9999,    duration: 60,  features: ["Instant Accrual", "Capital Return", "24/7 Support"] },
  { id: "gold",    name: "Gold",     roi: "7.0%", roiNum: 7.0,  min: 10000,  max: 49999,   duration: 90,  features: ["Instant Accrual", "Capital Return", "Dedicated Manager"] },
  { id: "diamond", name: "Diamond",  roi: "10.0%",roiNum: 10.0, min: 50000,  max: 99999,   duration: 120, features: ["Instant Accrual", "Capital Return", "VIP Manager"] },
  { id: "vip",     name: "VIP Elite",roi: "15.0%",roiNum: 15.0, min: 100000, max: Infinity, duration: 180, features: ["Instant Accrual", "Capital Return", "Personal Advisor"] },
];

const Invest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<any>(null);
  const [isInvesting, setIsInvesting] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user) return;
      const walletSnap = await getDoc(doc(db, "wallets", user.uid));
      if (walletSnap.exists()) setWallet(walletSnap.data());
    };
    fetchWallet();
  }, [user]);

  const handleInvest = async (plan: typeof plans[0]) => {
    if (!user || !wallet) return;

    const rawAmount = amounts[plan.id];
    const investAmount = rawAmount ? parseFloat(rawAmount) : plan.min;

    if (isNaN(investAmount) || investAmount < plan.min) {
      toast({ title: "Invalid Amount", description: `Minimum investment for ${plan.name} is $${plan.min.toLocaleString()}.`, variant: "destructive" });
      return;
    }
    if (plan.max !== Infinity && investAmount > plan.max) {
      toast({ title: "Amount Too High", description: `Maximum investment for ${plan.name} is $${plan.max.toLocaleString()}.`, variant: "destructive" });
      return;
    }
    if (wallet.balance < investAmount) {
      toast({ title: "Insufficient Balance", description: `You need at least $${investAmount.toLocaleString()} to invest. Please deposit first.`, variant: "destructive" });
      return;
    }

    setIsInvesting(plan.id);
    try {
      await updateDoc(doc(db, "wallets", user.uid), { balance: increment(-investAmount) });

      await addDoc(collection(db, "investments"), {
        user_id: user.uid,
        plan_id: plan.id,
        plan_name: plan.name,
        amount: investAmount,
        roi_percentage: plan.roiNum,
        duration_days: plan.duration,
        start_date: new Date().toISOString(),
        status: "active",
        progress: 0,
        total_earned: 0,
      });

      await addDoc(collection(db, "transactions"), {
        user_id: user.uid,
        type: "investment",
        amount: investAmount,
        currency: "USD",
        plan: plan.name,
        status: "completed",
        timestamp: new Date().toISOString(),
      });

      toast({ title: "Investment Successful! 🎉", description: `$${investAmount.toLocaleString()} invested in the ${plan.name} plan.` });
      setWallet({ ...wallet, balance: wallet.balance - investAmount });
      setAmounts({ ...amounts, [plan.id]: "" });
    } catch (error: any) {
      toast({ title: "Investment Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsInvesting(null);
    }
  };

  const getProjectedReturn = (plan: typeof plans[0]) => {
    const amt = parseFloat(amounts[plan.id]) || plan.min;
    const dailyReturn = (amt * plan.roiNum) / 100;
    const totalReturn = dailyReturn * plan.duration;
    return { daily: dailyReturn.toFixed(2), total: (amt + totalReturn).toFixed(2) };
  };

  return (
    <DashboardLayout>
      {/* Wallet Banner */}
      {wallet && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[hsl(43_85%_52%/0.08)] border border-[hsl(43_85%_52%/0.2)] mb-8">
          <Wallet className="w-5 h-5 text-gold shrink-0" />
          <span className="text-sm text-muted-foreground">Available Balance:</span>
          <span className="font-bold text-gold text-lg">${wallet.balance?.toLocaleString() ?? "0"}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const proj = getProjectedReturn(plan);
          const isPopular = plan.id === "gold";
          return (
            <Card
              key={plan.id}
              className={`bg-card/30 border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 ${isPopular ? "border-[hsl(43_85%_52%/0.5)] shadow-gold" : "border-[hsl(43_85%_52%/0.12)] hover:border-[hsl(43_85%_52%/0.3)]"}`}
            >
              {isPopular && (
                <div className="h-1 bg-gradient-gold" />
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{plan.duration}-Day Plan</p>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  </div>
                  <div className="p-2 rounded-xl bg-[hsl(43_85%_52%/0.1)]">
                    <TrendingUp className="w-5 h-5 text-gold" />
                  </div>
                </div>
                {isPopular && <span className="text-[10px] font-bold uppercase tracking-widest text-gold border border-[hsl(43_85%_52%/0.3)] bg-[hsl(43_85%_52%/0.1)] px-2 py-0.5 rounded-full w-fit">Most Popular</span>}
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-gold">{plan.roi}</span>
                  <span className="text-muted-foreground ml-1 text-sm">Daily ROI</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min. Investment</span>
                    <span className="font-semibold">${plan.min.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max. Investment</span>
                    <span className="font-semibold">{plan.max === Infinity ? "Unlimited" : `$${plan.max.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{plan.duration} Days</span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Investment Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      type="number"
                      placeholder={`Min $${plan.min.toLocaleString()}`}
                      className="pl-7 h-10 bg-background/50"
                      value={amounts[plan.id] || ""}
                      onChange={(e) => setAmounts({ ...amounts, [plan.id]: e.target.value })}
                      min={plan.min}
                      max={plan.max === Infinity ? undefined : plan.max}
                    />
                  </div>
                </div>

                {/* Projected Returns */}
                <div className="p-3 rounded-xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.1)] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Earn</span>
                    <span className="font-bold text-emerald-400">+${proj.daily}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total at Maturity</span>
                    <span className="font-bold text-gold">${proj.total}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-gold shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  variant={isPopular ? "gradient" : "outline"}
                  className="w-full h-11"
                  onClick={() => handleInvest(plan)}
                  disabled={isInvesting === plan.id}
                >
                  {isInvesting === plan.id ? "Processing..." : "Invest Now"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Invest;
