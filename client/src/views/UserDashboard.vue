<template>
    <v-app>
      <v-app-bar app color="white" elevation="1">
        <v-img
          src="@/assets/logo.png"
          max-height="40"
          max-width="40"
          contain
          class="mr-3"
        ></v-img>
        <v-toolbar-title class="text-h5 font-weight-bold">POAPEDU</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined>
          Connect Wallet
        </v-btn>
      </v-app-bar>
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
  import ProfileHeader from '../components/ProfileHeader.vue'
  import Certifications from '../components/CertificationsMod.vue'
  import SkillTree from '../components/SkillTree.vue'
  import AppFooter from '../components/AppFooter.vue'
  
  export default {
    name: 'UserDashboard',
    components: {
      ProfileHeader,
      Certifications,
      SkillTree,
      AppFooter
    }
  }
  </script>