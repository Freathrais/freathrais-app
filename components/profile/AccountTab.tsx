"use client";
import { useRef } from "react";
import { User, Camera, Mail, CheckCircle2, AlertCircle, Save, Phone } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import { db, storage } from "@/lib/firebase/config";
import { countries, turkeyCities } from "@/lib/data/locations";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";
import { inputStyle, selectStyle, type StatusMsg } from "@/lib/types/profile";
import type { User as FirebaseUser } from "firebase/auth";

interface Props {
  user: FirebaseUser;
  userData: Record<string, any>;
  // form state (lifted to parent for cross-tab access)
  displayName: string; setDisplayName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  city: string; setCity: (v: string) => void;
  district: string; setDistrict: (v: string) => void;
  addressDetail: string; setAddressDetail: (v: string) => void;
  isPhoneVerified: boolean;
  pendingVerifiedPhone: string | null;
  setPendingVerifiedPhone: (v: string | null) => void;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (v: boolean) => void;
  isUploading: boolean; setIsUploading: (v: boolean) => void;
  isUpdatingAccount: boolean; setIsUpdatingAccount: (v: boolean) => void;
  accountStatus: StatusMsg | null; setAccountStatus: (v: StatusMsg | null) => void;
  handleAccountSave: () => void;
  updateUserProfileData: (updates: Record<string, any>) => Promise<void>;
}

