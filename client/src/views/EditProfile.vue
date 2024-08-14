<template>
  <v-app>
    <AppHeader />
    <v-main class="grey lighten-4">
      <v-container>
        <!-- Back Button -->
        <v-row class="back-button-row">
          <v-col cols="12" class="d-flex align-start">
            <v-btn class="back-button" @click="goBack">
              <v-icon left>mdi-chevron-left</v-icon> Back to Profile
            </v-btn>
          </v-col>
        </v-row>

        <!-- Profile Form -->
        <v-form
          class="mt-10 py-10 px-10 profile-form"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col cols="6">
              <h2 class="profile-header"><b>PROFILE DETAILS</b></h2>
            </v-col>
            <v-col cols="6" class="d-flex justify-end">
              <v-btn class="save-btn" @click="saveProfile">
                <v-icon left>mdi-floppy</v-icon>
                Save Changes
              </v-btn>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="2" class="d-flex align-center justify-center">
              <v-img
                :src="form.profile_photo || 'https://via.placeholder.com/150'"
                class="profile-image"
                @click="openUploadModal('profile_photo')"
              ></v-img>
            </v-col>
            <v-col
              cols="10"
              class="d-flex flex-column align-start justify-center"
            >
              <div class="upload-container">
                <v-btn
                  class="upload-btn"
                  @click="openUploadModal('profile_photo')"
                >
                  Upload Image
                </v-btn>
                <div class="upload-hint">JPG or PNG, 2MB max.</div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" md="3">
              <div class="form-group">
                <label for="first_name">First Name</label>
                <v-text-field
                  id="first_name"
                  v-model="form.first_name"
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="6" md="3">
              <div class="form-group">
                <label for="last_name">Last Name</label>
                <v-text-field
                  id="last_name"
                  v-model="form.last_name"
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="form-group">
                <label for="email">Email</label>
                <v-text-field
                  id="email"
                  v-model="form.email"
                  readonly
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="form-group">
                <label for="bio">Bio</label>
                <v-text-field
                  id="bio"
                  v-model="form.one_liner_bio"
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label class="skills-label">Highlighted Skills</label>
              <div class="skills-tags">
                <v-chip
                  v-for="(skill, index) in form.skills"
                  :key="index"
                  class="skill-chip"
                  color="#96ADC8"
                  outlined
                >
                  {{ skill }}
                </v-chip>
                <v-btn
                  icon
                  @click="addSkill"
                  class="add-skill-btn"
                  color="#96ADC8"
                  outlined
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>

        <!-- Social Accounts Form -->
        <v-form
          class="mt-10 socialForm py-10 px-10 social-form"
          ref="socialForm"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col cols="6">
              <h2 class="profile-header"><b>SOCIAL ACCOUNTS</b></h2>
            </v-col>

            <v-col cols="6" class="d-flex justify-end">
              <v-btn class="save-btn" @click="saveSocials">
                <v-icon left>mdi-floppy</v-icon>
                Save Changes
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <div class="form-group">
                <label for="github">GitHub</label>
                <v-text-field
                  id="github"
                  v-model="form.github_url"
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="form-group">
                <label for="linkedin">LinkedIn</label>
                <v-text-field
                  id="linkedin"
                  v-model="form.linkedin_url"
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="form-group">
                <label for="twitter">X</label>
                <v-text-field
                  id="twitter"
                  v-model="form.twitter_url"
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="form-group">
                <label for="discord">Discord</label>
                <v-text-field
                  id="discord"
                  v-model="form.discord_url"
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-form>
        <v-row class="back-button-row">
          <v-col cols="12" class="d-flex align-start">
            <v-btn class="back-button" @click="goBack">
              <v-icon left>mdi-chevron-left</v-icon> Back to Profile
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { getUserEmail } from "../supabase.js";
import axios from "axios";

