<template>
    <v-app>
      <AppHeader />
      <v-main class="grey lighten-4">
        <ProfileHeader />
        <v-container>
          <Certifications />
          <SkillTree />
        </v-container>
      </v-main>
      <AppFooter />
    </v-app>
  </template>
  
  <script>
  import AppHeader from '../components/AppHeader.vue'
  import ProfileHeader from '../components/ProfileHeader.vue'
  import Certifications from '../components/CertificationsMod.vue'
  import SkillTree from '../components/SkillTree.vue'
  import AppFooter from '../components/AppFooter.vue'
  
  export default {
    name: 'UserDashboard',
    components: {
        AppHeader,
        ProfileHeader,
        Certifications,
        SkillTree,
        AppFooter
    }
  }
  </script>