export default function AccountTab({
  user, userData,
  displayName, setDisplayName,
  phone, setPhone,
  country, setCountry,
  city, setCity,
  district, setDistrict,
  addressDetail, setAddressDetail,
  isPhoneVerified,
  pendingVerifiedPhone, setPendingVerifiedPhone,
  isVerificationModalOpen, setIsVerificationModalOpen,
  isUploading, setIsUploading,
  isUpdatingAccount,
  accountStatus, setAccountStatus,
  handleAccountSave,
  updateUserProfileData,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getMaskedEmail = (email: string | null) => {
    if (!email) return "Bilinmiyor";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
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
    } catch {
      setAccountStatus({ type: "error", msg: "Fotoğraf yüklenirken bir hata oluştu." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartVerification = () => {
    const cleanPhone = phone.trim().replace(/\s/g, "");
    if (cleanPhone.length < 10) {
      setAccountStatus({ type: "error", msg: "Lütfen en az 10 haneli geçerli bir telefon numarası giriniz." });
      return;
    }
    setAccountStatus(null);
    setIsVerificationModalOpen(true);
  };

  const handleVerificationSuccess = async () => {
    setPendingVerifiedPhone(phone.trim());
    setIsVerificationModalOpen(false);
    if (user) {
      try {
        await updateUserProfileData({ phone: phone.trim(), phoneVerified: true });
        setAccountStatus({ type: "success", msg: "Telefon numaranız başarıyla doğrulandı ve kaydedildi!" });
      } catch {
        setAccountStatus({ type: "error", msg: "Doğrulama başarılı ancak kaydedilemedi. Lütfen tekrar deneyin." });
        setPendingVerifiedPhone(null);
      }
    }
  };

  return (
    <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Hesap Bilgileri</h2>

      {accountStatus && (
        <div className="flex items-center gap-2 p-4 rounded-xl text-sm mb-6"
          style={{
            background: accountStatus.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: accountStatus.type === "success" ? "var(--success)" : "var(--danger)",
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
        {/* Ad Soyad */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Ad Soyad <span style={{ color: "var(--danger)" }}>*</span></label>
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl text-sm" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
        </div>

        {/* Kullanıcı Adı (readonly) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Kullanıcı Adı</label>
            {userData?.username && <span className="text-xs" style={{ color: "var(--success)" }}>Belirlendi</span>}
          </div>
          <input type="text" value={userData?.username || ""} readOnly disabled
            placeholder="Kullanıcı adı oluşturuluyor..."
            className="w-full px-4 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={inputStyle} />
          <p className="text-xs mt-1.5" style={{ color: "var(--text-subtle)" }}>Kullanıcı adı size özeldir ve değiştirilemez.</p>
        </div>

        {/* Telefon */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              Telefon Numarası <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            {isPhoneVerified ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(34,197,94,0.15)", color: "var(--success)" }}>
                <CheckCircle2 size={12} /> Doğrulandı
              </span>
            ) : phone.trim().length >= 10 ? (
              <button type="button" onClick={handleStartVerification}
                className="text-xs px-2.5 py-0.5 rounded-lg font-bold transition-all hover:scale-105"
                style={{ background: "var(--accent)", color: "#fff" }}>
                Doğrula
              </button>
            ) : (
              <span className="text-xs" style={{ color: "var(--warning)" }}>* Doğrulama zorunlu</span>
            )}
          </div>
          <div className="relative">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
              placeholder="0555 555 55 55"
              className="w-full px-4 py-3 rounded-xl text-sm" style={{ ...inputStyle, borderColor: isPhoneVerified ? "var(--success)" : undefined }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = isPhoneVerified ? "var(--success)" : "var(--border)")} />
            {!isPhoneVerified && phone.trim().length >= 10 && (
              <button type="button" onClick={handleStartVerification}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                style={{ background: "var(--primary)", color: "var(--primary-fg)" }}>
                Kodu Gönder
              </button>
            )}
          </div>
          <p className="text-xs mt-1.5" style={{ color: isPhoneVerified ? "var(--success)" : "var(--text-subtle)" }}>
            {isPhoneVerified ? "✓ Telefon numaranız başarıyla onaylanmıştır." : "Telefon numaranızı kaydetmek için doğrulama kodunu alıp onaylamanız gerekir."}
          </p>
        </div>

        {/* Ülke / İl / İlçe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Ülke</label>
            <select value={country} onChange={(e) => { setCountry(e.target.value); setCity(""); setDistrict(""); }}
              className="w-full px-4 py-3 rounded-xl text-sm appearance-none bg-no-repeat"
              style={selectStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {country === "Türkiye" && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>İl</label>
                <select value={city} onChange={(e) => { setCity(e.target.value); setDistrict(""); }}
                  className="w-full px-4 py-3 rounded-xl text-sm appearance-none bg-no-repeat"
                  style={selectStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}>
                  <option value="">Seçiniz</option>
                  {Object.keys(turkeyCities).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>İlçe</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!city}
                  className="w-full px-4 py-3 rounded-xl text-sm appearance-none bg-no-repeat disabled:opacity-50 disabled:cursor-not-allowed"
                  style={selectStyle}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}>
                  <option value="">Seçiniz</option>
                  {city && turkeyCities[city]?.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Adres Tarifi */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Adres Tarifi</label>
          <textarea value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} rows={3}
            placeholder="Mahalle, Sokak, Bina No, Kapı No vb."
            className="w-full px-4 py-3 rounded-xl text-sm resize-none"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
        </div>

        {/* E-posta */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>E-posta Adresi</label>
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(34,197,94,0.15)", color: "var(--success)" }}>
                <CheckCircle2 size={12} /> Doğrulandı
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.15)", color: "#b45309" }}>
                Doğrulanmadı
              </span>
            )}
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
            <input type="text" value={getMaskedEmail(user.email)} disabled
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm opacity-60 cursor-not-allowed"
              style={inputStyle} />
          </div>
          <p className="text-xs mt-1.5" style={{ color: "var(--text-subtle)" }}>* E-posta adresi güvenlik sebebiyle değiştirilemez.</p>
        </div>

        <button onClick={handleAccountSave}
          disabled={isUpdatingAccount || !phone.trim() || !displayName.trim()}
          className="w-full sm:w-auto mt-4 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 20px var(--glow)" }}>
          {isUpdatingAccount ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Save size={16} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <PhoneVerificationModal
        isOpen={isVerificationModalOpen}
        phone={phone}
        onSuccess={handleVerificationSuccess}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </motion.div>
  );
}
