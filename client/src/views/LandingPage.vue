<template>
  <v-app>
    <v-app-bar app color="white" elevation="0">
      <v-img
        src="@/assets/poapedu_logo_black.svg"
        max-height="40"
        class="ml-0"
      ></v-img>
      <v-spacer></v-spacer>
      <v-btn text class="mr-2" @click="goToSignin">Login/Sign Up</v-btn>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container class="py-16 mt-4">
        <v-row>
          <v-col cols="12" md="6">
            <h1 class="text-h2 font-weight-bold mb-4">
              Flaunt what you've achieved
            </h1>
            <p class="text-body-1 mb-6">
              Consolidate all of your certs and NFT badges onto a single
              coherent builder's profile.
            </p>
            <v-btn color="black" dark x-large class="text-capitalize"
              >Get your profile</v-btn
            >
          </v-col>
          <v-col cols="12" md="6">
            <v-img aspect-ratio="16/9" cover src="../assets/section-1-image.jpg"></v-img>
          </v-col>
        </v-row>

        <v-row class="mt-16 py-16">
          <v-col cols="12" class="text-center">
            <h2 class="text-h4 font-weight-bold mb-2">
              You've completed courses on different platforms and chains<br />
              You've got your certs and badges.
            </h2>
            <p class="text-h5 font-weight-light">...what's next?</p>
          </v-col>
        </v-row>

        <v-row class="mt-16 py-16">
          <v-col cols="12" md="6">
            <h3 class="text-h4 font-weight-bold mb-4">
              Craft a builder's profile with Poapedu
            </h3>
            <p class="text-body-1 mb-6">
              Seamlessly connect your wallets and retrieve all of your
              certificates from across platforms
            </p>
            <v-list>
              <v-list-item v-for="(item, i) in features" :key="i">
                <v-list-item-icon>
                  <v-icon color="white">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title style="display:inline-flex" v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6">
            <v-img aspect-ratio="16/9" cover src="../assets/user-profile.jpg"></v-img>
          </v-col>
        </v-row>

        <v-row class="mt-16 py-16">
          <v-col cols="12" class="text-center">
            <h3 class="text-h4 font-weight-bold mb-8">
              We're compatible with your favorite platforms
            </h3>
            <v-row justify="center">
              <v-col cols="auto">
                <v-avatar size="64" color="grey lighten-2">
                  <v-img src="../assets/accredible_logo.jpeg"></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="auto">
                <v-avatar size="64" color="grey lighten-2">
                  <v-img src="../assets/credly_logo.svg"></v-img>
                </v-avatar>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="grey lighten-3" padless>
      <v-container>
        <v-row align="center" class="py-16" no-gutters>
          <v-col cols="12" md="6">
            <h3 class="text-h3 font-weight-bold">Ready to get Poapedus?</h3>
            <p class="text-h6 mb-0">Sign up now!</p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-btn color="black" dark x-large class="text-capitalize"
            @click="goToSignin">Sign up now</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
  <AppFooter />
</template>

<script>
import AppFooter from "@/components/AppFooter.vue";

export default {
  name: "LandingPage",
  components: {
    AppFooter
  },
  data: () => ({
    features: [
      "Build a complete developer's profile",
      "We'll show you what you have...and what else you need",
      "Get 1-to-1 Poapedu NFT for every badge and cert",
    ],
  }),
  methods: {
    goToSignin() {
      this.$router.push("/signin");
    },
  },
};
</script>

<style scoped>
.v-btn {
  text-transform: none !important;
}
</style>
