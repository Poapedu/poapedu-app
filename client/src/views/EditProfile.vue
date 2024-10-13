<template>
  <v-app>
    <!-- Main application wrapper -->
    <AppHeader />
    <v-main class="grey lighten-4">
      <v-container>
        <!-- Back button to return to profile -->
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
            <v-col cols="12" md="12">
              <div class="form-group">
                <label for="slug">Profile URL</label>
                <v-text-field
                  id="slug"
                  v-model="form.slug"
                  hide-details
                  class="custom-input"
                  bg-color="white"
                  density="compact"
                  variant="solo"
                  :rules="[rules.required, rules.slug]"
                  @input="debouncedValidateSlug"
                  :loading="checkingSlug"
                  :disabled="checkingSlug"
                  placeholder="your-custom-url"
                  persistent-placeholder
                  maxlength="15"
                >
                  <template v-slot:prepend>
                    <span class="text-body-2 text-grey">
                      {{ baseUrl }}/profile/
                    </span>
                  </template>
                </v-text-field>
                <v-alert
                  v-if="slugError"
                  type="error"
                  dense
                  text
                  class="mt-2"
                >
                  {{ slugError }}
                </v-alert>
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
          v-model="socialFormValid"
          lazy-validation
          @submit.prevent="saveSocials"
        >
          <v-row>
            <v-col cols="6">
              <h2 class="profile-header"><b>SOCIAL ACCOUNTS</b></h2>
            </v-col>

            <v-col cols="6" class="d-flex justify-end">
              <v-btn class="save-btn" @click="saveSocials" :disabled="!socialFormValid">
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
                  :rules="[rules.url]"
                  placeholder="https://github.com/yourusername"
                  clearable
                  @input="validateField('github_url')"
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
                  :rules="[rules.url]"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  clearable
                  @input="validateField('linkedin_url')"
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
                  :rules="[rules.url]"
                  placeholder="https://x.com/yourusername"
                  clearable
                  @input="validateField('twitter_url')"
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
                  :rules="[rules.url]"
                  placeholder="https://discord.gg/yourserver"
                  clearable
                  @input="validateField('discord_url')"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>

          <input type="hidden" name="learner_id" v-model="form.learner_id" />
        </v-form>
        <v-row class="back-button-row">
          <v-col cols="12" class="d-flex align-start">
            <v-btn class="back-button" @click="goBack">
              <v-icon left>mdi-chevron-left</v-icon> Back to Profile
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        top
      >
        {{ snackbar.text }}
      </v-snackbar>
    </v-main>
    <AppFooter />
  </v-app>
</template>


<script>
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { getUserEmail } from "../supabase.js";
import axios from "axios";
import debounce from 'lodash/debounce';
import { getBaseUrl } from '@/utils/urlUtils';

