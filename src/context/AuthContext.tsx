import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import {
  googleLoginApi,
  getMeApi,
  logoutApi,
  updateProfileApi,
} from "../api/auth.api";
import type { IUser } from "../types";

// ─── Context Shape ────────────────────────────────────────────────────────────
interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * On mount: attempt to restore session via httpOnly cookie.
   * If the cookie is valid, the backend returns the user profile.
   */
  useEffect(() => {
    getMeApi()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    // Listen for 401 events emitted by the axios interceptor
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  /**
   * Google sign-in flow:
   * 1. Firebase popup → get idToken
   * 2. Send idToken to backend → backend verifies + upserts user + sets cookie
   * 3. Store returned user in state
   */
  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const res = await googleLoginApi(idToken);
    setUser(res.data);
  }, []);

  /**
   * Logout:
   * 1. Call backend to clear httpOnly cookie
   * 2. Sign out of Firebase
   * 3. Clear local state
   */
  const logout = useCallback(async () => {
    await logoutApi();
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  /**
   * Update display name — syncs with backend and refreshes local state.
   */
  const updateProfile = useCallback(async (displayName: string) => {
    const res = await updateProfileApi(displayName);
    setUser(res.data);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;