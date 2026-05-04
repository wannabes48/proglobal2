import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  ArrowUpCircle, 
  TrendingUp,
  ShieldAlert
} from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeInvestments: 0,
    pendingKYC: 0,
    pendingWithdrawals: 0
  });
  const [_loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "profiles"));
        const transSnap = await getDocs(collection(db, "transactions"));
        const invSnap = await getDocs(query(collection(db, "investments"), where("status", "==", "active")));
        const kycSnap = await getDocs(query(collection(db, "profiles"), where("kyc_status", "==", "pending")));

        const deposits = transSnap.docs
          .filter(d => d.data().type === "deposit" && d.data().status === "completed")
          .reduce((acc, curr) => acc + curr.data().amount, 0);
        
        const withdrawals = transSnap.docs
          .filter(d => d.data().type === "withdrawal" && d.data().status === "completed")
          .reduce((acc, curr) => acc + curr.data().amount, 0);

        const pendingWithdrawalsCount = transSnap.docs
          .filter(d => d.data().type === "withdrawal" && d.data().status === "pending").length;

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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
