<template>
  <v-app>
    <v-toolbar>
      <!-- Adjust the height to your needs, mine is 40 -->
      <img class="ml-5" :src="require('@/assets/poapedu_logo_white.svg')" height="40"/>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text class="mr-2" @click="goToSignin">Login/Sign Up</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-main class="grey lighten-4">
      <v-container fluid style="background: #BFD9E2">
        <v-container class="py-16 mt-4">
          <v-row>
            <v-col class="mt-5" cols="6">
              <h1 class="text-h2 font-weight-bold mb-4" style="font-family: Onest, sans-serif;font-weight: 900;text-align: left;">
                FLAUNT WHAT YOU'VE ACHIEVED
              </h1>
              <p class="text-body-1 mb-6">
                Consolidate all of your certs and NFT badges onto a single
                coherent builder's profile.
              </p>
              <v-btn color="primary" rounded x-large class="text-capitalize">GET YOUR PROFILE</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-img aspect-ratio="16/9" cover src="../assets/landingbanner_placeholder.png"></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
      <v-container class="py-16 mt-4">
        <v-row class="mt-16 py-16 second-container">
          <v-col cols="12" md="6">
            <v-img aspect-ratio="16/9" alt="" title="" cover src="../assets/section1_image.png"></v-img>
          </v-col>
          <v-col cols="12" md="6" class="text-left">
            <h5 class="text-h5 mt-5 font-weight-bold mb-2">
              You've completed courses on different platforms and chains.
            </h5>
            <h5 class="text-h5 mt-10 font-weight-bold mb-2">
              You've got your certs and badges.
            </h5>
            <p class="text-h5 mt-10 font-weight-light text-right">...what's next?</p>
          </v-col>
        </v-row>

        <v-row class="mt-16 py-16" style="background: #403a32;color: #fff;padding: 25px;border-radius: 5px;">
          <v-col cols="12" md="6">
            <h3 class="text-h4 font-weight-bold mb-4">
              Craft a builder's profile with Poapedu
            </h3>
            <p class="text-body-1 mb-6">
              Seamlessly connect your wallets and retrieve all of your certificates from across platforms
            </p>
            <v-list style="background: #403a32;">
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
            <v-img aspect-ratio="16/9" alt="Craft a builder's profile with Poapedu" title="Craft a builder's profile with Poapedu" cover src="../assets/createprofile_placeholder.png"></v-img>
          </v-col>
        </v-row>
        <v-row class="mt-16 py-16">
          <v-col cols="12" class="text-center">
            <h3 class="text-h4 font-weight-bold mb-8">
              We're compatible with your favorite platforms
            </h3>
            <v-row justify="center">
                  <v-img src="../assets/accredible-logo.png" alt="Accredible by Credential.net" title="Accredible by Credential.net"></v-img>
                  <v-img src="../assets/google-cloud-logo.png" alt="Google Cloud Skills Boost" title="Google Cloud Skills Boost"></v-img>
                  <v-img src="../assets/credly-logo.png" alt="Credly by Pearson" title="Credly by Pearson"></v-img>
                  <v-img src="../assets/linkedin-learning-logo.png" alt="LinkedIn Learning" title="LinkedIn Learning"></v-img>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mt-16 poapedus-signup">
          <v-col cols="12" md="6">
            <div class="py-16 text-center content">
              <h2 style="font-weight:700;">READY TO GET POAPEDUS?</h2>
              <v-btn text class="mt-4" color="primary" rounded @click="goToSignin">Login/Sign Up</v-btn>
            </div>
            <div class="character wizard"></div>
            <div class="character frog"></div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- <v-footer color="grey lighten-3" padless>
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
    </v-footer> -->
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
.second-container {
  background: #DED2C4;
  padding: 25px;
  border-radius: 5px;
}

.poapedus-signup {
  background-color: #b8e2f2;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signup-button {
  background-color: #5c9ead;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.character {
  position: absolute;
  width: 200px;
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
}

.wizard {
  left: 0;
  bottom: -20px;
  background-image: url('../assets/left-frog.png');
}

.frog {
  right: -15px;
  top: 0;
  background-image: url('../assets/right-frog.png');
}

@media (max-width: 768px) {
  .character {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .character {
    width: 40px;
    height: 40px;
  }  
  .signup-button {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>
