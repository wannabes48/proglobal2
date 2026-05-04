import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { blogPosts, categoryColors } from "@/data/blogData";
import { ArrowLeft, Calendar, Clock, Share2, Link as LinkIcon, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const post = blogPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Button variant="gradient" onClick={() => navigate("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link Copied!", description: "Article link has been copied to your clipboard." });
  };

  // Render content — bold markdown-style text
  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n");
    return paragraphs.map((para, i) => {
      if (para.startsWith("**") && para.endsWith("**")) {
        return (
          <h3 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">
            {para.replace(/\*\*/g, "")}
          </h3>
        );
      }
      // Inline bold
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-muted-foreground leading-relaxed text-lg mb-0">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j} className="text-foreground font-semibold">{part.replace(/\*\*/g, "")}</strong>;
            }
            // Handle bullet list items
            if (para.includes("- **")) {
              const bulletParts = para.split("\n").filter(Boolean);
              return null; // handled below
            }
            return part;
          })}
        </p>
      );
    });
  };

  // Better content renderer
  const renderRichContent = (content: string) => {
    const blocks = content.split("\n\n");
    return blocks.map((block, i) => {
      if (!block.trim()) return null;

      // Bullet list
      if (block.includes("\n- ")) {
        const [intro, ...items] = block.split("\n- ");
        return (
          <div key={i} className="mb-6">
            {intro && <p className="text-muted-foreground leading-relaxed text-lg mb-3">{renderInline(intro)}</p>}
            <ul className="space-y-2 pl-4">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-3 shrink-0" />
                  <span className="text-lg leading-relaxed">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Heading (bold standalone)
      if (block.startsWith("**") && block.endsWith("**")) {
        return (
          <h3 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4 font-display">
            {block.replace(/\*\*/g, "")}
          </h3>
        );
      }

      return (
        <p key={i} className="text-muted-foreground leading-relaxed text-lg mb-6">
          {renderInline(block)}
        </p>
      );
    });
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-foreground font-semibold">{part.replace(/\*\*/g, "")}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(225_20%_6%/0.5)] via-background to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-16 pb-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="text-muted-foreground hover:text-gold mb-8 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
          </Button>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {post.date}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readTime}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">{post.title}</h1>
            <p className="text-xl text-muted-foreground font-light">{post.excerpt}</p>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="container mx-auto px-6 -mt-4 mb-16">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[hsl(43_85%_52%/0.15)] shadow-elegant" style={{ maxHeight: "500px" }}>
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Article Body */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_280px] gap-16">
            {/* Content */}
            <article>
              {/* Author Bar */}
              <div className="flex items-center justify-between py-6 border-y border-[hsl(43_85%_52%/0.15)] mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[hsl(43_85%_52%/0.15)] flex items-center justify-center text-gold font-bold text-lg">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="font-bold">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.authorRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, "_blank")}
                    className="w-9 h-9 rounded-full border border-[hsl(43_85%_52%/0.2)] bg-[hsl(43_85%_52%/0.05)] flex items-center justify-center text-muted-foreground hover:text-gold hover:border-[hsl(43_85%_52%/0.4)] transition-all"
                    title="Share on Twitter"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                    className="w-9 h-9 rounded-full border border-[hsl(43_85%_52%/0.2)] bg-[hsl(43_85%_52%/0.05)] flex items-center justify-center text-muted-foreground hover:text-gold hover:border-[hsl(43_85%_52%/0.4)] transition-all"
                    title="Share on LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-9 h-9 rounded-full border border-[hsl(43_85%_52%/0.2)] bg-[hsl(43_85%_52%/0.05)] flex items-center justify-center text-muted-foreground hover:text-gold hover:border-[hsl(43_85%_52%/0.4)] transition-all"
                    title="Copy link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose-custom">
                {renderRichContent(post.content)}
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-[hsl(43_85%_52%/0.15)]">
                <div className="flex items-center gap-3 flex-wrap">
                  <Tag className="w-4 h-4 text-gold" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-[hsl(43_85%_52%/0.08)] border border-[hsl(43_85%_52%/0.15)] text-muted-foreground hover:text-gold transition-colors cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-16 p-8 rounded-3xl border border-[hsl(43_85%_52%/0.2)] bg-[hsl(43_85%_52%/0.04)]">
                <h3 className="font-display text-2xl font-bold mb-3">Ready to Put This Into Practice?</h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of investors already growing their wealth on ProGlobal Markets.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button variant="gradient" onClick={() => navigate("/auth")}>
                    Open Free Account
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/plans")}>
                    View Investment Plans
                  </Button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Author Card */}
              <div className="p-6 rounded-2xl border border-[hsl(43_85%_52%/0.15)] bg-card/30">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">About the Author</h4>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[hsl(43_85%_52%/0.15)] flex items-center justify-center text-gold font-bold text-xl">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="font-bold">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  An experienced financial professional at ProGlobal Markets with deep expertise in global market analysis and portfolio management.
                </p>
              </div>

              {/* Related Posts */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Related Articles</h4>
                <div className="space-y-4">
                  {relatedPosts.map((related) => (
                    <div
                      key={related.id}
                      onClick={() => navigate(`/blog/${related.id}`)}
                      className="flex gap-3 cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight group-hover:text-gold transition-colors line-clamp-2">
                          {related.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {related.readTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="p-6 rounded-2xl border border-[hsl(43_85%_52%/0.15)] bg-card/30">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
                  <Share2 className="w-3 h-3" /> Share Article
                </h4>
                <div className="flex gap-2">
                  <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`, "_blank")} className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-gold hover:border-[hsl(43_85%_52%/0.3)] transition-all">Twitter</button>
                  <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")} className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-gold hover:border-[hsl(43_85%_52%/0.3)] transition-all">LinkedIn</button>
                  <button onClick={handleCopyLink} className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-gold hover:border-[hsl(43_85%_52%/0.3)] transition-all">Copy</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
