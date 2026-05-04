import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Edit, Trash, Plus, CheckCircle, PieChart } from "lucide-react";

export interface Plan {
  id: string;
  name: string;
  roi: string;
  roiNum: number;
  min: number;
  max: number | null; // null represents Infinity
  duration: number;
  features: string[];
}

const defaultPlans: Plan[] = [
  { id: "starter", name: "Starter",  roi: "3.0%", roiNum: 3.0,  min: 50,     max: 999,     duration: 30,  features: ["Instant Accrual", "Capital Return", "Email Support"] },
  { id: "bronze",  name: "Bronze",   roi: "4.0%", roiNum: 4.0,  min: 1000,   max: 4999,    duration: 45,  features: ["Instant Accrual", "Capital Return", "Priority Support"] },
  { id: "silver",  name: "Silver",   roi: "5.5%", roiNum: 5.5,  min: 5000,   max: 9999,    duration: 60,  features: ["Instant Accrual", "Capital Return", "24/7 Support"] },
  { id: "gold",    name: "Gold",     roi: "7.0%", roiNum: 7.0,  min: 10000,  max: 49999,   duration: 90,  features: ["Instant Accrual", "Capital Return", "Dedicated Manager"] },
  { id: "diamond", name: "Diamond",  roi: "10.0%",roiNum: 10.0, min: 50000,  max: 99999,   duration: 120, features: ["Instant Accrual", "Capital Return", "VIP Manager"] },
  { id: "vip",     name: "VIP Elite",roi: "15.0%",roiNum: 15.0, min: 100000, max: null, duration: 180, features: ["Instant Accrual", "Capital Return", "Personal Advisor"] },
];

const ManagePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const { toast } = useToast();

  const fetchPlans = async () => {
    try {
      const snap = await getDocs(collection(db, "plans"));
      if (snap.empty) {
        // Seed default plans
        const batch = writeBatch(db);
        defaultPlans.forEach(plan => {
          const docRef = doc(db, "plans", plan.id);
          batch.set(docRef, plan);
        });
        await batch.commit();
        setPlans(defaultPlans);
        toast({ title: "Default Plans Seeded", description: "Successfully created default investment plans." });
      } else {
        const fetchedPlans = snap.docs.map(d => ({ id: d.id, ...d.data() } as Plan));
        // Sort by minimum amount to keep them ordered naturally
        fetchedPlans.sort((a, b) => a.min - b.min);
        setPlans(fetchedPlans);
      }
    } catch (error: any) {
      toast({ title: "Error Fetching Plans", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      // Basic validation
      if (editingPlan.min < 0 || (editingPlan.max !== null && editingPlan.min > editingPlan.max)) {
        toast({ title: "Invalid Limits", description: "Min amount cannot be greater than Max amount.", variant: "destructive" });
        return;
      }
      
      const newPlanId = editingPlan.id.trim() || editingPlan.name.toLowerCase().replace(/\s+/g, '-');
      const planToSave = { ...editingPlan, id: newPlanId };
      
      await setDoc(doc(db, "plans", newPlanId), planToSave);
      
      toast({ title: "Plan Saved", description: `${editingPlan.name} has been updated successfully.` });
      setEditingPlan(null);
      fetchPlans();
    } catch (error: any) {
      toast({ title: "Failed to Save", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan? Active investments will not be affected, but users won't be able to buy it anymore.")) return;
    try {
      await deleteDoc(doc(db, "plans", id));
      toast({ title: "Plan Deleted", description: "The plan has been removed." });
      fetchPlans();
    } catch (error: any) {
      toast({ title: "Deletion Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Investment Plans</h1>
            <p className="text-sm text-muted-foreground">Manage ROI, limits, and durations for all platform investment tiers.</p>
          </div>
          <Button 
            className="bg-gold text-[hsl(225_20%_6%)] hover:bg-gold/80 font-bold gap-2"
            onClick={() => setEditingPlan({
              id: "", name: "", roi: "0.0%", roiNum: 0, min: 0, max: 1000, duration: 30, features: ["Instant Accrual"]
            })}
          >
            <Plus className="w-4 h-4" /> Add New Plan
          </Button>
        </div>

        {editingPlan && (
          <Card className="bg-[hsl(43_85%_52%/0.05)] border-[hsl(43_85%_52%/0.2)] shadow-lg shadow-gold/5">
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <PieChart className="w-5 h-5" /> 
                {editingPlan.id ? "Edit Plan" : "Create New Plan"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePlan} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Plan ID (Unique)</Label>
                  <Input 
                    value={editingPlan.id} 
                    onChange={e => setEditingPlan({...editingPlan, id: e.target.value})} 
                    disabled={!!plans.find(p => p.id === editingPlan.id)} // disable if editing existing
                    placeholder="e.g. platinum-tier"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input 
                    value={editingPlan.name} 
                    onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} 
                    placeholder="e.g. Platinum"
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Daily ROI String (e.g. '5.0%')</Label>
                  <Input 
                    value={editingPlan.roi} 
                    onChange={e => setEditingPlan({...editingPlan, roi: e.target.value})} 
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Daily ROI Number (for math)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={editingPlan.roiNum} 
                    onChange={e => setEditingPlan({...editingPlan, roiNum: parseFloat(e.target.value)})} 
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Amount ($)</Label>
                  <Input 
                    type="number"
                    value={editingPlan.min} 
                    onChange={e => setEditingPlan({...editingPlan, min: parseInt(e.target.value)})} 
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Amount ($) - Leave blank for Infinity</Label>
                  <Input 
                    type="number"
                    value={editingPlan.max === null ? "" : editingPlan.max} 
                    onChange={e => setEditingPlan({...editingPlan, max: e.target.value ? parseInt(e.target.value) : null})} 
                    placeholder="Infinity"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (Days)</Label>
                  <Input 
                    type="number"
                    value={editingPlan.duration} 
                    onChange={e => setEditingPlan({...editingPlan, duration: parseInt(e.target.value)})} 
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>Features (Comma separated)</Label>
                  <Input 
                    value={editingPlan.features.join(", ")} 
                    onChange={e => setEditingPlan({...editingPlan, features: e.target.value.split(",").map(f => f.trim())})} 
                    required
                    className="bg-background"
                  />
                </div>
                <div className="lg:col-span-3 flex justify-end gap-4 mt-4">
                  <Button type="button" variant="ghost" onClick={() => setEditingPlan(null)}>Cancel</Button>
                  <Button type="submit" variant="gradient" className="px-8">Save Plan</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-muted-foreground animate-pulse">Loading plans from database...</div>
          ) : plans.map((plan) => (
            <Card key={plan.id} className="bg-card/30 border-[hsl(43_85%_52%/0.15)] overflow-hidden flex flex-col hover:border-gold/50 transition-colors">
              <CardHeader className="bg-[hsl(43_85%_52%/0.02)] border-b border-[hsl(43_85%_52%/0.1)] pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                    <p className="text-xs font-mono text-muted-foreground mt-1">ID: {plan.id}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gold hover:bg-gold/10 hover:text-gold" onClick={() => setEditingPlan(plan)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(plan.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-3xl font-extrabold text-gold">{plan.roi}</span>
                  <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Daily</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Min Deposit</p>
                    <p className="font-bold text-foreground">${plan.min.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Max Deposit</p>
                    <p className="font-bold text-foreground">{plan.max === null ? "Unlimited" : `$${plan.max.toLocaleString()}`}</p>
                  </div>
                  <div className="col-span-2 p-3 rounded-xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.1)]">
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="font-bold text-gold">{plan.duration} Days</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Features</p>
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> {f}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagePlans;
