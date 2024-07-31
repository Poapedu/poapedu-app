<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-h5">POAPEDU</v-card-title>
            <v-card-subtitle>Create your next-gen builder's profile</v-card-subtitle>
            <v-form @submit.prevent="handleMagicLinkSignIn">
              <v-text-field
                label="Email"
                v-model="email"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block>
                Log in / Sign up
              </v-btn>
              <v-alert v-if="emailSent" type="success" dismissible>
                A magic link has been sent to your email address. You may close this tab now.
              </v-alert>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { createClient } from '@supabase/supabase-js';
  
  export default {
    data() {
      return {
        email: '',
        emailSent: false,
      };
    },
    methods: {
      async handleMagicLinkSignIn() {
        const supabase = createClient(
          process.env.VUE_APP_SUPABASE_URL, 
          process.env.VUE_APP_SUPABASE_ANON_KEY  
        );
  
        const { error } = await supabase.auth.signInWithOtp({
          email: this.email,
          options: {
            emailRedirectTo: 'http://localhost:8080/dashboard', 
            data: { app_role: 'user' },
          },
        });
  
        if (error) {
          this.$toast.error(error.message);
        } else {
          this.emailSent = true;
          //this.$toast.success('Check your email for the magic link!');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    padding: 20px;
  }
  .v-card-title,
  .v-card-subtitle {
    text-align: center;
  }
  </style>
  