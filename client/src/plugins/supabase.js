import { supabase } from "@/supabase";
import { authStore } from "@/store/authStore";
import router from "../router";
import { nextTick } from 'vue';

// Initialize the session
supabase.auth.getSession().then(({ data: { session } }) => {
  authStore.setSession(session);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  const currentSession = authStore.session;

  if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    if (currentSession?.user?.id !== session?.user?.id) {
      authStore.setSession(session);
      const userData = session.user;
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Use nextTick to ensure we're checking the route after navigation has completed
      nextTick(() => {
        const currentPath = router.currentRoute.value.path;
        
        if (!currentPath.startsWith('/profile/') && currentPath !== '/') {
          router.push("/dashboard");
        }
      });
    }
  } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
    authStore.clearSession();
    localStorage.removeItem("user");
    router.push("/signin");
  }
});

export default {
  install: (app) => {
    app.config.globalProperties.$supabase = supabase;
    app.provide("supabase", supabase);
  },
};