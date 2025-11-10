import { create } from "zustand"

export type CartItem = {
  id: string
  title: string
  price: number
  qty: number
  variant?: string
  image?: string
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  total: () => number
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  updateQty: (id, qty) =>
    set((s) => {
      if (qty <= 0) return { items: s.items.filter((i) => i.id !== id) }
      return { items: s.items.map((i) => (i.id === id ? { ...i, qty } : i)) }
    }),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}))

// client-side persistence
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("cart_v1")
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.items)) {
        useCart.setState({ items: parsed.items })
      }
    }
  } catch {}
  useCart.subscribe((state) => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify({ items: state.items }))
    } catch {}
  })
}
