import { create } from "zustand"
import type { SmartBasket, BasketItem, Product, SecurityEvent, User } from "@/types"

interface BasketStore {
  currentBasket: SmartBasket | null
  user: User | null
  securityEvents: SecurityEvent[]
  isConnected: boolean

  // Actions
  setCurrentBasket: (basket: SmartBasket) => void
  addItem: (product: Product, method: "barcode" | "rfid" | "weight" | "manual") => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearBasket: () => void
  setUser: (user: User) => void
  addSecurityEvent: (event: SecurityEvent) => void
  setConnectionStatus: (status: boolean) => void
}

export const useBasketStore = create<BasketStore>((set, get) => ({
  currentBasket: null,
  user: null,
  securityEvents: [],
  isConnected: false,

  setCurrentBasket: (basket) => set({ currentBasket: basket }),

  addItem: (product, method) => {
    const { currentBasket } = get()
    if (!currentBasket) return

    const existingItem = currentBasket.items.find((item) => item.product.id === product.id)

    if (existingItem) {
      // Update quantity
      const updatedItems = currentBasket.items.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      )

      const updatedBasket = {
        ...currentBasket,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        updatedAt: new Date(),
      }

      set({ currentBasket: updatedBasket })
    } else {
      // Add new item
      const newItem: BasketItem = {
        id: `item_${Date.now()}`,
        product,
        quantity: 1,
        addedAt: new Date(),
        scannedMethod: method,
      }

      const updatedItems = [...currentBasket.items, newItem]
      const updatedBasket = {
        ...currentBasket,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        updatedAt: new Date(),
      }

      set({ currentBasket: updatedBasket })
    }
  },

  removeItem: (itemId) => {
    const { currentBasket } = get()
    if (!currentBasket) return

    const updatedItems = currentBasket.items.filter((item) => item.id !== itemId)
    const updatedBasket = {
      ...currentBasket,
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      updatedAt: new Date(),
    }

    set({ currentBasket: updatedBasket })
  },

  updateQuantity: (itemId, quantity) => {
    const { currentBasket } = get()
    if (!currentBasket) return

    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }

    const updatedItems = currentBasket.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))

    const updatedBasket = {
      ...currentBasket,
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      updatedAt: new Date(),
    }

    set({ currentBasket: updatedBasket })
  },

  clearBasket: () => {
    const { currentBasket } = get()
    if (!currentBasket) return

    const updatedBasket = {
      ...currentBasket,
      items: [],
      totalAmount: 0,
      updatedAt: new Date(),
    }

    set({ currentBasket: updatedBasket })
  },

  setUser: (user) => set({ user }),
  addSecurityEvent: (event) =>
    set((state) => ({
      securityEvents: [...state.securityEvents, event],
    })),
  setConnectionStatus: (status) => set({ isConnected: status }),
}))
