import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { blogPosts, categoryColors } from "@/data/blogData";

const Blog = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(43_85%_52%/0.03)] rounded-full blur-[120px]" />
          </div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(43_85%_52%/0.1)] border border-[hsl(43_85%_52%/0.2)] text-gold text-xs font-bold uppercase tracking-widest mb-6">
              <TrendingUp className="w-3 h-3" />
              Market Intelligence
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Financial <span className="text-gold-gradient">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Expert analysis, investment strategies, and platform news from our team of financial professionals.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-6">
            {/* Featured Post */}
            <div
              className="relative rounded-3xl overflow-hidden border border-[hsl(43_85%_52%/0.15)] mb-12 cursor-pointer group"
              style={{ background: "var(--gradient-card)" }}
              onClick={() => navigate(`/blog/${blogPosts[0].id}`)}
            >
              <div className="grid lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-10 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 w-fit bg-gradient-gold text-[hsl(225_20%_6%)]">
                    Featured
                  </span>
                  <h2 className="font-display text-3xl font-bold mb-4 group-hover:text-gold transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold text-sm">
                        {blogPosts[0].author[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{blogPosts[0].author}</p>
                        <p className="text-xs text-muted-foreground">{blogPosts[0].date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remaining Posts */}
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.slice(1).map((post) => (
                <Card
                  key={post.id}
                  className="bg-card/30 border-[hsl(43_85%_52%/0.1)] overflow-hidden flex flex-col hover:border-[hsl(43_85%_52%/0.3)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold mb-3 group-hover:text-gold transition-colors leading-tight">
                      {post.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold text-xs">
                          {post.author[0]}
                        </div>
                        <span className="font-semibold">{post.author}</span>
                      </div>
                      <Button variant="link" className="p-0 h-auto gap-1 text-gold text-xs font-bold">
                        READ MORE <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
