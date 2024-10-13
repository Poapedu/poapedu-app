<template>
    <v-app>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <template v-if="!isLoading">
        <AppHeader />
        <v-main class="grey lighten-4">
          <ProfileHeader />
          <v-container>
            <Certifications />
            <SkillTree />
          </v-container>
        </v-main>
        <AppFooter />
      </template>
      <v-alert v-if="error" type="error">
        {{ error }}
      </v-alert>
    </v-app>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex'
  import AppHeader from '../components/AppHeader.vue'
  import AppFooter from '../components/AppFooter.vue'
  import ProfileHeader from '../components/ProfileHeader.vue'
  import Certifications from '../components/CertificationsMod.vue'
  import SkillTree from '../components/SkillTree.vue'
  
  export default {
    name: 'UserDashboard',
    components: {
      AppHeader,
      ProfileHeader,
      Certifications,
      SkillTree,
      AppFooter
    },
    computed: {
      ...mapState(['dbData', 'hasFilled', 'isLoading', 'error'])
    },
    created() {
      console.log('UserDashboard: created hook');
      if (!this.dbData) {
        console.log('UserDashboard: Fetching user data');
        this.fetchUserData();
      } else {
        console.log('UserDashboard: User data already present');
      }
    },
    methods: {
      ...mapActions(['fetchUserData'])
    }
  }
  </script>