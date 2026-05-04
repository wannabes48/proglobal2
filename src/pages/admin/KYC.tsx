import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Check, X, FileText } from "lucide-react";

const KYCApprovals = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      const q = query(collection(db, "profiles"), where("kyc_status", "==", "pending"));
      const snap = await getDocs(q);
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleAction = async (userId: string, status: "verified" | "rejected") => {
    try {
      await updateDoc(doc(db, "profiles", userId), { kyc_status: status });
      setRequests(requests.filter(r => r.id !== userId));
      toast({ title: `KYC ${status === "verified" ? "Approved" : "Rejected"}`, description: `User has been notified.` });
    } catch (error: any) {
      toast({ title: "Action Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card className="bg-card/30 border-[hsl(43_85%_52%/0.15)] overflow-hidden backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Pending KYC Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-[hsl(43_85%_52%/0.05)] text-muted-foreground border-b border-[hsl(43_85%_52%/0.15)]">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Document</th>
                    <th className="px-6 py-4">Submitted At</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(43_85%_52%/0.1)]">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-[hsl(43_85%_52%/0.02)] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{r.full_name}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto gap-2 text-gold hover:text-gold/80"
                          onClick={() => window.open(r.kyc_document_url, '_blank')}
                        >
                          <FileText className="w-4 h-4" />
                          View Document
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {r.kyc_submitted_at ? new Date(r.kyc_submitted_at).toLocaleString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 gap-1"
                            onClick={() => handleAction(r.id, "verified")}
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 gap-1"
                            onClick={() => handleAction(r.id, "rejected")}
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && requests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        No pending KYC requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default KYCApprovals;
