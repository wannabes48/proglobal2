import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Crypto Investment in 2024",
    excerpt: "Discover the emerging trends and technologies that are shaping the digital asset landscape this year.",
    author: "James Wilson",
    date: "April 15, 2024",
    category: "Crypto",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Understanding Diversification Strategies",
    excerpt: "Learn how to balance risk and reward by spreading your investments across multiple asset classes.",
    author: "Elena Rodriguez",
    date: "April 12, 2024",
    category: "Strategies",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Why Fixed Income Plans are Making a Comeback",
    excerpt: "With changing market conditions, traditional fixed income strategies are once again becoming attractive.",
    author: "Michael Chen",
    date: "April 10, 2024",
    category: "Markets",
    image: "https://images.unsplash.com/photo-1611974717484-788cff60caec?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Security Best Practices for Investors",
    excerpt: "Protect your digital wealth with these essential security tips and platform features.",
    author: "Sarah Jenkins",
    date: "April 08, 2024",
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Financial Insights</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest market trends, investment strategies, and platform news.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-card/30 border-border overflow-hidden flex flex-col md:flex-row hover:border-primary/50 transition-all group">
                <div className="md:w-1/2 overflow-hidden h-48 md:h-auto">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="md:w-1/2 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-gradient-gold text-[hsl(225_20%_6%)] border-none text-[10px] uppercase">{post.category}</Badge>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                        {post.author[0]}
                      </div>
                      <span className="font-semibold">{post.author}</span>
                    </div>
                    <Button variant="link" className="p-0 h-auto gap-2 text-accent text-xs">
                      READ MORE
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
