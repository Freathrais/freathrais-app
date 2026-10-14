"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import type { TabId, StatusMsg } from "@/lib/types/profile";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import AccountTab from "@/components/profile/AccountTab";
import OrdersTab from "@/components/profile/OrdersTab";
import SecurityTab from "@/components/profile/SecurityTab";
import FavoritesTab from "@/components/profile/FavoritesTab";

export default function ProfilPage() {
  const { user, userData, loading, updateUserProfileData } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("account");

  // Account Info State
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [country, setCountry] = useState(userData?.country || "Türkiye");
  const [city, setCity] = useState(userData?.city || "");
  const [district, setDistrict] = useState(userData?.district || "");
  const [addressDetail, setAddressDetail] = useState(userData?.addressDetail || "");

  // Telefon Doğrulama Durumu — userData ve anlık doğrulama ile reaktif türetilir
  const [pendingVerifiedPhone, setPendingVerifiedPhone] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Gerçek doğrulama durumu: Firestore'daki kayıtlı numara ile eşleşiyorsa VEYA yeni doğrulandıysa
  const isPhoneVerified =
    (!!userData?.phoneVerified && userData?.phone === phone.trim()) ||
    pendingVerifiedPhone === phone.trim();

  const [isUploading, setIsUploading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<StatusMsg | null>(null);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordConfirm, setCurrentPasswordConfirm] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityStatus, setSecurityStatus] = useState<StatusMsg | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Firestore'dan userData yüklendiğinde form alanlarını senkronize et
  useEffect(() => {
    if (userData) {
      if (userData.displayName) setDisplayName(userData.displayName);
      else if (user?.displayName && !displayName) setDisplayName(user.displayName);
      if (userData.phone) setPhone(userData.phone);
      if (userData.country) setCountry(userData.country);
      if (userData.city) setCity(userData.city);
      if (userData.district) setDistrict(userData.district);
      if (userData.addressDetail) setAddressDetail(userData.addressDetail);
    } else if (user?.displayName && !displayName) {
      setDisplayName(user.displayName);
    }
  }, [userData, user]);

  const handleAccountSave = async () => {
    if (!user) return;
    setAccountStatus(null);

    if (!displayName.trim()) {
      setAccountStatus({ type: "error", msg: "Ad Soyad alanı zorunludur." });
      return;
    }

    if (!phone.trim()) {
      setAccountStatus({ type: "error", msg: "Telefon numarası alanı zorunludur." });
      return;
    }

    if (!isPhoneVerified) {
      setAccountStatus({ type: "error", msg: "Lütfen kaydetmeden önce telefon numaranızı doğrulayınız." });
      setIsVerificationModalOpen(true);
      return;
    }

    setIsUpdatingAccount(true);

    try {
      const cleanName = displayName.trim();
      const updates: any = {
        displayName: cleanName,
        phone: phone.trim(),
        phoneVerified: true,
        country: country || "Türkiye",
        city: city || "",
        district: district || "",
        addressDetail: addressDetail || "",
      };

      if (cleanName !== user.displayName) {
        await updateProfile(user, { displayName: cleanName });
      }

      await updateUserProfileData(updates);
      setAccountStatus({ type: "success", msg: "Hesap bilgileriniz başarıyla kaydedildi!" });
    } catch (error) {
      console.error("Bilgiler güncellenirken hata:", error);
      setAccountStatus({ type: "error", msg: "Bilgiler kaydedilirken bir hata oluştu." });
    } finally {
      setIsUpdatingAccount(false);
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

  return (
    <div className="min-h-screen pt-32 pb-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-black mb-4 tracking-tight" style={{ color: "var(--text)" }}>Profilim</h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1 p-8 rounded-3xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <AnimatePresence mode="wait">
              {activeTab === "account" && (
                <AccountTab
                  user={user}
                  userData={userData || {}}
                  displayName={displayName}
                  setDisplayName={setDisplayName}
                  phone={phone}
                  setPhone={setPhone}
                  country={country}
                  setCountry={setCountry}
                  city={city}
                  setCity={setCity}
                  district={district}
                  setDistrict={setDistrict}
                  addressDetail={addressDetail}
                  setAddressDetail={setAddressDetail}
                  isPhoneVerified={isPhoneVerified}
                  pendingVerifiedPhone={pendingVerifiedPhone}
                  setPendingVerifiedPhone={setPendingVerifiedPhone}
                  isVerificationModalOpen={isVerificationModalOpen}
                  setIsVerificationModalOpen={setIsVerificationModalOpen}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                  isUpdatingAccount={isUpdatingAccount}
                  setIsUpdatingAccount={setIsUpdatingAccount}
                  accountStatus={accountStatus}
                  setAccountStatus={setAccountStatus}
                  handleAccountSave={handleAccountSave}
                  updateUserProfileData={updateUserProfileData}
                />
              )}

              {activeTab === "orders" && <OrdersTab />}

              {activeTab === "security" && (
                <SecurityTab
                  user={user}
                  currentPassword={currentPassword}
                  setCurrentPassword={setCurrentPassword}
                  currentPasswordConfirm={currentPasswordConfirm}
                  setCurrentPasswordConfirm={setCurrentPasswordConfirm}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  securityStatus={securityStatus}
                  setSecurityStatus={setSecurityStatus}
                  isUpdatingPassword={isUpdatingPassword}
                  setIsUpdatingPassword={setIsUpdatingPassword}
                />
              )}

              {activeTab === "favorites" && (
                <FavoritesTab favorites={userData?.favorites} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
