import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const credential = await signIn(values.email, values.password);
      const token = await credential.user.getIdTokenResult();
      
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      
      if (token.claims.admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password, values.fullName);
      toast({ title: "Account created!", description: "Welcome to ProGlobal Markets." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const credential = await signInWithGoogle();
      const token = await credential.user.getIdTokenResult();
      
      toast({ title: "Welcome!", description: "Signed in with Google successfully." });
      
      if (token.claims.admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Column - Auth Form */}
      <div className="flex-1 flex flex-col relative z-10 w-full lg:w-1/2">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6 lg:p-12 pt-24 lg:pt-0">
          <div className="w-full max-w-md mx-auto">
            {/* Logo (Mobile Only) */}
            <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
              <Globe className="w-8 h-8 text-gold" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold">ProGlobal</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold opacity-80 font-medium">Markets</span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Access Portal</h1>
              <p className="text-muted-foreground text-sm">Secure entry to your institutional portfolio.</p>
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[hsl(43_85%_52%/0.2)] bg-[hsl(43_85%_52%/0.05)] hover:bg-[hsl(43_85%_52%/0.1)] transition-all duration-200 mb-6 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(234,179,8,0.1)]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-card/50 border border-[hsl(43_85%_52%/0.1)] p-1">
                <TabsTrigger value="login" className="text-sm font-semibold rounded-md data-[state=active]:bg-gradient-gold data-[state=active]:text-[hsl(225_20%_6%)]">LOGIN</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm font-semibold rounded-md data-[state=active]:bg-gradient-gold data-[state=active]:text-[hsl(225_20%_6%)]">SIGN UP</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <Input id="login-email" type="email" placeholder="name@example.com" className="bg-[hsl(225_12%_16%/0.3)] border-[hsl(43_85%_52%/0.15)] focus:border-gold h-12" {...loginForm.register("email")} />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Button variant="link" size="sm" className="px-0 font-normal h-auto text-gold" onClick={() => navigate("/reset-password")} type="button">
                        Forgot Password?
                      </Button>
                    </div>
                    <Input id="login-password" type="password" placeholder="••••••••" className="bg-[hsl(225_12%_16%/0.3)] border-[hsl(43_85%_52%/0.15)] focus:border-gold h-12" {...loginForm.register("password")} />
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full h-12 mt-4" variant="gradient" disabled={isLoading}>
                    {isLoading ? "Authenticating..." : "SECURE LOGIN"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" className="bg-[hsl(225_12%_16%/0.3)] border-[hsl(43_85%_52%/0.15)] focus:border-gold h-12" {...signupForm.register("fullName")} />
                    {signupForm.formState.errors.fullName && (
                      <p className="text-xs text-destructive">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input id="signup-email" type="email" placeholder="name@example.com" className="bg-[hsl(225_12%_16%/0.3)] border-[hsl(43_85%_52%/0.15)] focus:border-gold h-12" {...signupForm.register("email")} />
                    {signupForm.formState.errors.email && (
                      <p className="text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" placeholder="••••••••" className="bg-[hsl(225_12%_16%/0.3)] border-[hsl(43_85%_52%/0.15)] focus:border-gold h-12" {...signupForm.register("password")} />
                    {signupForm.formState.errors.password && (
                      <p className="text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" className="bg-[hsl(225_12%_16%/0.3)] border-[hsl(43_85%_52%/0.15)] focus:border-gold h-12" {...signupForm.register("confirmPassword")} />
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full h-12 mt-4" variant="gradient" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "CREATE ACCOUNT"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        {/* Footer hidden on mobile when side-by-side, visible otherwise */}
        <div className="lg:hidden">
          <Footer />
        </div>
      </div>

      {/* Right Column - Branding Display (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(43_85%_52%/0.15)] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop" 
            alt="Trading Markets" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
        </div>

        <div className="relative z-20 max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <Globe className="w-12 h-12 text-gold animate-float" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-4xl font-bold text-white">ProGlobal</span>
              <span className="text-xs uppercase tracking-[0.4em] text-gold font-bold">Markets</span>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-6">
            Execute Trades with <br/>
            <span className="shimmer-text">Institutional Precision</span>
          </h2>
          <p className="text-lg text-white/70 mb-8 border-l-2 border-gold pl-4">
            Join thousands of elite traders managing their portfolios through our proprietary, secure, and lightning-fast infrastructure.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-white shimmer-text">$2.4B+</p>
              <p className="text-sm text-white/50 uppercase tracking-wider font-semibold">Volume Traded</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white shimmer-text">99.9%</p>
              <p className="text-sm text-white/50 uppercase tracking-wider font-semibold">Uptime SLA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
