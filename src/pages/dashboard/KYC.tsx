import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Upload, FileText, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";

const KYC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `kyc/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "profiles", user.uid), {
        kyc_status: "pending",
        kyc_document_url: url,
        kyc_submitted_at: new Date().toISOString(),
      });

      toast({ title: "KYC Submitted", description: "Your documents have been uploaded and are under review." });
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card/30 border-border backdrop-blur-xl">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold">Identity Verification</CardTitle>
            <CardDescription>
              Upload a valid government-issued ID (Passport, National ID, or Driver's License) to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.kyc_status === "pending" ? (
              <div className="p-8 text-center space-y-4 bg-accent/5 rounded-2xl border border-accent/20">
                <Clock className="w-10 h-10 text-accent mx-auto" />
                <h3 className="text-xl font-bold">Verification Pending</h3>
                <p className="text-sm text-muted-foreground">
                  We are currently reviewing your documents. This process usually takes 24-48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept="image/*,.pdf"
                    />
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{file ? file.name : "Click or drag to upload ID"}</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF up to 10MB</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm">
                      <FileText className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium">Verify Personal Details</p>
                        <p className="text-xs text-muted-foreground">Ensure the ID shows your full name and date of birth clearly.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12" variant="gradient" disabled={!file || isUploading}>
                  {isUploading ? "Uploading Documents..." : "SUBMIT FOR VERIFICATION"}
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
