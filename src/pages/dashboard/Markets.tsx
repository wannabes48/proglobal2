import { DashboardLayout } from "@/components/layout/DashboardLayout";
import TradingViewWidget from "@/components/markets/TradingViewWidget";
import MarketOverviewWidget from "@/components/markets/MarketOverviewWidget";
import { Card } from "@/components/ui/card";
import { TrendingUp, Globe, Activity, Zap } from "lucide-react";

const Markets = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gold flex items-center gap-3">
              <Globe className="w-8 h-8 animate-pulse" />
              Global Market Insights
            </h1>
            <p className="text-muted-foreground mt-1">Institutional-grade real-time data and advanced charting.</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold" />
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Live Stream</span>
            </div>
          </div>
        </div>

        {/* Stats Grid - High Level Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card-luxury p-6 border-gold/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12 text-gold" />
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Forex Markets</p>
            <h3 className="text-2xl font-bold text-white">Active</h3>
            <p className="text-xs text-gold mt-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              24/5 Direct Access
            </p>
          </Card>
          <Card className="bg-card-luxury p-6 border-gold/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-12 h-12 text-gold" />
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Crypto Assets</p>
            <h3 className="text-2xl font-bold text-white">Volatile</h3>
            <p className="text-xs text-gold mt-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              24/7 Global Trading
            </p>
          </Card>
          <Card className="bg-card-luxury p-6 border-gold/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-12 h-12 text-gold" />
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Global Indices</p>
            <h3 className="text-2xl font-bold text-white">Bullish</h3>
            <p className="text-xs text-gold mt-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Real-time Exchange Feeds
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card-luxury border-gold/10 overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-gold/5 flex items-center justify-between">
                <span className="text-sm font-bold text-gold uppercase tracking-tighter">Advanced Analysis</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold animate-glow" />
                  <span className="text-[10px] text-muted-foreground">REAL-TIME DATA</span>
                </div>
              </div>
              <div className="flex-1">
                <TradingViewWidget />
              </div>
            </Card>
          </div>

          {/* Market Overview Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card-luxury border-gold/10 overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-gold/5 flex items-center justify-between">
                <span className="text-sm font-bold text-gold uppercase tracking-tighter">Market Watch</span>
                <TrendingUp className="w-4 h-4 text-gold opacity-50" />
              </div>
              <div className="flex-1">
                <MarketOverviewWidget />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Markets;
