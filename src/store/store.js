import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authService } from "../services/Authservice";

const ideaStore = create(
  persist(
    (set, get) => ({
      idea: null,
      user: null,
      isLoggedIn: false,
      isLoading: true,
      totalIdeas: 0,

      initialize: async () => {
        try {
          const { user: userData, error } = await authService.getCurrentUser();

          if (userData && !error) {
            set({ isLoggedIn: true, isLoading: false });
            await get().fetchUser(userData);
          } else {
            set({ isLoggedIn: false, isLoading: false, user: null });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ isLoggedIn: false, isLoading: false, user: null });
        }
      },

      fetchUser: async (authUser) => {
        if (!authUser) {
          console.error("fetchUser called without authUser");
          return;
        }

        const { id: user_id, email, created_at } = authUser;

        try {
          const { user: profileData, error: profileError } =
            await authService.getUser(user_id);
          if (profileError) {
            console.log("Error fetching additional user data:", profileError);
            return;
          }

          set({
            user: {
              user_id,
              email,
              created_at,
              ...profileData,
            },
          });
        } catch (error) {
          console.error("Error in fetchUser:", error);
        }
      },

      updateUser: (updatedData) =>
        set((state) => ({
          user: { ...state.user, ...updatedData },
        })),

      setLoggedIn: (bool) => set({ isLoggedIn: bool }),
      logout: () => set({ isLoggedIn: false, user: null, idea: null }),
      setLoading: (bool) => set({ isLoading: bool }),
      setTotalIdeas: (num) => set({ totalIdeas: num }),

      add: (data) => set({ idea: data }),
      clearIdea: () => set({ idea: null }),

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          idea: null,
        }),
    }),
    {
      name: "idea-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        idea: state.idea,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        totalIdeas: state.totalIdeas,
      }),
    }
  )
);

export default ideaStore;
