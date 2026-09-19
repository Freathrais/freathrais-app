"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, Shield, Mail, Lock, Camera, CheckCircle2, AlertCircle, Save, Heart, ShoppingBag, Package, Truck, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { products } from "@/lib/data/products";
import { countries, turkeyCities } from "@/lib/data/locations";
import ProductCard from "@/components/ProductCard";

export default function ProfilPage() {
  const { user, userData, loading, toggleFavorite } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"account" | "security" | "favorites" | "orders">("account");
  
  // Account Info State
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [username, setUsername] = useState(userData?.username || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [country, setCountry] = useState(userData?.country || "Türkiye");
  const [city, setCity] = useState(userData?.city || "");
  const [district, setDistrict] = useState(userData?.district || "");
  const [addressDetail, setAddressDetail] = useState(userData?.addressDetail || "");
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [accountStatus, setAccountStatus] = useState<{ type: "success" | "error", msg: string } | null>(null);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityStatus, setSecurityStatus] = useState<{ type: "success" | "error", msg: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Orders State
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Mock Orders Data
  const mockOrders = [
    {
      id: "ORD-2026-9482",
      date: "15 Eyl 2026",
      total: "2.450 ₺",
      status: "Kargoya Verildi",
      statusColor: "var(--primary)",
      items: [
        { name: "Premium Siyah Hoodie", qty: 1, price: "1.250 ₺", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200" },
        { name: "Basic Beyaz Tişört", qty: 2, price: "600 ₺", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200" }
      ],
      shipping: {
        company: "Yurtiçi Kargo",
        trackingNumber: "482910482910",
        address: "Örnek Mah. Test Sok. No:1 D:2 Kadıköy/İstanbul",
        estimatedDelivery: "18 Eyl 2026",
        steps: [
          { label: "Sipariş Alındı", date: "15 Eyl 14:30", completed: true },
          { label: "Hazırlanıyor", date: "16 Eyl 09:15", completed: true },
          { label: "Kargoya Verildi", date: "16 Eyl 16:45", completed: true },
          { label: "Teslim Edildi", date: "", completed: false }
        ]
      }
    },
    {
      id: "ORD-2026-8173",
      date: "28 Ağu 2026",
      total: "850 ₺",
      status: "Teslim Edildi",
      statusColor: "var(--success)",
      items: [
        { name: "Yazlık Şapka", qty: 1, price: "850 ₺", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=200" }
      ],
      shipping: {
        company: "Aras Kargo",
        trackingNumber: "918273645102",
        address: "Örnek Mah. Test Sok. No:1 D:2 Kadıköy/İstanbul",
        estimatedDelivery: "30 Ağu 2026",
        steps: [
          { label: "Sipariş Alındı", date: "28 Ağu 10:10", completed: true },
          { label: "Hazırlanıyor", date: "28 Ağu 14:20", completed: true },
          { label: "Kargoya Verildi", date: "29 Ağu 09:00", completed: true },
          { label: "Teslim Edildi", date: "30 Ağu 13:45", completed: true }
        ]
      }
    }
  ];

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
      if (phone !== userData?.phone) updates.phone = phone;
      if (country !== userData?.country) updates.country = country;
      if (city !== userData?.city) updates.city = city;
      if (district !== userData?.district) updates.district = district;
      if (addressDetail !== userData?.addressDetail) updates.addressDetail = addressDetail;

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
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${activeTab === "orders" ? "scale-[1.02]" : "hover:scale-[1.02] opacity-70 hover:opacity-100"}`}
              style={{
                background: activeTab === "orders" ? "var(--surface)" : "transparent",
                border: activeTab === "orders" ? "1px solid var(--border)" : "1px solid transparent",
                color: activeTab === "orders" ? "var(--text)" : "var(--text-muted)",
              }}
            >
              <ShoppingBag size={18} style={{ color: activeTab === "orders" ? "var(--accent)" : "inherit" }} />
              Siparişlerim
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
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Ad Soyad <span style={{ color: "var(--danger)" }}>*</span></label>
                      <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
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
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Telefon Numarası <span style={{ color: "var(--danger)" }}>*</span></label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                        placeholder="0555 555 55 55"
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Ülke</label>
                        <select value={country} onChange={(e) => { setCountry(e.target.value); setCity(""); setDistrict(""); }}
                          className="w-full px-4 py-3 rounded-xl text-sm appearance-none bg-no-repeat"
                          style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: "right 1rem center", backgroundSize: "1.25rem", backgroundRepeat: "no-repeat", backgroundColor: "var(--bg)" }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}>
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      
                      {country === "Türkiye" && (
                        <>
                          <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>İl</label>
                            <select value={city} onChange={(e) => { setCity(e.target.value); setDistrict(""); }}
                              className="w-full px-4 py-3 rounded-xl text-sm appearance-none bg-no-repeat"
                              style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: "right 1rem center", backgroundSize: "1.25rem", backgroundRepeat: "no-repeat", backgroundColor: "var(--bg)" }}
                              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}>
                              <option value="">Seçiniz</option>
                              {Object.keys(turkeyCities).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>İlçe</label>
                            <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!city}
                              className="w-full px-4 py-3 rounded-xl text-sm appearance-none bg-no-repeat disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: "right 1rem center", backgroundSize: "1.25rem", backgroundRepeat: "no-repeat", backgroundColor: "var(--bg)" }}
                              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}>
                              <option value="">Seçiniz</option>
                              {city && turkeyCities[city]?.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Adres Tarifi</label>
                      <textarea value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} rows={3}
                        placeholder="Mahalle, Sokak, Bina No, Kapı No vb."
                        className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
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
                      disabled={
                        isUpdatingAccount || 
                        !phone || // zorunlu alan
                        !displayName || // zorunlu alan
                        (
                          displayName === user.displayName && 
                          username === userData?.username &&
                          phone === userData?.phone &&
                          country === userData?.country &&
                          city === userData?.city &&
                          district === userData?.district &&
                          addressDetail === userData?.addressDetail
                        )
                      }
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
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Siparişlerim</h2>
                  
                  {mockOrders.length === 0 ? (
                    <div className="text-center py-16" style={{ background: "var(--bg)", borderRadius: "1rem", border: "1px dashed var(--border)" }}>
                      <Package size={48} className="mx-auto mb-4 opacity-20" style={{ color: "var(--text)" }} />
                      <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Henüz siparişiniz yok</h3>
                      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Mağazamızdaki ürünleri inceleyip ilk siparişinizi oluşturabilirsiniz.</p>
                      <button onClick={() => router.push("/magaza")} 
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: "var(--primary)", color: "var(--primary-fg)" }}>
                        Alışverişe Başla
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="rounded-2xl overflow-hidden transition-all duration-300" style={{ border: "1px solid var(--border)", background: "var(--bg)" }}>
                          <div 
                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          >
                            <div className="flex-1 flex flex-wrap items-center gap-x-8 gap-y-2">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Sipariş No</p>
                                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{order.id}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Tarih</p>
                                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{order.date}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Tutar</p>
                                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{order.total}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                              <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${order.statusColor}15`, color: order.statusColor }}>
                                {order.status}
                              </div>
                              <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ background: "var(--surface)", color: "var(--text)" }}>
                                {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedOrder === order.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-5 border-t" style={{ borderColor: "var(--border)" }}>
                                  
                                  {/* Items */}
                                  <div className="mb-8">
                                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
                                      <Package size={16} style={{ color: "var(--accent)" }} />
                                      Sipariş Özeti
                                    </h4>
                                    <div className="space-y-4">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                                          <div className="flex-1">
                                            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{item.name}</p>
                                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{item.qty} Adet</p>
                                          </div>
                                          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{item.price}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Shipping Details */}
                                  <div>
                                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
                                      <Truck size={16} style={{ color: "var(--accent)" }} />
                                      Kargo Durumu
                                    </h4>
                                    
                                    <div className="p-4 rounded-xl mb-6 flex flex-col sm:flex-row gap-4 justify-between" style={{ background: "var(--surface)" }}>
                                      <div>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Kargo Firması</p>
                                        <p className="text-sm font-bold mt-0.5" style={{ color: "var(--text)" }}>{order.shipping.company}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Takip Numarası</p>
                                        <p className="text-sm font-bold mt-0.5" style={{ color: "var(--text)" }}>{order.shipping.trackingNumber}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tahmini Teslimat</p>
                                        <p className="text-sm font-bold mt-0.5" style={{ color: "var(--text)" }}>{order.shipping.estimatedDelivery}</p>
                                      </div>
                                    </div>

                                    {/* Tracking Steps */}
                                    <div className="relative pl-4 space-y-6">
                                      <div className="absolute left-[1.125rem] top-2 bottom-2 w-0.5" style={{ background: "var(--border)" }} />
                                      {order.shipping.steps.map((step, idx) => (
                                        <div key={idx} className="relative flex items-center gap-4">
                                          <div 
                                            className="w-5 h-5 rounded-full border-[3px] flex-shrink-0 z-10"
                                            style={{ 
                                              borderColor: "var(--surface)",
                                              background: step.completed ? "var(--accent)" : "var(--border)"
                                            }}
                                          />
                                          <div>
                                            <p className={`text-sm font-bold ${step.completed ? '' : 'opacity-50'}`} style={{ color: "var(--text)" }}>{step.label}</p>
                                            {step.date && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{step.date}</p>}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
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
