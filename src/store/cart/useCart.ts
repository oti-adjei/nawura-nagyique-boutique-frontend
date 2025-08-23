'use client';

import { DisplayProduct } from '@/types/product';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem extends DisplayProduct {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  variantSku?: string;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (item: CartItem) => {
                // const quantity = item.quantity ?? 1; 

                const existingItem = get().items.find(
                    (i) => 
                      i.id === item.id && 
                      i.selectedSize === item.selectedSize &&
                      i.selectedColor === item.selectedColor
                );

                if (existingItem) {
                    set({
                        items: get().items.map((i) =>
                            i.id === item.id && 
                            i.selectedSize === item.selectedSize &&
                            i.selectedColor === item.selectedColor
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
            },

            removeFromCart: (id: number) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },
            increaseQty: (id) =>
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                }),

            decreaseQty: (id) =>
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
                    ),
                }),

            updateQuantity: (id: number, quantity: number) => {
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotal: () =>
                get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

            getItemCount: () =>
                get().items.reduce((count, item) => count + item.quantity, 0),

        }),
        {
            name: 'cart-store', // LocalStorage key
        }
    )
);
