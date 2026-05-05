import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Wallet, ArrowUpCircle, Activity, Clock, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, addDoc, collection, updateDoc, increment, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Withdraw = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingWithdrawal, setPendingWithdrawal] = useState<any>(null);
  const [_loading, setLoading] = useState(true);

  const fetchWalletAndPending = async () => {
    if (!user) return;
    try {
      const walletSnap = await getDoc(doc(db, "wallets", user.uid));
      if (walletSnap.exists()) setWallet(walletSnap.data());

      const q = query(
        collection(db, "transactions"),
        where("user_id", "==", user.uid),
        where("type", "==", "withdrawal"),
        where("status", "==", "pending")
      );
      const txSnap = await getDocs(q);
      if (!txSnap.empty) {
        setPendingWithdrawal({ id: txSnap.docs[0].id, ...txSnap.docs[0].data() });
      } else {
        setPendingWithdrawal(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletAndPending();
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
      
      setAmount("");
      setAddress("");
      fetchWalletAndPending();
    } catch (error: any) {
      toast({ title: "Withdrawal Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card-luxury border-gold/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Wallet className="w-32 h-32 text-gold rotate-12" />
          </div>
          
          <CardHeader className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 border border-gold/20 shadow-inner">
              <ArrowUpCircle className="w-6 h-6 text-gold" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Withdraw Funds</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Available Balance: <span className="text-gold font-extrabold tracking-tight">${wallet?.balance?.toLocaleString() || "0"}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            {pendingWithdrawal ? (
              <div className="p-8 text-center space-y-6 bg-gold/5 rounded-3xl border border-gold/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Activity className="w-24 h-24 text-gold" />
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto shadow-inner">
                  <Clock className="w-8 h-8 text-gold animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Withdrawal in Progress</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Your request for <span className="text-gold font-bold">${pendingWithdrawal.amount}</span> is currently being verified by our security team.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    <span>Est. Processing Time</span>
                    <span className="text-gold">~48 Hours</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-gold" style={{ width: '45%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-tighter bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Secured by ProGlobal Trust
                </div>
                
                <p className="text-[10px] text-muted-foreground italic">
                  Transaction ID: {pendingWithdrawal.id.toUpperCase()}
                </p>
              </div>
            ) : profile?.kyc_status !== "verified" ? (
              <div className="p-6 text-center space-y-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                <h3 className="text-lg font-bold text-orange-500 uppercase tracking-widest text-xs">Identity Verification Required</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To comply with global financial regulations, you must verify your identity before withdrawing funds.
                </p>
                <Button variant="outline" className="w-full border-orange-500/50 text-orange-500 hover:bg-orange-500/10 font-bold" onClick={() => window.location.href = '/dashboard/kyc'}>
                  Complete KYC Verification
                </Button>
              </div>
            ) : (
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-8 h-12 bg-black/40 border-white/10 focus:border-gold/50 transition-all" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Wallet Address (BTC/ETH/USDT)</Label>
                <Input 
                  id="address" 
                  placeholder="Paste your destination address" 
                  className="h-12 bg-black/40 border-white/10 focus:border-gold/50 transition-all" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Network Fee</span>
                  <span className="text-white font-bold text-xs">$0.00</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Total to Receive</span>
                  <span className="text-gold text-lg font-extrabold tracking-tight">${amount || "0.00"}</span>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest shadow-gold" variant="gradient" disabled={isSubmitting}>
                {isSubmitting ? "Generating Secure Request..." : "Confirm Withdrawal"}
              </Button>

              <p className="text-[10px] text-center text-muted-foreground leading-relaxed italic">
                * All withdrawal requests undergo a 24-48 hour security review to ensure the safety of your funds.
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
