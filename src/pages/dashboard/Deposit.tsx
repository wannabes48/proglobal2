import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, QrCode, ArrowRight } from "lucide-react";
import { useState } from "react";

const cryptoAddresses = [
  { coin: "Bitcoin", symbol: "BTC", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "BTC" },
  { coin: "Ethereum", symbol: "ETH", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", network: "ERC20" },
  { coin: "Tether", symbol: "USDT", address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", network: "TRC20" },
];

const Deposit = () => {
  const { toast } = useToast();
  const [selectedCoin, setSelectedCoin] = useState(cryptoAddresses[0]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid md:grid-cols-3 gap-4">
          {cryptoAddresses.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => setSelectedCoin(crypto)}
              className={cn(
                "p-6 rounded-2xl border text-left transition-all",
                selectedCoin.symbol === crypto.symbol
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/30 border-border hover:border-primary/50"
              )}
            >
              <p className="text-xs uppercase tracking-widest mb-1 opacity-70">{crypto.coin}</p>
              <p className="text-xl font-bold">{crypto.symbol}</p>
            </button>
          ))}
        </div>

        <Card className="bg-card/30 border-border backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              Deposit {selectedCoin.coin} ({selectedCoin.symbol})
            </CardTitle>
            <CardDescription>
              Scan the QR code or copy the address below to deposit funds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl w-48 h-48 mx-auto">
              <QrCode className="w-full h-full text-black" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <div className="flex gap-2">
                  <Input readOnly value={selectedCoin.address} className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedCoin.address)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-sm font-medium text-accent flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Network: {selectedCoin.network}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Send only {selectedCoin.symbol} to this address. Sending any other coin may result in permanent loss.
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label>Transaction Hash (TXID)</Label>
                <Input placeholder="Enter the transaction hash once you've sent the funds" />
              </div>
              <Button className="w-full h-12" variant="gradient">
                SUBMIT DEPOSIT PROOF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Fixed missing import for cn
import { cn } from "@/lib/utils";
export default Deposit;
