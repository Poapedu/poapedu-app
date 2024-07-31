import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
//import { loadFonts } from "./plugins/webfontloader";
import { createClient } from "@supabase/supabase-js";

//loadFonts();

const supabase = createClient(
  process.env.VUE_APP_SUPABASE_URL,
  process.env.VUE_APP_SUPABASE_ANON_KEY
);

router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = !!session;

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next({ name: "SignIn" });
  } else {
    next();
  }
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(store);
app.mount("#app");
