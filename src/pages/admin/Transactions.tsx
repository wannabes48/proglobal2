import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Check, X, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [_loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      const snap = await getDocs(collection(db, "transactions"));
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  const handleAction = async (tx: any, status: "completed" | "failed") => {
    try {
      // 1. Update transaction status
      await updateDoc(doc(db, "transactions", tx.id), { status });

      // 2. If it's a deposit being completed, add to user wallet
      if (tx.type === "deposit" && status === "completed") {
        await updateDoc(doc(db, "wallets", tx.user_id), {
          balance: increment(tx.amount),
          total_deposited: increment(tx.amount)
        });
      }

      // Note: For withdrawals, balance was already locked (deducted) during request.
      // If a withdrawal is FAILED, we should REFUND the balance.
      if (tx.type === "withdrawal" && status === "failed") {
        await updateDoc(doc(db, "wallets", tx.user_id), {
          balance: increment(tx.amount),
          total_withdrawn: increment(-tx.amount)
        });
      }

      setTransactions(transactions.map(t => t.id === tx.id ? { ...t, status } : t));
      toast({ title: `Transaction ${status}`, description: `Action processed successfully.` });
    } catch (error: any) {
      toast({ title: "Action Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card className="bg-card/30 border-border overflow-hidden">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-2">
                        {tx.type === "deposit" ? <ArrowDownCircle className="text-green-500 w-4 h-4" /> : <ArrowUpCircle className="text-destructive w-4 h-4" />}
                        <span className="capitalize font-bold">{tx.type}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                        {tx.user_id.substring(0, 12)}...
                      </td>
                      <td className="px-6 py-4 font-semibold">${tx.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={tx.status === "completed" ? "outline" : tx.status === "pending" ? "outline" : "destructive"}
                          className={tx.status === "pending" ? "bg-gradient-gold text-[hsl(225_20%_6%)] border-none" : ""}>
                          {tx.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {tx.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleAction(tx, "completed")}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleAction(tx, "failed")}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
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

export default ManageTransactions;
