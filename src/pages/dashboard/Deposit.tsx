import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Copy, QrCode, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { addDoc, collection, updateDoc, doc, increment, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createNotification } from "@/lib/notifications";

const fallbackAddresses = [
  { coin: "Bitcoin",  symbol: "BTC",  address: "Loading...", network: "..."   },
  { coin: "Ethereum", symbol: "ETH",  address: "Loading...", network: "..."            },
  { coin: "Tether",   symbol: "USDT", address: "Loading...",       network: "..."  },
];

const Deposit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cryptoAddresses, setCryptoAddresses] = useState(fallbackAddresses);
  const [selectedCoin, setSelectedCoin] = useState(fallbackAddresses[0]);
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "wallets"));
        if (snap.exists() && snap.data().addresses) {
          const fetched = snap.data().addresses;
          setCryptoAddresses(fetched);
          setSelectedCoin(fetched[0]);
        }
      } catch (err) {
        console.error("Failed to fetch deposit addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!txid.trim()) {
      toast({ title: "TXID Required", description: "Please enter your transaction hash.", variant: "destructive" });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Amount Required", description: "Please enter the deposit amount.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "transactions"), {
        user_id: user.uid,
        type: "deposit",
        amount: parseFloat(amount),
        currency: selectedCoin.symbol,
        txid: txid.trim(),
        wallet_address: selectedCoin.address,
        network: selectedCoin.network,
        status: "pending",
        timestamp: new Date().toISOString(),
      });

      await createNotification(
        user.uid,
        "Deposit Submitted",
        `Your deposit of $${amount} is currently pending confirmation.`,
        "transaction"
      );

      setSubmitted(true);
      toast({ title: "Deposit Submitted!", description: "Your deposit proof has been submitted. Funds will be credited after confirmation." });
    } catch (err: any) {
      toast({ title: "Submission Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center pt-12 space-y-6">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold">Deposit Submitted</h2>
          <p className="text-muted-foreground">
            We've received your deposit proof. Your funds will be credited to your account within <strong className="text-foreground">24 hours</strong> after blockchain confirmation.
          </p>
          <Button variant="outline" onClick={() => { setSubmitted(false); setTxid(""); setAmount(""); }}>
            Submit Another Deposit
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Coin Selector */}
        <div className="grid md:grid-cols-3 gap-4">
          {cryptoAddresses.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => setSelectedCoin(crypto)}
              className={cn(
                "p-6 rounded-2xl border text-left transition-all duration-200",
                selectedCoin.symbol === crypto.symbol
                  ? "border-[hsl(43_85%_52%/0.5)] bg-[hsl(43_85%_52%/0.1)] text-foreground"
                  : "border-border bg-card/30 hover:border-[hsl(43_85%_52%/0.3)] text-muted-foreground"
              )}
            >
              <p className="text-xs uppercase tracking-widest mb-1 opacity-70">{crypto.coin}</p>
              <p className="text-xl font-bold">{crypto.symbol}</p>
            </button>
          ))}
        </div>

        <Card className="bg-card/30 border-[hsl(43_85%_52%/0.15)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Deposit {selectedCoin.coin} ({selectedCoin.symbol})
            </CardTitle>
            <CardDescription>
              Send funds to the address below, then submit your transaction hash to confirm.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* QR + Address */}
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl w-48 h-48 mx-auto shadow-elegant">
              <QrCode className="w-full h-full text-black" />
            </div>

            <div className="space-y-2">
              <Label>Wallet Address ({selectedCoin.network})</Label>
              <div className="flex gap-2">
                <Input readOnly value={selectedCoin.address} className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedCoin.address)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[hsl(43_85%_52%/0.06)] border border-[hsl(43_85%_52%/0.15)]">
              <p className="text-sm font-medium text-gold flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Network: {selectedCoin.network}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Only send <strong>{selectedCoin.symbol}</strong> to this address. Sending any other coin may result in permanent loss.
              </p>
            </div>

            {/* Submit Proof */}
            <form onSubmit={handleSubmit} className="pt-4 space-y-4 border-t border-border/40">
              <h4 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Submit Deposit Proof</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Sent (USD equivalent)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input id="amount" type="number" placeholder="0.00" className="pl-8" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="txid">Transaction Hash (TXID)</Label>
                  <Input id="txid" placeholder="Paste your TXID here" value={txid} onChange={(e) => setTxid(e.target.value)} />
                </div>
              </div>
              <Button className="w-full h-12" variant="gradient" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "SUBMIT DEPOSIT PROOF"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
