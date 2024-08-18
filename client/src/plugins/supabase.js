import { supabase } from "@/supabase";
import { authStore } from "@/store/authStore";
import router from "../router";

// Initialize the session
supabase.auth.getSession().then(({ data: { session } }) => {
  authStore.setSession(session);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  const currentSession = authStore.session; // Access the session directly

  if (
    (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
    currentSession?.user?.id !== session?.user?.id
  ) {
    authStore.setSession(session);
    const userData = session.user;
    localStorage.setItem("user", JSON.stringify(userData));
    router.push("/dashboard");
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
