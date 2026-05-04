import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Mail, MapPin, Phone, Shield, X } from "lucide-react";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Profile = () => {
  const { user, profile, resetPassword, sendVerificationEmail, generateTotpSecret, enrollTotp } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    country: profile?.country || "",
  });

  // MFA State
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaSecret, setMfaSecret] = useState<any>(null);
  const [otpCode, setOtpCode] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "profiles", user.uid), formData);
      toast({ title: "Profile Updated", description: "Your personal information has been successfully updated." });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      toast({ title: "Email Sent", description: "Password reset instructions have been sent to your email." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendVerificationEmail();
      toast({ title: "Verification Sent", description: "Please check your inbox to verify your email address." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startMfaSetup = async () => {
    setMfaLoading(true);
    setShowMfaModal(true);
    setOtpCode("");
    try {
      const secret = await generateTotpSecret();
      setMfaSecret(secret);
    } catch (error: any) {
      // Typically fails if Identity Platform is not enabled on standard Firebase
      toast({ 
        title: "Feature Unavailable", 
        description: "Your project requires Firebase Identity Platform for SMS/TOTP MFA. See implementation plan.", 
        variant: "destructive" 
      });
      setShowMfaModal(false);
    } finally {
      setMfaLoading(false);
    }
  };

  const confirmMfaSetup = async () => {
    if (!otpCode) return;
    setMfaLoading(true);
    try {
      await enrollTotp(mfaSecret, otpCode);
      toast({ title: "2FA Enabled!", description: "Your account is now secured with an Authenticator App." });
      setShowMfaModal(false);
    } catch (error: any) {
      toast({ title: "Invalid Code", description: "The code you entered is incorrect or expired.", variant: "destructive" });
    } finally {
      setMfaLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* 2FA Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-card-luxury border border-[hsl(43_85%_52%/0.2)] rounded-2xl p-6 max-w-sm w-full shadow-glow animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gold">Setup Authenticator</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowMfaModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {mfaLoading && !mfaSecret ? (
              <div className="py-8 flex justify-center">
                <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : mfaSecret ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">Scan this QR code using Google Authenticator or Authy.</p>
                <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mfaSecret.qrCodeUrl)}`} 
                    alt="QR Code" 
                    className="w-[150px] h-[150px]"
                  />
                </div>
                <div className="text-left space-y-2 mt-4">
                  <Label>Enter 6-Digit Code</Label>
                  <Input 
                    type="text" 
                    placeholder="000000" 
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="text-center tracking-widest text-lg font-mono"
                  />
                </div>
                <Button className="w-full mt-4" variant="gradient" onClick={confirmMfaSetup} disabled={mfaLoading || otpCode.length !== 6}>
                  {mfaLoading ? "Verifying..." : "VERIFY & ENABLE"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-destructive">Failed to initialize MFA.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-6 p-8 bg-card/30 border border-border rounded-3xl backdrop-blur-xl">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-4xl font-bold">
            {(profile?.full_name || "U")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{profile?.full_name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                profile?.kyc_status === "verified" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
              }`}>
                {profile?.kyc_status || "UNVERIFIED"}
              </span>
              {user?.emailVerified && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500">
                  EMAIL VERIFIED
                </span>
              )}
              {profile?.role === "admin" && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent">
                  ADMIN
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card/30 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name" 
                  value={formData.full_name} 
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" readOnly value={user?.email || ""} className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    className="pl-10" 
                    placeholder="+1 234 567 890"
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Location & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  value={formData.country} 
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
                />
              </div>
              <div className="pt-4">
                <Button className="w-full h-12" variant="gradient" disabled={isUpdating}>
                  {isUpdating ? "Saving Changes..." : "UPDATE PROFILE"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <Card className="bg-card/30 border-destructive/20 border">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your password, email verification, and 2FA.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10" onClick={handlePasswordReset}>
              Change Password
            </Button>
            {!user?.emailVerified && (
              <Button variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10" onClick={handleVerifyEmail}>
                Verify Email
              </Button>
            )}
            <Button variant="outline" className="border-gold/20 text-gold hover:bg-gold/10" onClick={startMfaSetup}>
              Setup 2FA (App)
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
