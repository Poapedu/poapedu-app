import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/views/LandingPage.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import EditProfile from "@/views/EditProfile.vue";
import SignInPage from "@/views/SignInPage.vue";
import MintNFT from "@/views/MintNFT.vue";
import PublicProfile from "@/views/PublicProfile.vue";
import NotFound from "@/views/NotFound.vue"
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

  const {
    data: { session },
  } = await supabase.auth.getSession();
  //console.log(`Router beforeEach - Session exists: ${!!session}`);
  
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  //console.log(`Route requires auth: ${requiresAuth}`);

  // Check if the route is a public profile route
  if (to.name === 'PublicProfile') {
    //console.log('Accessing public profile, allowing without auth');
    next();
  } else if (requiresAuth && !session) {
    //console.log('Auth required but no session, redirecting to home');
    next("/");
  } else if (to.path === "/" && session) {
    //console.log('Home accessed with session, redirecting to dashboard');
    next("/dashboard");
  } else {
    //console.log('Proceeding to requested route');
    next();
  }
});

export default router;