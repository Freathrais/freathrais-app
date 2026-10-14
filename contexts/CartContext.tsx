"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Product, products } from "@/lib/data/products";

const STORAGE_KEY = "freathrais-cart";
const MAX_QTY = 10;

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoredItem {
  id: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  savings: number;
  isOpen: boolean;
  lastAddedId: number | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  // localStorage'dan sepeti yükle
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredItem[];
        if (Array.isArray(parsed)) {
          setStored(
            parsed.filter(
              (i) =>
                typeof i?.id === "number" &&
                typeof i?.quantity === "number" &&
                i.quantity > 0
            )
          );
        }
      }
    } catch {
      /* bozuk veri yok sayılır */
    }
    setHydrated(true);
  }, []);

  // Sepet değişince kaydet
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* depolama dolu / kapalı */
    }
  }, [stored, hydrated]);

  // Diğer sekmelerle senkron tut
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        setStored(e.newValue ? (JSON.parse(e.newValue) as StoredItem[]) : []);
      } catch {
        /* yok say */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ESC ile kapat + açıkken sayfa kaydırmayı kilitle
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const items = useMemo<CartItem[]>(
    () =>
      stored
        .map((s) => {
          const product = products.find((p) => p.id === s.id);
          return product
            ? { product, quantity: Math.min(s.quantity, MAX_QTY) }
            : null;
        })
        .filter((i): i is CartItem => i !== null),
    [stored]
  );

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce(
    (n, i) => n + (i.product.discountPrice ?? i.product.price) * i.quantity,
    0
  );
  const savings = items.reduce(
    (n, i) =>
      n +
      (i.product.discountPrice
        ? (i.product.price - i.product.discountPrice) * i.quantity
        : 0),
    0
  );

  const addItem = useCallback((product: Product, quantity = 1) => {
    setStored((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QTY) }
            : i
        );
      }
      return [...prev, { id: product.id, quantity: Math.min(quantity, MAX_QTY) }];
    });
    setLastAddedId(product.id);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: number) => {
    setStored((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setStored((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== productId)
        : prev.map((i) =>
            i.id === productId ? { ...i, quantity: Math.min(quantity, MAX_QTY) } : i
          )
    );
  }, []);

  const clearCart = useCallback(() => setStored([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        savings,
        isOpen,
        lastAddedId,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export { MAX_QTY };
