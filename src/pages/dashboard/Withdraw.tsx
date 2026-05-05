import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Wallet, ArrowUpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, addDoc, collection, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Withdraw = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user) return;
      const walletSnap = await getDoc(doc(db, "wallets", user.uid));
      if (walletSnap.exists()) setWallet(walletSnap.data());
    };
    fetchWallet();
  }, [user]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !wallet) return;

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid withdrawal amount.", variant: "destructive" });
      return;
    }

    if (withdrawAmount > wallet.balance) {
      toast({ title: "Insufficient Balance", description: "You don't have enough funds for this withdrawal.", variant: "destructive" });
      return;
    }

    if (!address) {
      toast({ title: "Address Required", description: "Please enter your wallet address.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create withdrawal request (pending)
      await addDoc(collection(db, "transactions"), {
        user_id: user.uid,
        type: "withdrawal",
        amount: withdrawAmount,
        currency: "USD",
        wallet_address: address,
        status: "pending",
        timestamp: new Date().toISOString(),
      });

      // 2. Lock balance (deduct from wallet)
      await updateDoc(doc(db, "wallets", user.uid), {
        balance: increment(-withdrawAmount),
        total_withdrawn: increment(withdrawAmount)
      });

      toast({ 
        title: "Withdrawal Requested", 
        description: `Your request for $${withdrawAmount} is being processed.` 
      });
      
      setWallet({ ...wallet, balance: wallet.balance - withdrawAmount });
      setAmount("");
      setAddress("");
    } catch (error: any) {
      toast({ title: "Withdrawal Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card/30 border-border backdrop-blur-xl">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <ArrowUpCircle className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Withdraw Funds</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Available Balance: <span className="text-gold font-extrabold tracking-tight">${wallet?.balance?.toLocaleString() || "0"}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.kyc_status !== "verified" ? (
              <div className="p-6 text-center space-y-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                <h3 className="text-lg font-bold text-orange-500">KYC Verification Required</h3>
                <p className="text-sm text-muted-foreground">
                  To comply with anti-money laundering regulations, you must verify your identity before you can withdraw funds.
                </p>
                <Button variant="outline" className="w-full border-orange-500/50 text-orange-500 hover:bg-orange-500/10" onClick={() => window.location.href = '/dashboard/kyc'}>
                  Complete KYC Now
                </Button>
              </div>
            ) : (
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-8 h-12" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Your BTC/ETH/USDT Address</Label>
                <Input 
                  id="address" 
                  placeholder="Paste your wallet address here" 
                  className="h-12" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-xl bg-card/50 border border-border">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Withdrawal Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Total to Receive</span>
                  <span className="text-white text-lg font-extrabold tracking-tight">${amount || "0.00"}</span>
                </div>
              </div>

              <Button type="submit" className="w-full h-12" variant="gradient" disabled={isSubmitting}>
                {isSubmitting ? "Processing Request..." : "CONFIRM WITHDRAWAL"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Withdrawals are usually processed within 24 hours. Please double-check your wallet address.
              </p>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Withdraw;
