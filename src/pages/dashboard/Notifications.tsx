import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, updateDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Bell, 
  Check, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Info,
  Clock
} from "lucide-react";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "notifications"),
        where("user_id", "==", user.uid)
      );
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Client-side sort to avoid index requirement
      fetched.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setNotifications(fetched);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;
    
    try {
      const batch = writeBatch(db);
      unread.forEach(n => {
        batch.update(doc(db, "notifications", n.id), { read: true });
      });
      await batch.commit();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "transaction": return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case "investment": return <TrendingUp className="w-5 h-5 text-gold" />;
      case "security": return <ShieldAlert className="w-5 h-5 text-destructive" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
              <Bell className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
              <p className="text-sm text-muted-foreground">Stay updated with your account activity</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-xs font-bold uppercase tracking-widest text-gold hover:bg-gold/10"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20">
              <Clock className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground animate-pulse">Synchronizing alerts...</p>
            </div>
          ) : notifications.length === 0 ? (
            <Card className="bg-card-luxury border-white/5 border-dashed py-20 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg">All caught up!</h3>
              <p className="text-muted-foreground text-sm">You have no new notifications.</p>
            </Card>
          ) : (
            notifications.map((notif) => (
              <Card 
                key={notif.id} 
                className={`bg-card-luxury border-none transition-all duration-300 relative overflow-hidden group ${
                  !notif.read ? 'bg-gold/5 border-l-4 border-l-gold' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative z-10 flex items-start gap-4">
                  <div className={`p-3 rounded-xl shadow-inner ${
                    notif.type === 'transaction' ? 'bg-emerald-500/10' :
                    notif.type === 'investment' ? 'bg-gold/10' :
                    notif.type === 'security' ? 'bg-destructive/10' :
                    'bg-blue-500/10'
                  }`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-sm ${!notif.read ? 'text-white' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full hover:bg-gold hover:text-black transition-colors"
                      onClick={() => markAsRead(notif.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
