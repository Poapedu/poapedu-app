<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.v-application {
  background-color: #f5f5f5;
}

.v-card {
  border-radius: 8px;
}

.v-btn {
  text-transform: none;
}
</style>