export default {
  name: "EditProfile",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      valid: false,
      form: {
        profile_photo: "",
        first_name: "",
        last_name: "",
        email: "",
        wallet_address: "",
        one_liner_bio: "",
        description: "",
        skills: [],
        linkedin_url: "",
        github_url: "",
        twitter_url: "",
        discord_url: "",
      },
    };
  },
  async created() {
    this.form.email = await getUserEmail();
    this.initializeFormData();
  },
  methods: {
    async initializeFormData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/user`, {
          params: { email: this.form.email },
        });

        console.log("Fetched user data:", response.data);

        if (response.data) {
          const userData = response.data;

          // Explicitly setting each form field
          this.$set(this.form, "profile_photo", userData.profile_photo || "");
          this.$set(this.form, "first_name", userData.first_name || "");
          this.$set(this.form, "last_name", userData.last_name || "");
          this.$set(this.form, "wallet_address", userData.wallet_address || "");
          this.$set(this.form, "one_liner_bio", userData.one_liner_bio || "");
          this.$set(this.form, "description", userData.description || "");
          this.$set(
            this.form,
            "skills",
            userData.skills ? userData.skills.split(",") : []
          );
          this.$set(this.form, "linkedin_url", userData.linkedin_url || "");
          this.$set(this.form, "github_url", userData.github_url || "");
          this.$set(this.form, "twitter_url", userData.twitter_url || "");
          this.$set(this.form, "discord_url", userData.discord_url || "");
        }
      } catch (error) {
        console.error("Error initializing form data:", error);
      }
    },
    goBack() {
      this.$router.push("/dashboard"); // Change this to your actual route
    },
    openUploadModal(type) {
      window.cloudinary.openUploadWidget(
        {
          cloud_name: `${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}`,
          upload_preset: `${process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET}`,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            if (type === "profile_photo") {
              this.$set(this.form, "profile_photo", result.info.secure_url);
            }
          } else if (error) {
            console.error("Upload failed:", error);
          }
        }
      );
    },
    async saveProfile() {
      if (this.$refs.form.validate()) {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_LOCAL_SERVER_URL}/api/save-profile`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(this.form),
            }
          );
          const data = await response.json();
          if (data.success) {
            this.$router.push("/dashboard"); // Redirect after successful save
          } else {
            console.error("Save failed", data.message);
          }
        } catch (error) {
          console.error("Save failed", error);
        }
      }
    },
    async saveSocials() {
      if (this.$refs.socialForm.validate()) {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_LOCAL_SERVER_URL}/api/save-socials`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(this.form),
            }
          );
          const data = await response.json();
          if (data.success) {
            this.$router.push("/dashboard"); // Redirect after successful save
          } else {
            console.error("Save failed", data.message);
          }
        } catch (error) {
          console.error("Save failed", error);
        }
      }
    },
    addSkill() {
      // Logic to add a new skill, e.g., opening a modal for input
      console.log("Add skill clicked");
    },
  },
};
</script>

<style scoped>
.profile-form,
.social-form {
  background-color: #ded2c4;
  border-radius: 10px;
}

.profile-header {
  font-weight: bold;
  font-size: 24px;
  color: #2c2c2c;
  margin-bottom: 20px;
}

.back-button-row {
  margin-top: 80px;
  margin-bottom: 80px;
}

.back-button {
  background-color: #96adc8;
  color: white;
  border-radius: 25px;
  font-weight: bold;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.back-button v-icon {
  margin-right: 5px;
}

.profile-image {
  max-width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ccc;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-btn {
  background-color: #d3bba6;
  color: #2c2c2c;
  margin-top: 10px;
}

.upload-hint {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
  text-align: center;
}

.skills-label {
  font-weight: bold;
  color: #2c2c2c;
  margin-bottom: 10px;
  display: block;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
}

.skill-chip {
  margin-right: 10px;
  margin-bottom: 10px;
}

.add-skill-btn {
  margin-bottom: 10px;
}

.save-btn {
  background-color: #eae1d7;
  color: black;
  border-radius: 25px;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: bold;
}

.save-btn v-icon {
  margin-right: 5px;
}

/* Custom Input Field Styles */
.custom-input .v-input__control {
  background-color: white;
}

.custom-input .v-label {
  color: #2c2c2c;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c2c2c;
}
</style>
