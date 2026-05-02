import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Clock } from "lucide-react";

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      const q = query(
        collection(db, "transactions"), 
        where("user_id", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchTransactions();
  }, [user]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit": return <ArrowDownCircle className="w-5 h-5 text-green-500" />;
      case "withdrawal": return <ArrowUpCircle className="w-5 h-5 text-destructive" />;
      case "investment": return <TrendingUp className="w-5 h-5 text-accent" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">COMPLETED</Badge>;
      case "pending": return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">PENDING</Badge>;
      case "failed": return <Badge variant="destructive">FAILED</Badge>;
      default: return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <Card className="bg-card/30 border-border overflow-hidden">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {getTypeIcon(tx.type)}
                      <div>
                        <p className="font-bold capitalize">{tx.type}</p>
                        <p className="text-xs text-muted-foreground">ID: {tx.id.substring(0, 8)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {tx.type === "withdrawal" || tx.type === "investment" ? "-" : "+"}
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(tx.status)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!loading && transactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Transactions;
