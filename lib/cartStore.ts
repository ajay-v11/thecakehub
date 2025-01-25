// lib/cartStore.ts
import {create} from 'zustand';
import {Product} from '@/lib/types';

type CartItem = Product & {quantity: number};

type CartState = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? {...item, quantity: item.quantity + 1}
              : item
          ),
        };
      }
      return {items: [...state.items, {...product, quantity: 1}]};
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.id === productId && quantity > 0 ? {...item, quantity} : item
        )
        .filter((item) => item.quantity > 0),
    })),

  clearCart: () => set({items: []}),
}));
