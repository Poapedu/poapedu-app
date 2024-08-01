<template>
    <v-footer color="#6BA1B4" padless>
      <v-container class="py-10">
        <v-row class="mt-10 align-center" justify="center">

          <!-- Newsletter subscription -->
          <v-col cols="6" class="text-center">
            <h3 class="text-h4 font-weight-bold mb-4">Subscribe to our newsletter</h3>
            <p class="mb-4">We'll drop you some goodies and perks once a month or whenever we launch a big feature! Don't hesitate to subscribe!</p>
            <v-form @submit.prevent="subscribeNewsletter">
              <v-text-field
                v-model="email"
                label="Enter your email and press enter"
                outlined
                dense
                dark
                append-outer-icon="mdi-send"
                @click:append-outer="subscribeNewsletter"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-alert v-if="successMessage" type="success" dismissible>{{ successMessage }}</v-alert>
              <v-alert v-if="errorMessage" type="error" dismissible>{{ errorMessage }}</v-alert>
            </v-form>
          </v-col>
        </v-row>
  
        <!-- Bottom section -->
        <v-row class="mt-10 align-center">
          <v-col cols="6">
            <v-img src="../assets/logo.png" max-width="50" contain></v-img>
          </v-col>
          <v-col cols="16" class="text-right">
            <span style="">we are poapedu. our code is serious business, but our footers are a joke.</span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script>

  import axios from 'axios';

  export default {
    data: () => ({
      email: '',  
      successMessage: '',
      errorMessage: '',
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }),
    methods: {
      async subscribeNewsletter() {
        console.log('Subscribing:', this.email);
        const form = this.$refs.form;
        if (!form || !form.validate()) {
          return; // Stop if the form is invalid
        }
        try {
          // Reset messages
          this.successMessage = '';
          this.errorMessage = '';

          // Send POST request to /subscribe API
          const response = await axios.post('/subscribe', { email: this.email });
          if(response.data.success) {
            this.successMessage = 'Subscription successful!';
            this.email = ''; // Clear the email field
          } else {
            this.errorMessage = 'Subscription failed. Please try again.';
          }
        } catch (error) {
          // Handle error response
          this.errorMessage = 'Subscription failed. Please try again.';
        }
      }
    }
  }
  </script>
  
  <style scoped>
    @media (max-width: 1264px) {
    .v-col-lg-2 {
        flex: 0 0 33.333333% !important;
        max-width: 33.333333% !important;
    }
    }
    .footer-links {
      list-style-type: none;
    }

    .footer-link {
      color: #ffffff;
      text-decoration: none;
      font-size: 0.875rem;
      line-height: 2;
      transition: color 0.2s ease;
    }

    .footer-link:hover {
      color: #bdbdbd;
    }
  </style>