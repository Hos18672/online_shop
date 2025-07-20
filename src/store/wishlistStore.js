import { create } from 'zustand';

const useWishlistStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    // Prevent duplicate items
    if (state.items.some((i) => i.id === item.id)) return state;
    return { items: [...state.items, { id: item.id, name_en: item.name_en, price: item.price || 0 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  clearWishlist: () => set({ items: [] }),
}));

export default useWishlistStore;