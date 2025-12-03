import { create } from 'zustand';

interface CartItem {
  service_id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (service_id: string) => void;
  updateQuantity: (service_id: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  setCart: (items) => {
    set({ items });
    get().calculateTotal();
  },
  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find(i => i.service_id === item.service_id);
    if (existingItem) {
      existingItem.quantity += 1;
      set({ items: [...items] });
    } else {
      set({ items: [...items, item] });
    }
    get().calculateTotal();
  },
  removeItem: (service_id) => {
    set({ items: get().items.filter(i => i.service_id !== service_id) });
    get().calculateTotal();
  },
  updateQuantity: (service_id, quantity) => {
    const items = get().items;
    const item = items.find(i => i.service_id === service_id);
    if (item) {
      if (quantity <= 0) {
        get().removeItem(service_id);
      } else {
        item.quantity = quantity;
        set({ items: [...items] });
      }
    }
    get().calculateTotal();
  },
  clearCart: () => set({ items: [], total: 0 }),
  calculateTotal: () => {
    const total = get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    set({ total });
  },
}));
