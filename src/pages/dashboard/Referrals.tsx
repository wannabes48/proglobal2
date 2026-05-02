import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Gift, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Referrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const referralLink = `${window.location.origin}/auth?ref=${user?.uid}`;

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return;
      const q = query(collection(db, "profiles"), where("referred_by", "==", user.uid));
      const snap = await getDocs(q);
      setReferrals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchReferrals();
  }, [user]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-accent text-white border-none shadow-glow">
            <CardHeader>
              <Gift className="w-10 h-10 mb-2 opacity-80" />
              <CardTitle className="text-2xl font-bold">Refer & Earn</CardTitle>
              <CardDescription className="text-white/80">
                Invite your friends to ProGlobal Markets and earn 10% of their first deposit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input readOnly value={referralLink} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  <Button variant="outline" className="bg-white/20 border-white/10 hover:bg-white/30" onClick={copyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Button className="w-full bg-white text-accent hover:bg-white/90 font-bold">
                  <Share2 className="w-4 h-4 mr-2" />
                  SHARE LINK
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card/30 border-border flex flex-col items-center justify-center p-6">
              <Users className="w-8 h-8 text-primary mb-2" />
              <p className="text-3xl font-bold">{referrals.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Referrals</p>
            </Card>
            <Card className="bg-card/30 border-border flex flex-col items-center justify-center p-6">
              <Gift className="w-8 h-8 text-accent mb-2" />
              <p className="text-3xl font-bold">$0</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Earned</p>
            </Card>
          </div>
        </div>

        <Card className="bg-card/30 border-border overflow-hidden">
          <CardHeader>
            <CardTitle>My Referrals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold">{ref.full_name}</td>
                      <td className="px-6 py-4 capitalize">{ref.kyc_status}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(ref.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {!loading && referrals.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                        You haven't referred anyone yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Referrals;
