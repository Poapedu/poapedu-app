<template>
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
      <v-btn color="primary" outlined @click="connectWallet">
        Connect Wallet
      </v-btn>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    name: 'AppHeader',
    methods: {
      connectWallet() {
        // Implement wallet connection logic here
        console.log('Connecting wallet...')
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any header-specific styles here */
  </style>