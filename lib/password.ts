export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  { id: "length", label: "En az 8 karakter", test: (p) => p.length >= 8 },
  { id: "upper", label: "En az 1 büyük harf", test: (p) => /[A-ZÇĞİÖŞÜ]/.test(p) },
  { id: "digit", label: "En az 1 rakam", test: (p) => /[0-9]/.test(p) },
  {
    id: "punct",
    label: "En az 1 noktalama işareti (. , ! ? @ # vb.)",
    test: (p) => /[!-\/:-@\[-`{-~]/.test(p),
  },
];

export const isPasswordValid = (password: string) =>
  passwordRequirements.every((r) => r.test(password));
