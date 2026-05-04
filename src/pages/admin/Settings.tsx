import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Wallet } from "lucide-react";

interface CryptoAddress {
  coin: string;
  symbol: string;
  address: string;
  network: string;
}

const defaultAddresses: CryptoAddress[] = [
  { coin: "Bitcoin",  symbol: "BTC",  address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "BTC (Bitcoin Network)"   },
  { coin: "Ethereum", symbol: "ETH",  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", network: "ETH (ERC-20)"            },
  { coin: "Tether",   symbol: "USDT", address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",       network: "USDT (TRC-20 / Tron)"  },
];

const Settings = () => {
  const [addresses, setAddresses] = useState<CryptoAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "wallets"));
        if (snap.exists() && snap.data().addresses) {
          setAddresses(snap.data().addresses);
        } else {
          // Initialize defaults if not found
          await setDoc(doc(db, "settings", "wallets"), { addresses: defaultAddresses });
          setAddresses(defaultAddresses);
        }
      } catch (error: any) {
        toast({ title: "Error Loading Settings", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleAddressChange = (index: number, field: keyof CryptoAddress, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "wallets"), { addresses });
      toast({ title: "Settings Saved", description: "Crypto deposit addresses updated successfully." });
    } catch (error: any) {
      toast({ title: "Failed to Save", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Settings</h1>
          <p className="text-sm text-muted-foreground">Manage platform-wide configuration and addresses.</p>
        </div>

        <Card className="bg-card/30 border-[hsl(43_85%_52%/0.15)] overflow-hidden">
          <CardHeader className="bg-[hsl(43_85%_52%/0.02)] border-b border-[hsl(43_85%_52%/0.1)]">
            <CardTitle className="text-xl flex items-center gap-2 text-gold">
              <Wallet className="w-5 h-5" /> Crypto Deposit Addresses
            </CardTitle>
            <CardDescription>
              These addresses will be shown to users when they attempt to make a deposit.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground animate-pulse">Loading configurations...</div>
            ) : (
              <form onSubmit={handleSave} className="space-y-8">
                {addresses.map((crypto, index) => (
                  <div key={crypto.symbol} className="p-4 rounded-xl bg-background/50 border border-border space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{crypto.coin}</h3>
                      <span className="text-xs uppercase bg-[hsl(43_85%_52%/0.1)] text-gold px-2 py-0.5 rounded-full border border-gold/20">{crypto.symbol}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Wallet Address</Label>
                        <Input 
                          value={crypto.address} 
                          onChange={(e) => handleAddressChange(index, "address", e.target.value)} 
                          required
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Network Description</Label>
                        <Input 
                          value={crypto.network} 
                          onChange={(e) => handleAddressChange(index, "network", e.target.value)} 
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="gradient" className="gap-2 px-8" disabled={saving}>
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Addresses"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;
