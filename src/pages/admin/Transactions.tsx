import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, 
  X, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Eye, 
  Clock, 
  User, 
  Activity,
  Hash,
  Calendar
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { createNotification } from "@/lib/notifications";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"), limit(50));
      const snap = await getDocs(q);
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAction = async (tx: any, status: "completed" | "failed") => {
    try {
      await updateDoc(doc(db, "transactions", tx.id), { status });

      const notifTitle = tx.type === 'deposit' ? 'Deposit Update' : 'Withdrawal Update';
      const notifMsg = status === 'completed' 
        ? `Your ${tx.type} of $${tx.amount} has been successfully processed and confirmed.`
        : `Your ${tx.type} of $${tx.amount} was not successful. Please contact support for details.`;
      
      await createNotification(tx.user_id, notifTitle, notifMsg, 'transaction');

      if (tx.type === "deposit" && status === "completed") {
        await updateDoc(doc(db, "wallets", tx.user_id), {
          balance: increment(tx.amount),
          total_deposited: increment(tx.amount)
        });
      }

      if (tx.type === "withdrawal" && status === "failed") {
        await updateDoc(doc(db, "wallets", tx.user_id), {
          balance: increment(tx.amount),
          total_withdrawn: increment(-tx.amount)
        });
      }

      setTransactions(transactions.map(t => t.id === tx.id ? { ...t, status } : t));
      if (selectedTx?.id === tx.id) setSelectedTx({ ...selectedTx, status });
      
      toast({ title: `Transaction ${status}`, description: `Action processed successfully.` });
    } catch (error: any) {
      toast({ title: "Action Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card className="bg-card-luxury border-gold/10 overflow-hidden shadow-elegant">
          <CardHeader className="bg-gold/5 border-b border-gold/10 flex flex-row items-center justify-between">
            <CardTitle className="text-gold">Financial Ledger</CardTitle>
            <Activity className="w-5 h-5 text-gold/50" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase bg-black/40 text-gold border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">User Identity</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gold/5 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${tx.type === 'deposit' ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
                            {tx.type === "deposit" ? <ArrowDownCircle className="text-emerald-400 w-4 h-4" /> : <ArrowUpCircle className="text-destructive w-4 h-4" />}
                          </div>
                          <div>
                            <p className="capitalize font-bold text-white text-xs">{tx.type}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{tx.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[11px] font-mono text-muted-foreground">
                        {tx.user_id}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-white text-xs">
                        ${tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline"
                          className={`text-[9px] font-bold ${
                            tx.status === "completed" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
                            tx.status === "pending" ? "border-gold/30 text-gold bg-gold/5 shadow-[0_0_10px_rgba(234,179,8,0.1)]" :
                            "border-destructive/30 text-destructive bg-destructive/5"
                          }`}
                        >
                          {tx.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full hover:bg-gold hover:text-black transition-colors"
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          
                          {tx.status === "pending" && (
                            <>
                              <Button 
                                size="icon" 
                                className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/20"
                                onClick={() => handleAction(tx, "completed")}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="destructive" 
                                className="h-8 w-8 rounded-full shadow-lg shadow-destructive/20"
                                onClick={() => handleAction(tx, "failed")}
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
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

      {/* Transaction Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-card-luxury border-gold/20 shadow-glow">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${selectedTx?.type === 'deposit' ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
                {selectedTx?.type === 'deposit' ? <ArrowDownCircle className="w-6 h-6 text-emerald-400" /> : <ArrowUpCircle className="w-6 h-6 text-destructive" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white uppercase tracking-tight">
                  {selectedTx?.type} Intelligence
                </DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Ref ID: {selectedTx?.id}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Amount</p>
                <p className="text-lg font-extrabold text-gold">${selectedTx?.amount.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Status</p>
                <Badge className="bg-gold text-black font-bold uppercase text-[9px]">{selectedTx?.status}</Badge>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gold/50" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">User ID</p>
                  <p className="text-xs font-mono text-white">{selectedTx?.user_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gold/50" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Initiated On</p>
                  <p className="text-xs text-white">{selectedTx?.timestamp ? new Date(selectedTx.timestamp).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
              {selectedTx?.wallet_address && (
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-gold/50" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Destination Wallet</p>
                    <p className="text-xs font-mono text-white break-all">{selectedTx.wallet_address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-white/5 pt-6 gap-2">
            {selectedTx?.status === "pending" && (
              <div className="flex w-full gap-3">
                <Button 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                  onClick={() => handleAction(selectedTx, "completed")}
                >
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 font-bold"
                  onClick={() => handleAction(selectedTx, "failed")}
                >
                  Reject
                </Button>
              </div>
            )}
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ManageTransactions;
