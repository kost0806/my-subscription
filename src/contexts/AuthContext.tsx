"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const stored = sessionStorage.getItem("yt_access_token");
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
          accessToken: stored || "",
        });
      } else {
        setUser(null);
        sessionStorage.removeItem("yt_access_token");
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth();
    const result = await signInWithPopup(auth, googleProvider);
    const { GoogleAuthProvider } = await import("firebase/auth");
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || "";
    sessionStorage.setItem("yt_access_token", accessToken);

    setUser({
      uid: result.user.uid,
      displayName: result.user.displayName || "",
      email: result.user.email || "",
      photoURL: result.user.photoURL || "",
      accessToken,
    });
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    sessionStorage.removeItem("yt_access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
