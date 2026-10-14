"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { normalizeUsername, validateUsername } from "@/lib/username";
import { isPasswordValid } from "@/lib/password";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "admin" | "editor" | "customer";
  themePreference?: string;
  username?: string | null;
  usernameLower?: string | null;
  favorites?: number[];
  phone?: string;
  country?: string;
  city?: string;
  district?: string;
  addressDetail?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  /** Giriş yapmış ama henüz kullanıcı adı oluşturmamış (zorunlu ekran gösterilir) */
  needsUsername: boolean;
  /** Hesap bu oturumda yeni oluşturulduysa true (iptal edilirse hesap silinir) */
  isFreshAccount: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  toggleFavorite: (productId: number) => Promise<void>;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
  claimUsername: (username: string) => Promise<void>;
  cancelRegistration: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Bu süre boyunca siteye hiç girilmezse oturum otomatik kapanır (her ziyarette yenilenir)
const INACTIVITY_LIMIT_MS = 14 * 24 * 60 * 60 * 1000;
const LAST_ACTIVE_KEY = "freathrais-last-active";
const ACTIVITY_REFRESH_MS = 60 * 1000;
// Bu süre içinde açılan hesaplar "yeni kayıt" sayılır
const FRESH_ACCOUNT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  // E-posta ile kayıt sürerken (kullanıcı adı henüz alınırken) zorunlu ekran gösterilmesin
  const [registering, setRegistering] = useState(false);
  const claimedUsernameRef = useRef<{ username: string; usernameLower: string } | null>(null);

  const ADMIN_UIDS = (process.env.NEXT_PUBLIC_ADMIN_UIDS || "").split(",").filter(Boolean);

  const createOrUpdateUserDoc = async (firebaseUser: User) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    const isAdmin = ADMIN_UIDS.includes(firebaseUser.uid);
    const role = isAdmin ? "admin" : (userSnap.exists() ? userSnap.data().role : "customer");

    if (!userSnap.exists()) {
      // merge: eş zamanlı kullanıcı adı alma işlemi varsa onu ezmesin
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }, { merge: true });
    } else {
      await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
    }

    const updatedSnap = await getDoc(userRef);
    const data = updatedSnap.data() as UserData;
    if (!data.username && claimedUsernameRef.current) {
      Object.assign(data, claimedUsernameRef.current);
    }
    setUserData(data);

    // Eski sistemde (benzersizlik kontrolü olmadan) alınmış ad varsa rezerve et
    if (data.username) {
      const nameRef = doc(db, "usernames", normalizeUsername(data.username));
      try {
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(nameRef);
          if (!snap.exists()) {
            tx.set(nameRef, {
              uid: firebaseUser.uid,
              username: data.username,
              createdAt: serverTimestamp(),
            });
          }
        });
      } catch {
        /* başkasına ait / yetkisiz: yok say */
      }
    }
  };

  /** Kullanıcı adı boşta mı? (herkese açık tek-belge okuma) */
  const checkUsernameAvailable = async (username: string) => {
    if (validateUsername(username)) return false;
    const snap = await getDoc(doc(db, "usernames", normalizeUsername(username)));
    return !snap.exists();
  };

  /**
   * Kullanıcı adını atomik olarak al: usernames/{ad} belgesi zaten varsa işlem iptal olur,
   * böylece bir ad yalnızca 1 kişiye verilir. Bir kez alındıktan sonra değiştirilemez.
   */
  const claimUsernameFor = async (firebaseUser: User, username: string) => {
    const invalid = validateUsername(username);
    if (invalid) throw new Error("username-invalid");
    const clean = username.trim();
    const lower = normalizeUsername(clean);
    const nameRef = doc(db, "usernames", lower);
    const userRef = doc(db, "users", firebaseUser.uid);

    await runTransaction(db, async (tx) => {
      const [nameSnap, userSnap] = await Promise.all([tx.get(nameRef), tx.get(userRef)]);
      if (nameSnap.exists()) throw new Error("username-taken");
      if (userSnap.exists() && userSnap.data().username) throw new Error("username-already-set");

      tx.set(nameRef, { uid: firebaseUser.uid, username: clean, createdAt: serverTimestamp() });
      if (userSnap.exists()) {
        tx.update(userRef, { username: clean, usernameLower: lower });
      } else {
        tx.set(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: "customer",
          username: clean,
          usernameLower: lower,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      }
    });

    claimedUsernameRef.current = { username: clean, usernameLower: lower };
    setUserData((prev) =>
      prev ? { ...prev, username: clean, usernameLower: lower } : prev
    );
  };

  const claimUsername = async (username: string) => {
    if (!user) throw new Error("not-authenticated");
    await claimUsernameFor(user, username);
  };

  const toggleFavorite = async (productId: number) => {
    if (!user || !userData) return;
    const userRef = doc(db, "users", user.uid);
    const currentFavorites = userData.favorites || [];
    const isFavorite = currentFavorites.includes(productId);
    
    const newFavorites = isFavorite
      ? currentFavorites.filter((id) => id !== productId)
      : [...currentFavorites, productId];

    await setDoc(userRef, { favorites: newFavorites }, { merge: true });
    setUserData({ ...userData, favorites: newFavorites });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Uzun süredir girilmediyse oturumu kapat
        try {
          const last = Number(localStorage.getItem(LAST_ACTIVE_KEY));
          if (last && Date.now() - last > INACTIVITY_LIMIT_MS) {
            localStorage.removeItem(LAST_ACTIVE_KEY);
            await signOut(auth);
            return;
          }
          localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
        } catch {
          /* localStorage erişilemezse süre kontrolü atlanır */
        }
      }
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await createOrUpdateUserDoc(firebaseUser);
        } catch (e) {
          console.error("Kullanici verisi okunamadi:", e);
        }
      } else {
        claimedUsernameRef.current = null;
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Oturum açıkken kullanıcı aktifse son aktiflik zamanını güncelle
  useEffect(() => {
    if (!user) return;
    const touch = () => {
      try {
        localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
      } catch {
        /* yok say */
      }
    };
    touch();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") touch();
    }, ACTIVITY_REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") touch();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    username: string
  ) => {
    const invalid = validateUsername(username);
    if (invalid) throw new Error("username-invalid");
    if (!isPasswordValid(password)) throw new Error("password-weak");
    // Hesap açmadan önce ad boşta mı diye bak
    if (!(await checkUsernameAvailable(username))) throw new Error("username-taken");

    setRegistering(true);
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await updateProfile(newUser, { displayName: name });
        await claimUsernameFor(newUser, username);
      } catch (err) {
        // Kullanıcı adı alınamadıysa (örn. aynı anda başkası aldı) kayıt tamamlanmasın
        try {
          await deleteDoc(doc(db, "users", newUser.uid));
        } catch {
          /* yok say */
        }
        try {
          await newUser.delete();
        } catch {
          await signOut(auth);
        }
        throw err;
      }
    } finally {
      setRegistering(false);
    }
  };

  /** Zorunlu kullanıcı adı ekranında vazgeçilirse: yeni hesap silinir, eski hesap çıkış yapar */
  const cancelRegistration = async () => {
    const current = auth.currentUser;
    if (!current) return;
    const created = current.metadata.creationTime ? Date.parse(current.metadata.creationTime) : 0;
    const fresh = created > 0 && Date.now() - created < FRESH_ACCOUNT_MS;
    if (fresh) {
      try {
        await deleteDoc(doc(db, "users", current.uid));
      } catch {
        /* yok say */
      }
      try {
        await current.delete();
      } catch {
        await signOut(auth);
      }
    } else {
      await signOut(auth);
    }
    setUserData(null);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const isAdmin = userData?.role === "admin";
  const isEditor = userData?.role === "admin" || userData?.role === "editor";
  const needsUsername = !!user && !loading && !registering && !!userData && !userData.username;
  const isFreshAccount = (() => {
    const t = user?.metadata.creationTime ? Date.parse(user.metadata.creationTime) : 0;
    return t > 0 && Date.now() - t < FRESH_ACCOUNT_MS;
  })();

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isAdmin,
        isEditor,
        needsUsername,
        isFreshAccount,
        signInWithGoogle,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        logout,
        resetPassword,
        toggleFavorite,
        checkUsernameAvailable,
        claimUsername,
        cancelRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
