import { create } from "zustand";

type Toast = {
  id: number;
  category: "global" | "register" | "login" | "logout" | "removeUserById";
  status: "success" | "error" | "info";
  message: string;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (category:Toast["category"], status: Toast["status"], message: string) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (category, status, message) => {
    const id = Date.now(); // Id único
    set((state) => ({ toasts: [...state.toasts, { id, category, status, message }] }));

    // Automáticamente se elimina el Toast después de 4 segundos
    setTimeout(() =>
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
      5000
    );
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));
