<template>
  <v-app>
    <AppHeader />
    <v-main class="grey">
      <v-container class="text-center">
        <v-card class="mx-auto mt-10 pa-6" max-width="600">
          <v-img
            src="@/assets/poapedu_logo_black.png"
            alt="Poapedu Logo"
            contain
            height="100"
            class="mb-4"
          ></v-img>
          <h1 class="text-h3 mb-6 text-black">Not Found</h1>
          <p class="text-h5 mb-6 text-black">Oops! Looks like this page took a coffee break.</p>
          <p class="text-body-1 mb-6 text-black">
            Don't worry, our dev team is caffeinating as we speak to bring it back!
          </p>
          <v-btn
            color="#6BA1B4"
            @click="goHome"
            class="white--text"
            elevation="2"
          >
            Return Home
          </v-btn>
        </v-card>
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  name: 'NotFound',
  components: {
    AppHeader,
    AppFooter,
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
@keyframes coffeeSpill {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

.v-img {
  animation: coffeeSpill 3s infinite ease-in-out;
}

.v-card {
  background-color: #EAE1D7;
  border: 2px solid #403A32;
}

.v-btn {
  text-transform: none;
  font-weight: bold;
}
</style>