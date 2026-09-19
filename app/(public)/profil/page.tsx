"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, Shield, Mail, Lock, Camera, CheckCircle2, AlertCircle, Save, Heart
} from "lucide-react";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProfilPage() {
  const { user, userData, loading, toggleFavorite } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"account" | "security" | "favorites">("account");
  
  // Account Info State
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [username, setUsername] = useState(userData?.username || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [accountStatus, setAccountStatus] = useState<{ type: "success" | "error", msg: string } | null>(null);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityStatus, setSecurityStatus] = useState<{ type: "success" | "error", msg: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Mask Email
  const getMaskedEmail = (email: string | null) => {
    if (!email) return "Bilinmiyor";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !storage) return;

    if (file.size > 10 * 1024 * 1024) {
      setAccountStatus({ type: "error", msg: "Fotoğraf boyutu 10MB'tan küçük olmalıdır." });
      return;
    }

    setIsUploading(true);
    setAccountStatus(null);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await updateProfile(user, { photoURL: url });
      await updateDoc(doc(db, "users", user.uid), { photoURL: url });
      
      setAccountStatus({ type: "success", msg: "Profil fotoğrafı başarıyla güncellendi." });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setAccountStatus({ type: "error", msg: "Fotoğraf yüklenirken bir hata oluştu." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAccountSave = async () => {
    if (!user) return;
    setIsUpdatingAccount(true);
    setAccountStatus(null);
    
    try {
      const updates: any = {};
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
        updates.displayName = displayName;
      }
      
      if (username !== userData?.username && !userData?.username) {
        // Allow setting username only if it's currently empty
        updates.username = username;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, "users", user.uid), updates);
        setAccountStatus({ type: "success", msg: "Hesap bilgileri başarıyla güncellendi." });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setAccountStatus({ type: "success", msg: "Değişiklik yapılmadı." });
      }
    } catch (error) {
      setAccountStatus({ type: "error", msg: "Bilgiler güncellenirken bir hata oluştu." });
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    
    setIsUpdatingPassword(true);
    setSecurityStatus(null);

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      setSecurityStatus({ type: "success", msg: "Şifreniz başarıyla değiştirildi." });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setSecurityStatus({ type: "error", msg: "Mevcut şifreniz yanlış." });
      } else {
        setSecurityStatus({ type: "error", msg: "Şifre güncellenirken bir hata oluştu." });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24" style={{ background: "var(--bg)" }}>
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    router.push("/giris");
    return null;
  }

  const inputStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.2s"
  };

  return (
    <div className="min-h-screen pt-32 pb-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-black mb-4 tracking-tight" style={{ color: "var(--text)" }}>Profilim</h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-64 flex-shrink-0 space-y-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${activeTab === "account" ? "scale-[1.02]" : "hover:scale-[1.02] opacity-70 hover:opacity-100"}`}
              style={{
                background: activeTab === "account" ? "var(--surface)" : "transparent",
                border: activeTab === "account" ? "1px solid var(--border)" : "1px solid transparent",
                color: activeTab === "account" ? "var(--text)" : "var(--text-muted)",
              }}
            >
              <User size={18} style={{ color: activeTab === "account" ? "var(--accent)" : "inherit" }} />
              Hesap Bilgileri
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${activeTab === "security" ? "scale-[1.02]" : "hover:scale-[1.02] opacity-70 hover:opacity-100"}`}
              style={{
                background: activeTab === "security" ? "var(--surface)" : "transparent",
                border: activeTab === "security" ? "1px solid var(--border)" : "1px solid transparent",
                color: activeTab === "security" ? "var(--text)" : "var(--text-muted)",
              }}
            >
              <Shield size={18} style={{ color: activeTab === "security" ? "var(--accent)" : "inherit" }} />
              Güvenlik
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${activeTab === "favorites" ? "scale-[1.02]" : "hover:scale-[1.02] opacity-70 hover:opacity-100"}`}
              style={{
                background: activeTab === "favorites" ? "var(--surface)" : "transparent",
                border: activeTab === "favorites" ? "1px solid var(--border)" : "1px solid transparent",
                color: activeTab === "favorites" ? "var(--text)" : "var(--text-muted)",
              }}
            >
              <Heart size={18} style={{ color: activeTab === "favorites" ? "var(--accent)" : "inherit" }} />
              Favorilerim
            </button>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex-1 p-8 rounded-3xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <AnimatePresence mode="wait">
              {activeTab === "account" && (
                <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Hesap Bilgileri</h2>
                  
                  {accountStatus && (
                    <div className="flex items-center gap-2 p-4 rounded-xl text-sm mb-6"
                      style={{ 
                        background: accountStatus.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", 
                        color: accountStatus.type === "success" ? "var(--success)" : "var(--danger)" 
                      }}>
                      {accountStatus.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {accountStatus.msg}
                    </div>
                  )}

                  {/* Profile Picture */}
                  <div className="flex items-center gap-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User size={40} style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{ background: "var(--accent)", color: "white" }}
                      >
                        {isUploading ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Camera size={14} />}
                      </button>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>Profil Fotoğrafı</h3>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Ad Soyad</label>
                      <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Kullanıcı Adı</label>
                        {userData?.username && <span className="text-xs" style={{ color: "var(--success)" }}>Belirlendi</span>}
                      </div>
                      <input type="text" value={userData?.username ? userData.username : username} 
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={!!userData?.username}
                        placeholder={userData?.username ? "" : "Bir kereye mahsus oluşturabilirsiniz"}
                        className="w-full px-4 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                      {!userData?.username && (
                        <p className="text-xs mt-1.5" style={{ color: "var(--warning)" }}>* Kullanıcı adı oluşturulduktan sonra değiştirilemez.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>E-posta Adresi</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
                        <input type="text" value={getMaskedEmail(user.email)} disabled
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm opacity-60 cursor-not-allowed"
                          style={inputStyle} />
                      </div>
                      <p className="text-xs mt-1.5" style={{ color: "var(--text-subtle)" }}>* E-posta adresi güvenlik sebebiyle değiştirilemez.</p>
                    </div>

                    <button 
                      onClick={handleAccountSave}
                      disabled={isUpdatingAccount || (!displayName && !username) || (displayName === user.displayName && username === userData?.username)}
                      className="w-full sm:w-auto mt-4 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 20px var(--glow)" }}
                    >
                      {isUpdatingAccount ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Save size={16} />}
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Güvenlik</h2>
                  
                  {securityStatus && (
                    <div className="flex items-center gap-2 p-4 rounded-xl text-sm mb-6"
                      style={{ 
                        background: securityStatus.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", 
                        color: securityStatus.type === "success" ? "var(--success)" : "var(--danger)" 
                      }}>
                      {securityStatus.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {securityStatus.msg}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Mevcut Şifreniz</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Yeni Şifre</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8}
                          placeholder="En az 8 karakter"
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isUpdatingPassword || !currentPassword || !newPassword}
                      className="w-full sm:w-auto mt-4 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 20px var(--glow)" }}
                    >
                      {isUpdatingPassword ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Save size={16} />}
                      Şifreyi Güncelle
                    </button>
                  </form>
                </motion.div>
              )}
              {activeTab === "favorites" && (
                <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Favorilerim</h2>
                  
                  {(!userData?.favorites || userData.favorites.length === 0) ? (
                    <div className="text-center py-16" style={{ background: "var(--bg)", borderRadius: "1rem", border: "1px dashed var(--border)" }}>
                      <Heart size={48} className="mx-auto mb-4 opacity-20" style={{ color: "var(--text)" }} />
                      <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Henüz favoriniz yok</h3>
                      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Mağazadaki beğendiğiniz ürünleri favorilerinize ekleyebilirsiniz.</p>
                      <button onClick={() => router.push("/magaza")} 
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: "var(--primary)", color: "var(--primary-fg)" }}>
                        Mağazaya Git
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {products.filter(p => userData.favorites?.includes(p.id)).map(product => (
                        <div key={product.id}>
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
