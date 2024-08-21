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
              <v-img v-if="userProfilePicture" :src="userProfilePicture" alt="User Avatar"></v-img>
              <span v-else class="text-h5">{{ userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto">
              <v-avatar color="brown">
                <v-img v-if="userProfilePicture" :src="userProfilePicture" alt="User Avatar"></v-img>
                <span v-else class="text-h5">{{ userInitials }}</span>
              </v-avatar>
              <h3>{{ userFullName }}</h3>
              <p class="text-caption mt-1">
                {{ userEmail }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" rounded @click="goToEditProfile">
                Edit Profile
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" rounded @click="goToMintNFT">
                Mint NFTs
              </v-btn>
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
import { mapState } from 'vuex';
import { supabase } from "@/supabase";
import { authStore } from "@/store/authStore";

export default {
  name: "AppHeader",
  computed: {
    ...mapState(['dbData']),
    userProfilePicture() {
      return this.dbData?.profile_photo || null;
    },
    userInitials() {
      const firstName = this.dbData?.first_name || '';
      const lastName = this.dbData?.last_name || '';
      return (firstName[0] + lastName[0]).toUpperCase();
    },
    userFullName() {
      return `${this.dbData?.first_name || ''} ${this.dbData?.last_name || ''}`;
    },
    userEmail() {
      return this.dbData?.email || '';
    }
  },
  methods: {
    connectWallet() {
      // Implement wallet connection logic here
      console.log("Connecting wallet...");
    },
    goToEditProfile() {
      this.$router.push("/edit-profile");
    },
    goToMintNFT() {
      this.$router.push("/mint-nft");
    },
    async signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        authStore.clearSession();
        console.log("User signed out successfully.");
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.error("Error signing out:", error.message);
      }
    }
  },
};
</script>
