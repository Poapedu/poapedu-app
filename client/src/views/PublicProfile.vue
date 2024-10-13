<template>
  <v-app>
    <AppHeader />
    <v-main class="grey lighten-4">
      <v-container v-if="profile">
        <v-card>
          <v-img
            :src="profile.profile_banner || require('@/assets/poapedu_default_banner.png')"
            height="200px"
            cover
          ></v-img>
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-avatar
                  size="150"
                  class="profile-avatar"
                  :style="{ marginTop: '-75px' }"
                >
                  <v-img :src="profile.profile_photo || require('@/assets/poapedu_default_profile_pic.png')"></v-img>
                </v-avatar>
                <h2 class="text-h4 mt-4">{{ profile.first_name }} {{ profile.last_name }}</h2>
                <p class="text-subtitle-1">{{ profile.one_liner_bio }}</p>
                <v-divider class="my-4"></v-divider>
                <v-list>
                  <v-list-item v-if="profile.wallet_address">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-wallet</v-icon>
                    </template>
                    <v-list-item-title>Wallet Address</v-list-item-title>
                    <v-list-item-subtitle>{{ profile.wallet_address }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-email</v-icon>
                    </template>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ profile.email }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="8">
                <v-card-text>
                  <h3 class="text-h5 mb-4">Skills</h3>
                  <v-chip
                    v-for="skill in profile.skills"
                    :key="skill"
                    class="mr-2 mb-2"
                    color="#6BA1B4"
                    text-color="white"
                  >
                    {{ skill }}
                  </v-chip>
                  <v-divider class="my-4"></v-divider>
                  <h3 class="text-h5 mb-4">About</h3>
                  <p>{{ profile.description || 'No description provided.' }}</p>
                  <v-divider class="my-4"></v-divider>
                  <h3 class="text-h5 mb-4">Social Links</h3>
                  <v-btn
                    v-for="icon in socialIcons"
                    :key="icon.name"
                    :icon="icon.icon"
                    :color="icon.color"
                    :href="icon.url"
                    target="_blank"
                    class="mr-2"
                  ></v-btn>
                </v-card-text>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
      <v-container v-else-if="error">
        <v-alert type="error">{{ error }}</v-alert>
      </v-container>
      <v-container v-else>
        <v-alert type="info">Loading profile...</v-alert>
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import axios from 'axios';

export default {
  name: 'PublicProfile',
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      profile: null,
      error: null
    };
  },
  computed: {
    socialIcons() {
      const icons = [];
      if (this.profile?.linkedin_url)
        icons.push({ name: 'LinkedIn', icon: 'mdi-linkedin', color: '#0077b5', url: this.profile.linkedin_url });
      if (this.profile?.twitter_url)
        icons.push({ name: 'Twitter', icon: 'mdi-twitter', color: '#1DA1F2', url: this.profile.twitter_url });
      if (this.profile?.discord_url)
        icons.push({ name: 'Discord', icon: 'mdi-discord', color: '#7289da', url: this.profile.discord_url });
      if (this.profile?.github_url)
        icons.push({ name: 'GitHub', icon: 'mdi-github', color: '#333', url: this.profile.github_url });
      return icons;
    },
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/public-profile/${this.$route.params.slug}`);
        console.log('Profile data received:', response.data);
        this.profile = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        this.error = `Error loading profile: ${error.message}`;
      }
    }
  },
};
</script>

<style scoped>
.profile-avatar {
  border: 4px solid white;
}
</style>