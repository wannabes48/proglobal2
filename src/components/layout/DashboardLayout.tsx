import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History, 
  Users, 
  ShieldCheck, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  Globe,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Markets", icon: BarChart3, href: "/dashboard/markets" },
  { label: "Invest", icon: TrendingUp, href: "/dashboard/invest" },
  { label: "Deposit", icon: ArrowDownCircle, href: "/dashboard/deposit" },
  { label: "Withdraw", icon: ArrowUpCircle, href: "/dashboard/withdraw" },
  { label: "Transactions", icon: History, href: "/dashboard/transactions" },
  { label: "Referrals", icon: Users, href: "/dashboard/referrals" },
  { label: "KYC Verification", icon: ShieldCheck, href: "/dashboard/kyc" },
  { label: "Profile", icon: UserCircle, href: "/dashboard/profile" },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-card-luxury border border-border rounded-2xl p-6 max-w-sm w-full shadow-elegant animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">Sign Out</h3>
            <p className="text-muted-foreground text-sm mb-6">Are you sure you want to end your secure session?</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 md:relative md:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Globe className="text-gold w-8 h-8" />
              <span className="text-xl font-display font-bold">ProGlobal</span>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-gradient-gold text-[hsl(225_20%_6%)] shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    : "text-muted-foreground hover:bg-[hsl(43_85%_52%/0.05)] hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-[hsl(43_85%_52%/0.1)] bg-[hsl(225_20%_6%/0.4)] backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-30 relative">
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-[hsl(43_85%_52%/0.1)]" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gold" />
          </Button>

          <div className="flex-1 md:flex-none">
            <h1 className="text-lg font-semibold hidden md:block text-gold">
              {menuItems.find(item => item.href === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{profile?.full_name || user?.displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-[hsl(225_20%_6%)] font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              {(profile?.full_name || user?.displayName || "U")[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};
