import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  UserCog, 
  ShieldCheck, 
  UserMinus, 
  UserCheck, 
  Wallet,
  MoreVertical,
  Activity,
  History
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [_loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const [profilesSnap, walletsSnap] = await Promise.all([
        getDocs(collection(db, "profiles")),
        getDocs(collection(db, "wallets"))
      ]);

      const walletsData = walletsSnap.docs.reduce((acc: any, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});

      const combinedUsers = profilesSnap.docs.map(doc => {
        const profile = doc.data();
        const wallet = walletsData[doc.id] || { balance: 0, total_deposited: 0, total_withdrawn: 0 };
        return { id: doc.id, ...profile, wallet };
      });

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      toast({ title: "Fetch Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId: string, update: any, message: string) => {
    try {
      await updateDoc(doc(db, "profiles", userId), update);
      toast({ title: "Success", description: message });
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Action Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleBalanceAdjust = async () => {
    if (!selectedUser || !adjustAmount) return;
    try {
      const amount = parseFloat(adjustAmount);
      await updateDoc(doc(db, "wallets", selectedUser.id), {
        balance: increment(amount)
      });
      toast({ title: "Balance Adjusted", description: `Wallet successfully updated by $${amount}` });
      setAdjustAmount("");
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Adjustment Failed", description: error.message, variant: "destructive" });
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="bg-card/30 border-[hsl(43_85%_52%/0.15)] overflow-hidden">
          <CardHeader className="bg-[hsl(43_85%_52%/0.02)] border-b border-[hsl(43_85%_52%/0.1)]">
            <CardTitle className="text-gold">Platform Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-[hsl(43_85%_52%/0.05)] text-gold border-b border-[hsl(43_85%_52%/0.1)]">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Deposited</th>
                    <th className="px-6 py-4">Withdrawn</th>
                    <th className="px-6 py-4">KYC</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(43_85%_52%/0.1)]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[hsl(43_85%_52%/0.05)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center font-bold text-xs text-[hsl(225_20%_6%)] shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                            {u.full_name?.[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold">{u.full_name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gold">
                        ${(u.wallet?.balance || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-semibold">
                        ${(u.wallet?.total_deposited || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-destructive font-semibold">
                        ${(u.wallet?.total_withdrawn || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border ${
                          u.kyc_status === "verified" ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-orange-500/30 text-orange-500 bg-orange-500/10"
                        }`}>
                          {u.kyc_status?.toUpperCase() || "PENDING"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-gold/10 hover:text-gold"
                          onClick={() => {
                            setSelectedUser(u);
                            setIsActionsModalOpen(true);
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Actions Modal */}
      <Dialog open={isActionsModalOpen} onOpenChange={setIsActionsModalOpen}>
        <DialogContent className="max-w-md bg-card-luxury border-gold/20 shadow-glow">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <UserCog className="w-6 h-6 text-gold" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">Manage Authority</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest font-bold">
                  User: {selectedUser?.full_name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="status" className="mt-4">
            <TabsList className="grid grid-cols-3 bg-black/40 border border-white/5 p-1 rounded-xl">
              <TabsTrigger value="status" className="data-[state=active]:bg-gold data-[state=active]:text-black text-[10px] font-bold uppercase">Account</TabsTrigger>
              <TabsTrigger value="kyc" className="data-[state=active]:bg-gold data-[state=active]:text-black text-[10px] font-bold uppercase">KYC</TabsTrigger>
              <TabsTrigger value="wallet" className="data-[state=active]:bg-gold data-[state=active]:text-black text-[10px] font-bold uppercase">Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Toggle the user's account status. Suspended users will be unable to log in or execute trades.
                </p>
                <Button 
                  className="w-full flex items-center gap-2 font-bold"
                  variant={selectedUser?.status === "suspended" ? "default" : "destructive"}
                  onClick={() => handleAction(
                    selectedUser.id, 
                    { status: selectedUser.status === "suspended" ? "active" : "suspended" },
                    `User account ${selectedUser.status === "suspended" ? "activated" : "suspended"}`
                  )}
                >
                  {selectedUser?.status === "suspended" ? <UserCheck className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                  {selectedUser?.status === "suspended" ? "Activate Account" : "Suspend Account"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="kyc" className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Verify or reset the user's identity status. Verification is required for withdrawals.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase"
                    onClick={() => handleAction(selectedUser.id, { kyc_status: "verified" }, "User KYC verified")}
                  >
                    <ShieldCheck className="w-3 h-3 mr-2" />
                    Verify KYC
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/10 font-bold text-[10px] uppercase"
                    onClick={() => handleAction(selectedUser.id, { kyc_status: "pending" }, "User KYC reset to pending")}
                  >
                    Reset KYC
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Manually adjust the user's balance. Use negative values to deduct.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                    <Input 
                      type="number"
                      placeholder="0.00" 
                      className="pl-7 bg-black/40 border-white/10"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="bg-gold text-black hover:bg-gold/80 font-bold"
                    onClick={handleBalanceAdjust}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 border-t border-white/5 pt-4">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setIsActionsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ManageUsers;
