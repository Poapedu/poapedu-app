<template>
    <v-app>
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-img src="@/assets/login_featureimage.png" height="100vh" cover></v-img>
        </v-col>
        <v-col cols="12" md="6" class="form-column">
          <v-container class="form-container">
            <v-img
              src="@/assets/poapedu_logo_black.png"
              alt="Poapedu Logo"
              contain
              max-height="80"
              class="mx-auto mb-4"
            ></v-img>
            <p class="mb-2 text-center">One last step to complete your next gen builder's profile. <br />We'll need your email address before we can proceed.</p>
            <v-form @submit.prevent="submitEmail" ref="form">
              <v-text-field
                label="Email address"
                v-model="email"
                required
                :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
              ></v-text-field>
              <v-btn
                type="submit"
                color="#403A32"
                block
                :loading="loading"
                :disabled="loading"
              >
                <span v-if="!loading">Complete Registration</span>
                <span v-else>Processing...</span>
              </v-btn>
              <v-alert v-if="errorMessage" type="error" dismissible class="mt-4">
                {{ errorMessage }}
              </v-alert>
            </v-form>
          </v-container>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" :color="snackbarColor" top>
        {{ snackbarText }}
      </v-snackbar>
    </v-app>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'OCIDEmailCapture',
    data() {
      return {
        email: '',
        loading: false,
        errorMessage: '',
        snackbar: false,
        snackbarText: '',
        snackbarColor: 'success',
      };
    },
    methods: {
      async submitEmail() {
        if (this.$refs.form.validate()) {
          this.loading = true;
          this.errorMessage = '';
          try {
            const ocidAuth = JSON.parse(localStorage.getItem('ocid_auth'));
            const response = await axios.post(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/ocid-email-capture`, {
              email: this.email,
              eth_address: ocidAuth.eth_address
            });
            
            if (response.data.success) {
              this.snackbarText = 'Email registered successfully!';
              this.snackbarColor = 'success';
              this.snackbar = true;
              
              localStorage.setItem('learner_id', response.data.learnerId);
              
              setTimeout(() => {
                this.$router.push('/dashboard');
              }, 1500);
            } else {
              throw new Error(response.data.message || 'Failed to register email');
            }
          } catch (error) {
            console.error('Error registering email:', error);
            this.errorMessage = error.message || 'An error occurred while registering your email';
          } finally {
            this.loading = false;
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .form-column {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #ffffff;
    overflow: hidden;
  }
  
  .form-container {
    max-width: 400px;
    width: 100%;
    padding: 30px;
    box-shadow: none;
    border: none;
  }
  
  .v-card-subtitle {
    text-align: center;
  }
  </style>