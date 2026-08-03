import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, FileText, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { KycDropzone } from "@/components/ui/kyc-dropzone";

const KYC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (profile?.kyc_status === "verified") {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center space-y-6 pt-12">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold">Identity Verified</h2>
          <p className="text-muted-foreground">
            Thank you! Your identity has been verified. You now have full access to all platform features.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !uploadedUrl) return;

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "profiles", user.uid), {
        kyc_status: "pending",
        kyc_document_url: uploadedUrl,
        kyc_submitted_at: new Date().toISOString(),
      });

      toast({ title: "KYC Submitted", description: "Your documents have been successfully uploaded and are under review." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card/30 border-[hsl(43_85%_52%/0.15)] backdrop-blur-xl">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-[hsl(43_85%_52%/0.15)] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <CardTitle className="text-2xl font-bold">Identity Verification</CardTitle>
            <CardDescription>
              Upload a valid government-issued ID (Passport, National ID, or Driver's License) to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.kyc_status === "pending" ? (
              <div className="p-8 text-center space-y-4 bg-[hsl(43_85%_52%/0.05)] rounded-2xl border border-[hsl(43_85%_52%/0.2)]">
                <Clock className="w-10 h-10 text-gold mx-auto" />
                <h3 className="text-xl font-bold">Verification Pending</h3>
                <p className="text-sm text-muted-foreground">
                  We are currently reviewing your documents. This process usually takes 24-48 hours.
                </p>
              </div>
            ) : profile?.kyc_status === "rejected" ? (
               <div className="p-8 text-center space-y-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-500">Verification Rejected</h3>
                <p className="text-sm text-muted-foreground">
                  Your submitted documents were rejected. Please ensure the document is clear, valid, and matches your profile details.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6 mt-6 text-left">
                   <div className="space-y-4">
                     <KycDropzone 
                       onUploadSuccess={(url) => setUploadedUrl(url)} 
                       onReset={() => setUploadedUrl(null)} 
                     />
                   </div>
                   <Button type="submit" className="w-full h-12" variant="gradient" disabled={!uploadedUrl || isSubmitting}>
                     {isSubmitting ? "Submitting..." : "RESUBMIT FOR VERIFICATION"}
                   </Button>
                 </form>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  
                  <KycDropzone 
                    onUploadSuccess={(url) => setUploadedUrl(url)} 
                    onReset={() => setUploadedUrl(null)} 
                  />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm p-4 rounded-xl bg-[hsl(43_85%_52%/0.05)] border border-[hsl(43_85%_52%/0.15)]">
                      <FileText className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Verify Personal Details</p>
                        <p className="text-xs text-muted-foreground">Ensure the ID shows your full name and date of birth clearly.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12" variant="gradient" disabled={!uploadedUrl || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "SUBMIT FOR VERIFICATION"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KYC;
