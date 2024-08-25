import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/views/LandingPage.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import EditProfile from "@/views/EditProfile.vue";
import SignInPage from "@/views/SignInPage.vue";
import MintNFT from "@/views/MintNFT.vue";
import { supabase } from "@/supabase";

const routes = [
  {
    path: "/",
    name: "Home",
    component: LandingPage,
    meta: {
      title: "poapedu | if you got it, flaunt it",
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: UserDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: EditProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/mint-nft",
    name: "MintNFT",
    component: MintNFT,
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "Sign In",
    component: SignInPage,
  },
  {
    path: "/profile/:username",
    name: "PublicProfile",
    component: () => import("@/views/PublicProfile.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { title } = to.meta;
  const defaultTitle = "poapedu | the only builder's profile you need";

  document.title = title || defaultTitle;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !session) {
    next("/"); // Redirect to login if not authenticated
  } else {
    next();
  }
});

export default router;
