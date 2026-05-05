import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { ActiveInvestments } from "@/components/dashboard/ActiveInvestments";
import { EarningsChart } from "@/components/dashboard/EarningsChart";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Dashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [totalLiveEarnings, setTotalLiveEarnings] = useState(0);
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
        const combinedLiveEarnings = invList.reduce((acc, inv) => acc + parseFloat(inv.total_earned), 0);
        setTotalLiveEarnings(combinedLiveEarnings);
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
      <div className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <WalletCard 
              balance={wallet?.balance || 0} 
              totalEarned={(wallet?.total_earned || 0) + totalLiveEarnings} 
            />
            <EarningsChart />
          </div>
          <div className="space-y-8">
            <ActiveInvestments investments={investments} />
            {/* Quick Actions or Referral Widget could go here */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
