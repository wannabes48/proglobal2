import { useState, useEffect, createContext, useContext } from "react";
import type { User } from "firebase/auth";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: typeof signInWithEmailAndPassword;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch user profile from Firestore
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signUp: async (email, password, fullName) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase profile
      await updateProfile(user, { displayName: fullName });
      
      // Create Firestore profile
      const newProfile = {
        user_id: user.uid,
        full_name: fullName,
        email: email,
        kyc_status: 'pending',
        created_at: new Date().toISOString(),
      };
      
      await setDoc(doc(db, "profiles", user.uid), newProfile);
      
      // Create initial wallet
      await setDoc(doc(db, "wallets", user.uid), {
        user_id: user.uid,
        balance: 0,
        total_deposited: 0,
        total_withdrawn: 0,
        total_earned: 0,
      });

      setProfile(newProfile);
      return userCredential;
    },
    signOut: () => firebaseSignOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
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
