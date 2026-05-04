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
      await signIn(values.email, values.password);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      navigate("/dashboard");
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
      await signInWithGoogle();
      toast({ title: "Welcome!", description: "Signed in with Google successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-12 relative">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[hsl(43_85%_52%/0.04)] rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Globe className="w-8 h-8 text-gold" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl font-bold">ProGlobal</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold opacity-80 font-medium">Markets</span>
            </div>
          </div>

          {/* Google Button — shown above tabs, works for both login and signup */}
          <button
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[hsl(43_85%_52%/0.2)] bg-[hsl(43_85%_52%/0.05)] hover:bg-[hsl(43_85%_52%/0.1)] transition-all duration-200 mb-6 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Google SVG */}
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
            <span className="text-xs text-muted-foreground uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-card/50 border border-border">
              <TabsTrigger value="login" className="text-sm font-semibold">LOGIN</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-semibold">SIGN UP</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-card/30 border-[hsl(43_85%_52%/0.15)] backdrop-blur-xl shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                  <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <Input id="login-email" type="email" placeholder="name@example.com" {...loginForm.register("email")} />
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
                      <Input id="login-password" type="password" placeholder="••••••••" {...loginForm.register("password")} />
                      {loginForm.formState.errors.password && (
                        <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full h-12" variant="gradient" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "LOGIN TO ACCOUNT"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="bg-card/30 border-[hsl(43_85%_52%/0.15)] backdrop-blur-xl shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                  <CardDescription>Join our platform and start growing your wealth.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="John Doe" {...signupForm.register("fullName")} />
                      {signupForm.formState.errors.fullName && (
                        <p className="text-xs text-destructive">{signupForm.formState.errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <Input id="signup-email" type="email" placeholder="name@example.com" {...signupForm.register("email")} />
                      {signupForm.formState.errors.email && (
                        <p className="text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" placeholder="••••••••" {...signupForm.register("password")} />
                      {signupForm.formState.errors.password && (
                        <p className="text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" {...signupForm.register("confirmPassword")} />
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-xs text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full h-12" variant="gradient" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "SIGN UP NOW"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
