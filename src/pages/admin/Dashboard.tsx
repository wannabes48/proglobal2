import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  ArrowUpCircle, 
  TrendingUp,
  ShieldAlert,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { InvestmentDetailModal } from "@/components/dashboard/InvestmentDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { ArrowDownCircle, ArrowUpRight, Search, Eye } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeInvestments: 0,
    pendingKYC: 0,
    pendingWithdrawals: 0
  });
  const [recentInvestments, setRecentInvestments] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "profiles"));
        const transSnap = await getDocs(collection(db, "transactions"));
        const invSnap = await getDocs(query(collection(db, "investments"), where("status", "==", "active")));
        const kycSnap = await getDocs(query(collection(db, "profiles"), where("kyc_status", "==", "pending")));
        
        // Build users map for quick lookup
        const usersMap = new Map();
        usersSnap.docs.forEach(doc => {
          usersMap.set(doc.id, doc.data());
        });

        // Detailed data for tables
        const now = new Date();
        const investments = invSnap.docs.map(doc => {
          const data = doc.data();
          const startDate = new Date(data.start_date);
          const elapsedMs = now.getTime() - startDate.getTime();
          const durationMs = data.duration_days * 24 * 60 * 60 * 1000;
          const progress = Math.min(100, Math.floor((elapsedMs / durationMs) * 100));
          const elapsedDays = elapsedMs / (24 * 60 * 60 * 1000);
          const totalEarned = (data.amount * (data.roi_percentage / 100) * elapsedDays).toFixed(2);
          
          const userProfile = usersMap.get(data.user_id);
          
          return { 
            id: doc.id, 
            ...data, 
            progress: progress || 0, 
            total_earned: totalEarned,
            user_name: userProfile?.full_name || "Unknown User",
            user_email: userProfile?.email || "No email"
          };
        });

        const recentTxSnap = await getDocs(query(collection(db, "transactions"), orderBy("timestamp", "desc"), limit(10)));
        const recentTx = recentTxSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const deposits = transSnap.docs
          .filter(d => d.data().type === "deposit" && d.data().status === "completed")
          .reduce((acc, curr) => acc + curr.data().amount, 0);
        
        const withdrawals = transSnap.docs
          .filter(d => d.data().type === "withdrawal" && d.data().status === "completed")
          .reduce((acc, curr) => acc + curr.data().amount, 0);

        const pendingWithdrawalsCount = transSnap.docs
          .filter(d => d.data().type === "withdrawal" && d.data().status === "pending").length;

        setRecentInvestments(investments);
        setRecentTransactions(recentTx);
        setStats({
          totalUsers: usersSnap.size,
          totalDeposits: deposits,
          totalWithdrawals: withdrawals,
          activeInvestments: invSnap.size,
          pendingKYC: kycSnap.size,
          pendingWithdrawals: pendingWithdrawalsCount
        });
      } catch (error: any) {
        console.error("Error fetching admin stats:", error);
        toast({ title: "Stats Fetch Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-white" },
    { label: "Total Deposits", value: `$${stats.totalDeposits.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
    { label: "Total Withdrawals", value: `$${stats.totalWithdrawals.toLocaleString()}`, icon: ArrowUpCircle, color: "text-destructive" },
    { label: "Active Investments", value: stats.activeInvestments, icon: TrendingUp, color: "text-gold" },
    { label: "Pending KYC", value: stats.pendingKYC, icon: ShieldAlert, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="bg-card-luxury border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-glow relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(43_85%_52%/0.1)] to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.1)] ${stat.color} shadow-inner`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight shimmer-text">{stat.value}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 font-semibold">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card-luxury border-none shadow-elegant">
            <CardHeader className="border-b border-[hsl(43_85%_52%/0.1)] bg-[hsl(225_20%_6%/0.4)]">
              <CardTitle className="text-gold">Volume Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Deposits", amount: stats.totalDeposits },
                    { name: "Withdrawals", amount: stats.totalWithdrawals }
                  ]}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(43 85% 52%)" />
                        <stop offset="100%" stopColor="hsl(30 95% 40%)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(225 18% 10% / 0.9)", 
                        borderColor: "hsl(43 85% 52% / 0.2)",
                        borderRadius: "var(--radius)",
                        backdropFilter: "blur(8px)"
                      }}
                      itemStyle={{ color: "hsl(43 85% 52%)", fontWeight: "bold" }}
                      cursor={{ fill: "hsl(43 85% 52% / 0.05)" }}
                    />
                    <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-luxury border-none shadow-elegant relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(43_85%_52%/0.05)] to-transparent pointer-events-none" />
            <CardHeader className="border-b border-[hsl(43_85%_52%/0.1)] bg-[hsl(225_20%_6%/0.4)]">
              <CardTitle className="text-gold">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wide">Database</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md animate-glow shadow-[0_0_10px_rgba(52,211,153,0.2)]">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wide">Auth Service</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md animate-glow shadow-[0_0_10px_rgba(52,211,153,0.2)]" style={{ animationDelay: "1s" }}>ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tracking-wide">Storage</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md animate-glow shadow-[0_0_10px_rgba(52,211,153,0.2)]" style={{ animationDelay: "2s" }}>ONLINE</span>
              </div>
              <div className="pt-6 border-t border-[hsl(43_85%_52%/0.1)]">
                <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-widest font-bold">Pending Actions</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 shadow-inner">
                    <span className="text-xs font-semibold">KYC Reviews</span>
                    <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">{stats.pendingKYC}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.2)] shadow-inner">
                    <span className="text-xs font-semibold text-gold">Withdrawals</span>
                    <span className="text-xs font-bold text-[hsl(225_20%_6%)] bg-gold px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(234,179,8,0.3)]">{stats.pendingWithdrawals}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Investments Table */}
          <Card className="bg-card-luxury border-none shadow-elegant overflow-hidden">
            <CardHeader className="border-b border-[hsl(43_85%_52%/0.1)] bg-[hsl(225_20%_6%/0.4)] flex flex-row items-center justify-between">
              <CardTitle className="text-gold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Live Active Investments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase bg-black/20 text-muted-foreground border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Investor</th>
                      <th className="px-6 py-4">Contract</th>
                      <th className="px-6 py-4 text-center">Progress</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentInvestments.slice(0, 5).map((inv) => (
                      <tr key={inv.id} className="hover:bg-gold/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)] flex items-center justify-center text-gold font-bold text-xs shadow-inner">
                              {inv.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{inv.user_name}</p>
                              <p className="text-[9px] text-muted-foreground">{inv.user_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-white uppercase text-xs">{inv.plan_name}</p>
                          <p className="text-[9px] text-gold font-mono mt-1 font-semibold">${inv.amount.toLocaleString()} Invested</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 w-full max-w-[120px] mx-auto">
                            <div className="flex items-center justify-between text-[9px] font-bold">
                              <span className="text-muted-foreground">{inv.roi_percentage}% ROI</span>
                              <span className="text-gold">{inv.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-gold shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${inv.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-full hover:bg-gold hover:text-black transition-colors bg-white/5 border border-white/10 shadow-sm"
                            onClick={() => {
                              setSelectedEntity(inv);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions Table */}
          <Card className="bg-card-luxury border-none shadow-elegant overflow-hidden">
            <CardHeader className="border-b border-[hsl(43_85%_52%/0.1)] bg-[hsl(225_20%_6%/0.4)] flex flex-row items-center justify-between">
              <CardTitle className="text-gold flex items-center gap-2">
                <Activity className="w-5 h-5 text-gold" />
                Recent System Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase bg-black/20 text-muted-foreground border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-center">Amount</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentTransactions.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {tx.type === "deposit" ? (
                              <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5 text-destructive" />
                            )}
                            <span className="font-bold text-white capitalize text-xs">{tx.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-white text-xs">
                          ${tx.amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] font-bold ${
                              tx.status === "completed" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
                              tx.status === "pending" ? "border-gold/30 text-gold bg-gold/5" :
                              "border-destructive/30 text-destructive bg-destructive/5"
                            }`}
                          >
                            {tx.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <InvestmentDetailModal 
        investment={selectedEntity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEntity(null);
        }}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
