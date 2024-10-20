<template>
    <div>
      <p v-if="loading">Processing login...</p>
      <p v-if="error">{{ error }}</p>
    </div>
</template>
  
<script>
  import { OCAuthSandbox } from '@opencampus/ocid-connect-js';
  import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      error: null,
    };
  },
  async mounted() {
    const redirectUri = `${window.location.origin}/redirect`;
    const opts = {
      redirectUri: redirectUri,
    };
    const ocAuth = new OCAuthSandbox(opts);

    try {
      const authState = await ocAuth.handleLoginRedirect();
      const userInfo = ocAuth.getAuthInfo();

      if (authState && authState.idToken && authState.isAuthenticated) {
        const ocAuthStatus = { ...authState, ...userInfo };
        localStorage.setItem('ocid_auth', JSON.stringify(ocAuthStatus));

        //Store the data in the DB. If exists, return the ID
        const response = await axios.post(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/ocid-auth`, {
          edu_username: userInfo.edu_username,
          eth_address: userInfo.eth_address
        });

        if (response.data.success) {
          console.log('Learner ID:', response.data.learnerId);
          localStorage.setItem('learner_id', response.data.learnerId);
        }

        // Redirect to dashboard
        //this.$router.push('/dashboard');
        //route user to email capture
        this.$router.push('/ocid-email-capture');
      } else {
        throw new Error('No idToken received from OCID or not authenticated');
      }
    } catch (error) {
      console.error('Error handling OCID redirect:', error);
      this.error = error.message || 'An error occurred during login.';
      // Redirect to signin page after a short delay
      setTimeout(() => this.$router.push('/signin'), 3000);
    } finally {
      this.loading = false;
    }
  }
}
</script>