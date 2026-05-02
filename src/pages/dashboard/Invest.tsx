import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, addDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

const plans = [
  { id: "starter", name: "Starter", roi: "3.0%", min: 50, max: 999, duration: 30, gradient: "bg-gradient-subtle" },
  { id: "bronze", name: "Bronze", roi: "4.0%", min: 1000, max: 4999, duration: 45, gradient: "bg-gradient-primary" },
  { id: "silver", name: "Silver", roi: "5.5%", min: 5000, max: 9999, duration: 60, gradient: "bg-gradient-accent" },
  { id: "gold", name: "Gold", roi: "7.0%", min: 10000, max: 49999, duration: 90, gradient: "bg-gradient-primary" },
  { id: "diamond", name: "Diamond", roi: "10.0%", min: 50000, max: 99999, duration: 120, gradient: "bg-gradient-accent" },
  { id: "vip", name: "VIP", roi: "15.0%", min: 100000, max: 1000000, duration: 180, gradient: "bg-gradient-primary" },
];

const Invest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<any>(null);
  const [isInvesting, setIsInvesting] = useState<string | null>(null);

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
    
    if (wallet.balance < plan.min) {
      toast({ 
        title: "Insufficient Balance", 
        description: `You need at least $${plan.min} to invest in this plan.`, 
        variant: "destructive" 
      });
      return;
    }

    setIsInvesting(plan.id);
    try {
      // 1. Debit wallet
      await updateDoc(doc(db, "wallets", user.uid), {
        balance: increment(-plan.min)
      });

      // 2. Create investment record
      await addDoc(collection(db, "investments"), {
        user_id: user.uid,
        plan_id: plan.id,
        plan_name: plan.name,
        amount: plan.min,
        roi_percentage: parseFloat(plan.roi),
        duration_days: plan.duration,
        start_date: new Date().toISOString(),
        status: "active",
        progress: 0,
        total_earned: 0,
      });

      // 3. Log transaction
      await addDoc(collection(db, "transactions"), {
        user_id: user.uid,
        type: "investment",
        amount: plan.min,
        currency: "USD",
        status: "completed",
        timestamp: new Date().toISOString(),
      });

      toast({ 
        title: "Investment Successful!", 
        description: `You have successfully invested $${plan.min} in the ${plan.name} plan.` 
      });
      
      // Update local wallet state
      setWallet({ ...wallet, balance: wallet.balance - plan.min });
    } catch (error: any) {
      toast({ title: "Investment Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsInvesting(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="bg-card/30 border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
            <div className={`h-2 ${plan.gradient}`} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="p-2 rounded-lg bg-accent/20">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-primary">{plan.roi}</span>
                <span className="text-muted-foreground ml-1">Daily</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Min Investment:</span>
                <span className="font-semibold">${plan.min}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Max Investment:</span>
                <span className="font-semibold">${plan.max === 1000000 ? "Unlimited" : `$${plan.max}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-semibold">{plan.duration} Days</span>
              </div>
              <div className="space-y-2 pt-4">
                {["Instant Accrual", "Capital Return", "24/7 Monitoring"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-accent" />
                    {f}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="gradient" 
                className="w-full" 
                onClick={() => handleInvest(plan)}
                disabled={isInvesting === plan.id}
              >
                {isInvesting === plan.id ? "Processing..." : "Invest Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Invest;
