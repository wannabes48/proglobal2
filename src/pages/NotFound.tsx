import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="relative mb-8">
          <h1 className="text-[12rem] md:text-[18rem] font-black opacity-5 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold">Lost in Space?</h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved to a new destination.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="gradient" className="gap-2" onClick={() => navigate("/")}>
            <Home className="w-4 h-4" />
            BACK TO HOME
          </Button>
          <Button size="lg" variant="outline" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            GO BACK
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
