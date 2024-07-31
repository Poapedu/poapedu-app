<template>
  <v-app>
    <v-app-bar app color="white" elevation="0">
      <v-toolbar-title class="text-h5 font-weight-bold"
        >POAPEDU</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn text class="mr-2">Login</v-btn>
      <v-btn color="black" dark>Sign Up</v-btn>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container class="py-12">
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
            <v-sheet height="300" class="d-flex align-center justify-center">
              <v-icon x-large>mdi-image-outline</v-icon>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row class="mt-16">
          <v-col cols="12" class="text-center">
            <h2 class="text-h4 font-weight-bold mb-2">
              You've completed courses on different platforms and chains<br />
              You've got your certs and badges.
            </h2>
            <p class="text-h5 font-weight-light">...what's next?</p>
          </v-col>
        </v-row>

        <v-row class="mt-16">
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
                  <v-icon color="black">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6">
            <v-sheet height="300" class="d-flex align-center justify-center">
              <v-icon x-large>mdi-image-outline</v-icon>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row class="mt-16">
          <v-col cols="12" class="text-center">
            <h3 class="text-h4 font-weight-bold mb-8">
              We're compatible with your favorite platforms
            </h3>
            <v-row justify="center">
              <v-col v-for="n in 5" :key="n" cols="auto">
                <v-avatar size="64" color="grey lighten-2"></v-avatar>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="grey lighten-3" padless>
      <v-container>
        <v-row align="center" no-gutters>
          <v-col cols="12" md="6">
            <h3 class="text-h5 font-weight-bold">Ready to get Poapedus?</h3>
            <p class="mb-0">Sign up now!</p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-btn color="black" dark x-large class="text-capitalize"
              >Sign up now</v-btn
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
};
</script>

<style scoped>
.v-btn {
  text-transform: none !important;
}
</style>
