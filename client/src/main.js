import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import { createClient } from "@supabase/supabase-js";
import "./scss/main.scss"
import supabasePlugin from './plugins/supabase'
import { loadFonts } from './plugins/webfontloader'

loadFonts();

const app = createApp(App);
app.config.productionTip = false
app.config.silent = true
app.use(router);
app.use(vuetify);
app.use(supabasePlugin);
app.use(store);
app.mount("#app");