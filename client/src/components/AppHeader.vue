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
      <template v-if="!isPublicProfilePage">
        <v-menu v-if="isLoggedIn" min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="brown" size="large">
                <v-img v-if="userProfilePicture" :src="userProfilePicture" :alt="userFullName"></v-img>
                <span v-else class="text-h5">{{ userInitials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto">
                <v-avatar color="brown">
                  <v-img v-if="userProfilePicture" :src="userProfilePicture" :alt="userFullName"></v-img>
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
        <v-btn v-else color="white" text @click="goToSignIn">Sign In</v-btn>
      </template>
      <!-- <template v-else>
        
      </template> -->
    </v-row>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import { supabase } from "@/supabase";
import { authStore } from "@/store/authStore";
import { useRoute } from 'vue-router';

export default {
  name: "AppHeader",
  setup() {
    const route = useRoute();
    return { route };
  },
  data() {
    return {
      session: null
    };
  },
  computed: {
    ...mapState(['dbData']),
    isLoggedIn() {
      return !!this.session;
    },
    isPublicProfilePage() {
      return this.route.name === 'PublicProfile';
    },
    userProfilePicture() {
      return this.dbData?.profile_photo || null;
    },
    userInitials() {
      const firstName = this.dbData?.first_name || '';
      const lastName = this.dbData?.last_name || '';
      if (firstName && lastName) {
        return (firstName[0] + lastName[0]).toUpperCase();
      } else if (firstName) {
        return firstName[0].toUpperCase();
      } else if (lastName) {
        return lastName[0].toUpperCase();
      } else {
        return ''; // Default initial if no name is available
      }
    },
    userFullName() {
      return `${this.dbData?.first_name || ''} ${this.dbData?.last_name || ''}`;
    },
    userEmail() {
      return this.session?.user?.email || '';
    }
  },
  methods: {
    goToEditProfile() {
      this.$router.push("/edit-profile");
    },
    goToMintNFT() {
      this.$router.push("/mint-nft");
    },
    goToSignIn() {
      this.$router.push("/signin");
    },
    async signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        authStore.clearSession();
        this.session = null;
        //console.log("User signed out successfully.");
        this.$router.push({ name: "Home" });
      } catch (error) {
        //console.error("Error signing out:", error.message);
      }
    },
    async checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      this.session = session;
    }
  },
  async created() {
    await this.checkSession();
    supabase.auth.onAuthStateChange((_, session) => {
      this.session = session;
    });
  }
};
</script>