export default {
  name: "EditProfile",
  components: {
    AppHeader,
    AppFooter,
  },
  mounted() {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.onload = this.initializeCloudinary;
    document.head.appendChild(script);
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
        learner_id: "",
        slug: "",
      },
      snackbar: {
        show: false,
        text: '',
        color: '',
      },
      checkingSlug: false,
      slugError: null,
      baseUrl: getBaseUrl(),
      originalSlug: '',
      rules: {
        required: value => !!value || 'Field is required',
        url: value => {
          if (!value) return true;
          const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
          return pattern.test(value) || 'Please enter a valid URL';
        },
        slug: value => /^[a-z0-9-]{1,15}$/.test(value) || 'Slug must be 1-15 characters long and can only contain lowercase letters, numbers, and hyphens',
      }
    };
  },
  async created() {
    this.form.email = await getUserEmail();
    this.initializeFormData();
    this.debouncedValidateSlug = debounce(this.validateSlug, 300);
  },
  methods: {
    validateField(fieldName) {
      this.$refs.socialForm.validate();
      if (this.form[fieldName] && !this.rules.url(this.form[fieldName])) {
        this.form[fieldName] = '';
        this.showSnackbar('Please enter a valid URL', 'error');
      }
    },
    async initializeFormData() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/user`, {
          params: { email: this.form.email },
        });
        console.log("Fetched user data:", response.data);
        if (response.data) {
          const userData = response.data;
          this.form = {
            ...this.form,
            learner_id: userData.learner_id || "",
            profile_photo: userData.profile_photo || "",
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            wallet_address: userData.wallet_address || "",
            one_liner_bio: userData.one_liner_bio || "",
            description: userData.description || "",
            skills: userData.skills ? userData.skills.split(",") : [],
            linkedin_url: userData.linkedin_url || "",
            github_url: userData.github_url || "",
            twitter_url: userData.twitter_url || "",
            discord_url: userData.discord_url || "",
            slug: userData.slug || ""
          };
          this.originalSlug = userData.slug || "";
        }
      } catch (error) {
        console.error("Error initializing form data:", error);
        this.showSnackbar('Error fetching user data', 'error');
      }
    },
    goBack() {
      this.$router.push("/dashboard");
    },
    // Save profile information
    async saveProfile() {
      if (this.$refs.form.validate()) {
        // Validate slug one last time before saving
        await this.validateSlug();
        if (this.slugError) {
          this.showSnackbar('Please fix the profile URL error before saving', 'error');
          return;
        }

        // Ensure the slug meets the requirements
        if (!this.rules.slug(this.form.slug)) {
          this.showSnackbar('Profile URL must be 1-15 characters long and can only contain lowercase letters, numbers, and hyphens', 'error');
          return;
        }

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
            this.showSnackbar('Profile saved successfully!', 'success');
            this.originalSlug = this.form.slug;
            await this.initializeFormData();
          } else {
            this.showSnackbar('Failed to save profile: ' + data.message, 'error');
          }
        } catch (error) {
          //console.error("Save failed", error);
          this.showSnackbar('An error occurred while saving the profile', 'error');
        }
      }
    },
    async saveSocials() {
      if (this.$refs.socialForm.validate()) {
        const socialData = {
          learner_id: this.form.learner_id,
          linkedin_url: this.form.linkedin_url || null,
          github_url: this.form.github_url || null,
          twitter_url: this.form.twitter_url || null,
          discord_url: this.form.discord_url || null,
        };
        const filteredSocialData = Object.fromEntries(
          Object.entries(socialData).filter(([, value]) => value != null)
        );
        try {
          const response = await fetch(
            `${process.env.VUE_APP_LOCAL_SERVER_URL}/api/save-socials`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(filteredSocialData),
            }
          );
          const data = await response.json();
          //console.log("Save socials response:", data);
          if (data.success) {
            this.showSnackbar('Social accounts updated successfully!', 'success');
            await this.initializeFormData();
          } else {
            this.showSnackbar('Failed to update social accounts: ' + data.message, 'error');
          }
        } catch (error) {
          //console.error("Save failed", error);
          this.showSnackbar('An error occurred while updating social accounts', 'error');
        }
      }
    },
    addSkill() {
      //console.log("Add skill clicked");
    },
    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    async updateProfilePhoto(avatarUrl) {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_LOCAL_SERVER_URL}/api/update-profile-photo`,
          {
            learner_id: this.form.learner_id,
            profile_photo_url: avatarUrl,
          }
        );
        console.log(response.data.message);
        this.form.profile_photo = avatarUrl;
      } catch (error) {
        //console.error("Error updating profile photo:", error);
      }
    },
    openUploadModal(type) {
      window.cloudinary
        .openUploadWidget(
          {
            cloud_name: `${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}`,
            upload_preset: `${process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET}`,
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              if (type === "profile_photo") {
                const avatarUrl = result.info.secure_url;
                this.updateProfilePhoto(avatarUrl);
              } else if (type === "profile_banner") {
                this.bannerUrl = result.info.secure_url;
                this.updateProfileBanner();
              } else {
                //console.log("unknown call");
              }
            }
          }
        )
        .open();
    },
    async validateSlug() {
      this.slugError = null;
      if (!this.form.slug) return;

      if (!this.rules.slug(this.form.slug)) {
        this.slugError = 'Profile URL must be 1-15 characters long and can only contain lowercase letters, numbers, and hyphens';
        return;
      }

      if (this.form.slug === this.originalSlug) {
        this.slugError = null;
        return;
      }

      this.checkingSlug = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/check-slug`, {
          params: { slug: this.form.slug }
        });
        if (!response.data.available) {
          this.slugError = 'This profile URL is already taken. Please choose another.';
        }
      } catch (error) {
        //console.error('Error checking slug availability:', error);
        this.slugError = 'An error occurred while checking slug availability. Please try again.';
      } finally {
        this.checkingSlug = false;
      }
    },
    toggleEdit() {
      if (this.isEditing) {
        this.saveSlug();
      } else {
        this.isEditing = true;
      }
    },
    async saveSlug() {
      if (this.form.slug === this.originalSlug) {
        this.isEditing = false;
        return;
      }

      if (!this.rules.slug(this.form.slug)) {
        this.slugError = 'Slug can only contain lowercase letters, numbers, and hyphens';
        return;
      }

      try {
        const response = await axios.post(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/update-slug`, {
          learner_id: this.form.learner_id,
          new_slug: this.form.slug
        });

        if (response.data.success) {
          this.showSnackbar('Profile URL updated successfully!', 'success');
          this.originalSlug = this.form.slug;
          this.slugError = null;
        } else {
          this.slugError = 'Failed to update profile URL. Please try again.';
          this.form.slug = this.originalSlug;
        }
      } catch (error) {
        //console.error('Error updating slug:', error);
        this.slugError = 'An error occurred while updating the profile URL.';
        this.form.slug = this.originalSlug;
      }

      this.isEditing = false;
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

.custom-input ::v-deep .v-field__prepend-inner {
  padding-right: 0;
}

.custom-input ::v-deep .v-field__append-inner {
  cursor: pointer;
}
</style>
