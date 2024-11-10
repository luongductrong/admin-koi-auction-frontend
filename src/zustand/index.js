import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const unAuthenticatedUser = {
  id: null,
  role: '',
  username: '',
  fullname: '',
  isAuthenticated: false,
  token: null,
};

const userStore = create(
  persist(
    (set) => ({
      user: unAuthenticatedUser,

      login: (userData) => {
        set({
          user: {
            ...userData,
            isAuthenticated: true,
          },
        });
      },

      logout: () => {
        set({
          user: unAuthenticatedUser,
        });
      },
    }),
  ),
);

const themeStore = create((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}))

export default userStore;
export { themeStore };
