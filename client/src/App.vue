<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
//import { useAuth } from '@/composables/useAuth'

export default {
  name: 'App',
  created() {
    //console.log('App: created hook');
  }
  // setup() {
  //   const { user } = useAuth()

  //   return {
  //     user
  //   }
  // }
}
</script>

<style>
.v-application {
  background-color: #EAE1D7;
}

.v-card {
  border-radius: 8px;
}

.v-btn {
  text-transform: none;
}
</style>