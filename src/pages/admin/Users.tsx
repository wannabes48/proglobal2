import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCog, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [_loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
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
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    toast({ 
      title: "Action Disabled", 
      description: "Admin roles are now strictly managed via Firebase Custom Claims and can only be assigned via the secure Node.js backend. Please use the set-admin.js script.", 
      variant: "destructive" 
    });
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
          <div className="flex gap-2">
            <Button variant="outline" className="border-[hsl(43_85%_52%/0.2)] hover:bg-gold/10 hover:text-gold">Export CSV</Button>
            <Button className="bg-gold text-[hsl(225_20%_6%)] hover:bg-gold/80 font-bold">Add New User</Button>
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
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Actions</th>
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
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Toggle Admin Role"
                            onClick={() => handleRoleToggle(u.id, u.role)}
                          >
                            <UserCog className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
