<template>
  <v-app>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-img src="@/assets/SignInPhoto.jpg" height="100vh" cover></v-img>
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
          <v-card-subtitle
            >Create your next gen builder's profile</v-card-subtitle
          >
          <v-form @submit.prevent="handleMagicLinkSignIn">
            <v-text-field
              label="Email address"
              v-model="email"
              required
            ></v-text-field>
            <v-checkbox v-model="rememberMe" label="Remember me"></v-checkbox>
            <v-btn
              type="submit"
              color="#403A32"
              block
              :loading="loading"
              :disabled="loading"
            >
              <span v-if="!loading">Sign In</span>
              <span v-else>Signing In...</span></v-btn
            >
            <v-alert v-if="emailSent" type="success" dismissible>
              A magic link has been sent to your email address. You may close
              this tab now.
            </v-alert>
            <v-alert v-if="errorMessage" type="error" dismissible>
              {{ errorMessage }}
            </v-alert>
          </v-form>
        </v-container>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import { createClient } from "@supabase/supabase-js";

export default {
  data() {
    return {
      email: "",
      rememberMe: false,
      emailSent: false,
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async handleMagicLinkSignIn() {
      if (!this.email) {
        this.errorMessage = "Email address is required.";
        return;
      }

      this.loading = true;

      const supabase = createClient(
        process.env.VUE_APP_SUPABASE_URL,
        process.env.VUE_APP_SUPABASE_ANON_KEY
      );

      const { error, session } =
        (await supabase.auth.signInWithOtp({
          email: this.email,
          options: {
            emailRedirectTo: "http://localhost:8080/dashboard",
            data: { app_role: "user" },
          },
        })) || {}; // Ensure destructuring of possible undefined response

      if (error) {
        this.errorMessage = error.message;
      } else {
        if (this.rememberMe) {
          localStorage.setItem("supabase.session", JSON.stringify(session));
        }
        this.emailSent = true;
        this.email = ""; // Clear the email input box
        this.errorMessage = ""; // Clear any previous error messages
      }

      this.loading = false; // Stop loading
    },
    async autoSignIn() {
      const savedSession = localStorage.getItem("supabase.session");
      if (savedSession) {
        const supabase = createClient(
          process.env.VUE_APP_SUPABASE_URL,
          process.env.VUE_APP_SUPABASE_ANON_KEY
        );
        const session = JSON.parse(savedSession);

        // Set the session in Supabase client
        await supabase.auth.setSession(session);
        // Validate the session
        const { error } = await supabase.auth.getUser();
        if (error) {
          localStorage.removeItem("supabase.session");
        } else {
          this.$router.push("/dashboard"); // Redirect to dashboard or another protected route
        }
      }
    },
  },
  async created() {
    const supabase = createClient(
      process.env.VUE_APP_SUPABASE_URL,
      process.env.VUE_APP_SUPABASE_ANON_KEY
    );

    // Check if there's an existing session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      this.$router.push("/dashboard");
    } else {
      this.autoSignIn();
    }
  },
};
</script>

<style scoped>
.form-column {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden; /* Prevents scrollbar */
}

.form-container {
  max-width: 400px;
  width: 100%;
  padding: 30px;
  box-shadow: none; /* Removes box shadow */
  border: none; /* Removes border */
}

.v-card-title,
.v-card-subtitle {
  text-align: center;
}
</style>
