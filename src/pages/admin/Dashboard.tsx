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
    pendingKYC: 0
  });
  const [_loading, setLoading] = useState(true);

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

        setStats({
          totalUsers: usersSnap.size,
          totalDeposits: deposits,
          totalWithdrawals: withdrawals,
          activeInvestments: invSnap.size,
          pendingKYC: kycSnap.size
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Total Deposits", value: `$${stats.totalDeposits.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
    { label: "Total Withdrawals", value: `$${stats.totalWithdrawals.toLocaleString()}`, icon: ArrowUpCircle, color: "text-destructive" },
    { label: "Active Investments", value: stats.activeInvestments, icon: TrendingUp, color: "text-accent" },
    { label: "Pending KYC", value: stats.pendingKYC, icon: ShieldAlert, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="bg-card/30 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-card/50 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold">{stat.value}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card/30 border-border">
            <CardHeader>
              <CardTitle>Volume Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Deposits", amount: stats.totalDeposits },
                    { name: "Withdrawals", amount: stats.totalWithdrawals }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                      cursor={{ fill: "hsl(var(--muted)/0.1)" }}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auth Service</span>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">ONLINE</span>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">Pending Tasks</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                    <span className="text-xs">KYC Reviews</span>
                    <span className="text-xs font-bold">{stats.pendingKYC}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <span className="text-xs">Withdrawal Requests</span>
                    <span className="text-xs font-bold">0</span>
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
