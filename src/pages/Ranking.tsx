import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const rankings = [
  { rank: 1, name: "David S.", country: "United Kingdom", amount: 1250000, color: "text-orange-400" },
  { rank: 2, name: "Maria G.", country: "Spain", amount: 840000, color: "text-zinc-400" },
  { rank: 3, name: "Chen W.", country: "China", amount: 620000, color: "text-amber-600" },
  { rank: 4, name: "John D.", country: "USA", amount: 510000, color: "text-muted-foreground" },
  { rank: 5, name: "Sophie M.", country: "France", amount: 480000, color: "text-muted-foreground" },
  { rank: 6, name: "Aleksei V.", country: "Russia", amount: 450000, color: "text-muted-foreground" },
  { rank: 7, name: "Lars H.", country: "Germany", amount: 420000, color: "text-muted-foreground" },
  { rank: 8, name: "Yuki T.", country: "Japan", amount: 390000, color: "text-muted-foreground" },
  { rank: 9, name: "Amara O.", country: "Nigeria", amount: 350000, color: "text-muted-foreground" },
  { rank: 10, name: "Carlos R.", country: "Brazil", amount: 310000, color: "text-muted-foreground" },
];

const Ranking = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Investor Leaderboard</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Celebrating our top performers and their commitment to long-term wealth building.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Top 3 Spotlight */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-8 mb-8">
              {[rankings[1], rankings[0], rankings[2]].map((player) => (
                <Card key={player.rank} className={cn(
                  "bg-card/30 border-border relative overflow-hidden transition-all duration-300 hover:scale-105",
                  player.rank === 1 ? "md:-translate-y-4 border-accent/50 shadow-glow" : ""
                )}>
                  <CardContent className="p-8 text-center">
                    <div className={cn("w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6", player.color)}>
                      {player.rank === 1 ? <Crown className="w-8 h-8" /> : player.rank === 2 ? <Award className="w-8 h-8" /> : <Medal className="w-8 h-8" />}
                    </div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Rank #{player.rank}</p>
                    <h3 className="text-2xl font-bold mb-2">{player.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{player.country}</p>
                    <p className="text-2xl font-extrabold text-primary">${player.amount.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* List Table */}
            <Card className="lg:col-span-3 bg-card/30 border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="px-6 py-4">Rank</th>
                        <th className="px-6 py-4">Investor</th>
                        <th className="px-6 py-4">Country</th>
                        <th className="px-6 py-4">Total Invested</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rankings.map((player) => (
                        <tr key={player.rank} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                              player.rank <= 3 ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                            )}>
                              {player.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold">{player.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">{player.country}</td>
                          <td className="px-6 py-4 font-extrabold text-primary">${player.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ranking;
