import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/views/LandingPage.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import EditProfile from "@/views/EditProfile.vue";
import SignInPage from "@/views/SignInPage.vue";
import MintNFT from "@/views/MintNFT.vue";
import PublicProfile from "@/views/PublicProfile.vue";
import NotFound from "@/views/NotFound.vue";
import OCIDCallback from '@/components/OCIDCallback.vue';
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
    path: "/profile/:slug",
    name: "PublicProfile",
    component: PublicProfile,
  },
  {
    path: '/redirect',
    component: OCIDCallback
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
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  //console.log(`Router beforeEach - Navigating from: ${from.path} to: ${to.path}`);
  const { title } = to.meta;
  const defaultTitle = "poapedu | the only builder's profile you need";

  document.title = title || defaultTitle;

  const { data: { session } } = await supabase.auth.getSession();
  const ocidAuth = localStorage.getItem('ocid_auth');
  
  const isAuthenticated = !!session || !!ocidAuth;
  
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (to.name === 'PublicProfile') {
    next();
  } else if (requiresAuth && !isAuthenticated) {
    next("/signin");
  } else if (to.path === "/" && isAuthenticated) {
    next("/dashboard");
  } else if (to.path === "/signin" && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;