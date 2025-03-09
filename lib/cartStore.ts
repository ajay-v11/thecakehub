// lib/cartStore.ts
import {create} from 'zustand';
import {persist} from 'zustand/middleware'; // Import persist middleware
import {Product} from '@/lib/types';

type CartItem = Product & {quantity: number};

type CartState = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      // Add a product to the cart
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );
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

      // Remove a product from the cart
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      // Update the quantity of a product in the cart
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === productId && quantity > 0 ? {...item, quantity} : item
            )
            .filter((item) => item.quantity > 0), // Remove items with quantity <= 0
        })),

      // Clear the entire cart
      clearCart: () => set({items: []}),
    }),
    {
      name: 'cart-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
