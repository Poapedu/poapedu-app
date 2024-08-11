<template>
  <v-app-bar app color="#6BA1B4" elevation="1">
    <v-img
      src="@/assets/poapedu_logo_white.svg"
      max-height="40"
      contain
      class="mr-3"
    ></v-img>
    <v-spacer></v-spacer>
    <v-row justify="end" class="mr-5">
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="brown" size="large">
              <span class="text-h5">{{ user.initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto">
              <v-avatar color="brown">
                <span class="text-h5">{{ user.initials }}</span>
              </v-avatar>
              <h3>{{ user.fullName }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" rounded @click="goToEditProfile"> Edit Profile </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" rounded @click="signOut"> Sign Out </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-row>
  </v-app-bar>
</template>

<script>
import { supabase } from '@/supabase';
import { authStore } from '@/store/authStore'

export default {
  name: "AppHeader",
  data: () => ({
    user: {
      initials: "JD",
      fullName: "John Doe",
      email: "john.doe@doe.com",
    },
  }),
  methods: {
    connectWallet() {
      // Implement wallet connection logic here
      console.log("Connecting wallet...");
    },
    goToEditProfile() {
        this.$router.push('/edit-profile');
    },
    async signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error
  
        authStore.clearSession();
        console.log("User signed out successfully.");
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.error("Error signing out:", error.message);
      }
    },
  },
};
</script>