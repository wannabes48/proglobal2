import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { ActiveInvestments } from "@/components/dashboard/ActiveInvestments";
import { EarningsChart } from "@/components/dashboard/EarningsChart";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { WatchlistWidget } from "@/components/dashboard/WatchlistWidget";
import { InvestmentDetailModal } from "@/components/dashboard/InvestmentDetailModal";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TrendingUp, Globe, Activity, Zap } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [totalLiveEarnings, setTotalLiveEarnings] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch wallet
        const walletRef = doc(db, "wallets", user.uid);
        const walletSnap = await getDoc(walletRef);
        if (walletSnap.exists()) {
          setWallet(walletSnap.data());
        }

        // Fetch active investments
        const invRef = collection(db, "investments");
        const q = query(invRef, where("user_id", "==", user.uid), where("status", "==", "active"));
        const invSnap = await getDocs(q);
        const now = new Date();
        const invList = invSnap.docs.map(doc => {
          const data = doc.data();
          const startDate = new Date(data.start_date);
          const elapsedMs = now.getTime() - startDate.getTime();
          const durationMs = data.duration_days * 24 * 60 * 60 * 1000;
          
          // Calculate real-time progress (0 to 100)
          const progress = Math.min(100, Math.floor((elapsedMs / durationMs) * 100));
          
          // Calculate real-time earnings based on daily ROI
          const elapsedDays = elapsedMs / (24 * 60 * 60 * 1000);
          const totalEarned = (data.amount * (data.roi_percentage / 100) * elapsedDays).toFixed(2);
          
          return { 
            id: doc.id, 
            ...data, 
            progress: progress || 0,
            total_earned: totalEarned
          };
        });
        setInvestments(invList);

        // Calculate combined live earnings
        const combinedLiveEarnings = invList.reduce((acc, inv: any) => acc + parseFloat(inv.total_earned), 0);
        setTotalLiveEarnings(combinedLiveEarnings);

        // Calculate 7-day earnings history (Cumulative)
        const history: any[] = [];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        
        let cumulativeEarnings = 0;
        // We calculate daily earnings first, then accumulate
        for (let i = 6; i >= 0; i--) {
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() - i);
          targetDate.setHours(23, 59, 59, 999); // End of that day
          
          let dayEarnings = 0;
          invList.forEach((inv: any) => {
            const startDate = new Date(inv.start_date);
            if (targetDate >= startDate) {
              // Approximate earnings for that specific day
              dayEarnings += (inv.amount * inv.roi_percentage / 100);
            }
          });
          
          cumulativeEarnings += dayEarnings;
          history.push({ 
            name: days[targetDate.getDay()], 
            amount: parseFloat(cumulativeEarnings.toFixed(2)) 
          });
        }
        setChartData(history);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-gold" />
              Intelligence Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Real-time performance monitoring and market analytics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/5 border border-gold/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (Left 8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            <WalletCard 
              balance={wallet?.balance || 0} 
              totalEarned={(wallet?.total_earned || 0) + totalLiveEarnings} 
            />
            
            <div className="grid md:grid-cols-2 gap-8">
              <EarningsChart data={chartData} />
              <AllocationChart investments={investments} />
            </div>

            {/* Market Pulse (Desktop Only) */}
            <Card className="bg-card-luxury border-gold/10 h-[400px] overflow-hidden hidden md:block">
              <div className="p-4 border-b border-gold/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gold" />
                  <span className="text-xs font-bold text-gold uppercase tracking-widest">Global Market Watchlist</span>
                </div>
                <TrendingUp className="w-4 h-4 text-gold opacity-50" />
              </div>
              <div className="h-full">
                <WatchlistWidget />
              </div>
            </Card>
          </div>

          {/* Sidebar Area (Right 4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            <ActiveInvestments 
              investments={investments} 
              onInvestmentClick={(inv) => {
                setSelectedInvestment(inv);
                setIsModalOpen(true);
              }}
            />
            
            {/* Quick Stats or News could go here */}
            <Card className="bg-gradient-to-br from-[hsl(43_85%_52%/0.1)] to-transparent border-gold/10 p-6">
              <h4 className="text-gold font-bold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Pro Tip
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Diversifying your capital across different plan durations (Starter, Gold, Platinum) can optimize your daily ROI while maintaining liquidity.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <InvestmentDetailModal 
        investment={selectedInvestment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
