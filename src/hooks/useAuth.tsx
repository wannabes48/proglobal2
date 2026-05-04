import { useState, useEffect, createContext, useContext } from "react";
import type { User } from "firebase/auth";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  multiFactor,
  TotpMultiFactorGenerator,
  getMultiFactorResolver
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  generateTotpSecret: () => Promise<any>;
  enrollTotp: (secret: any, otpCode: string) => Promise<void>;
  resolveTotpSignIn: (resolver: any, otpCode: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Prevent protected routes from evaluating before claims and profile are loaded
        setLoading(true);
        setUser(user);
        
        // Securely check for admin custom claim
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin);

        // Listen to user profile from Firestore in real-time
        const docRef = doc(db, "profiles", user.uid);
        profileUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
          setLoading(false); // Finish loading after profile is fetched
        });
      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
        if (profileUnsubscribe) profileUnsubscribe();
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const ensureWalletAndProfile = async (user: User, extra?: object) => {
    const docRef = doc(db, "profiles", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const newProfile = {
        user_id: user.uid,
        full_name: user.displayName || "User",
        email: user.email || "",
        kyc_status: "unverified",
        created_at: new Date().toISOString(),
        ...extra,
      };
      await setDoc(docRef, newProfile);
      await setDoc(doc(db, "wallets", user.uid), {
        user_id: user.uid,
        balance: 0,
        total_deposited: 0,
        total_withdrawn: 0,
        total_earned: 0,
      });
      setProfile(newProfile);
    } else {
      setProfile(docSnap.data());
    }
  };

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
    signUp: async (email: string, password: string, fullName: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;
      await updateProfile(u, { displayName: fullName });
      await ensureWalletAndProfile(u, { full_name: fullName, auth_provider: "email" });
      return userCredential;
    },
    signInWithGoogle: async () => {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      const userCredential = await signInWithPopup(auth, provider);
      await ensureWalletAndProfile(userCredential.user, { auth_provider: "google" });
      return userCredential;
    },
    signOut: () => firebaseSignOut(auth),
    resetPassword: (email: string) => sendPasswordResetEmail(auth, email),
    sendVerificationEmail: async () => {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    },
    generateTotpSecret: async () => {
      if (!auth.currentUser) throw new Error("No user logged in");
      const session = await multiFactor(auth.currentUser).getSession();
      const secret = await TotpMultiFactorGenerator.generateSecret(session);
      return secret;
    },
    enrollTotp: async (secret: any, otpCode: string) => {
      if (!auth.currentUser) throw new Error("No user logged in");
      const assertion = TotpMultiFactorGenerator.assertionForEnrollment(secret, otpCode);
      await multiFactor(auth.currentUser).enroll(assertion, "Authenticator App");
    },
    resolveTotpSignIn: async (resolver: any, otpCode: string) => {
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(
        resolver.hints[0].uid,
        otpCode
      );
      return await resolver.resolveSignIn(assertion);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
