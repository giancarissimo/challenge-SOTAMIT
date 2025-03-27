import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  birthdate: Date;
  dni: string;
  work_area: string;
  description: string;
  is_developer: boolean;
  role: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage',
    }
  )
);
