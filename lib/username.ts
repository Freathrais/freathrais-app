export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

const RESERVED = new Set([
  "admin",
  "administrator",
  "root",
  "system",
  "moderator",
  "mod",
  "support",
  "destek",
  "freathrais",
  "yonetici",
  "yonetim",
  "null",
  "undefined",
]);

/** Benzersizlik kontrolü için büyük/küçük harf duyarsız anahtar */
export const normalizeUsername = (username: string) => username.trim().toLowerCase();

/** Geçerliyse null, değilse hata mesajı döner */
export function validateUsername(raw: string): string | null {
  const username = raw.trim();
  if (username.length < USERNAME_MIN) return `En az ${USERNAME_MIN} karakter olmalı.`;
  if (username.length > USERNAME_MAX) return `En fazla ${USERNAME_MAX} karakter olabilir.`;
  if (!USERNAME_REGEX.test(username))
    return "Yalnızca harf (a-z), rakam ve alt çizgi (_) kullanılabilir.";
  if (RESERVED.has(normalizeUsername(username))) return "Bu kullanıcı adı kullanılamaz.";
  return null;
}
