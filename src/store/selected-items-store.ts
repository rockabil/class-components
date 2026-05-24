import { create } from 'zustand';

interface SelectedItemsStore {
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  unselectAll: () => void;
  setSelected: (ids: string[]) => void;
}

export const useSelectedItemsStore = create<SelectedItemsStore>((set) => ({
  selectedIds: [],
  toggleSelect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    })),
  unselectAll: () => set({ selectedIds: [] }),
  setSelected: (ids) => set({ selectedIds: ids }),
}));