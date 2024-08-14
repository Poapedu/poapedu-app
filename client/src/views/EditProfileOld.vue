<template>
  <v-app>
    <AppHeader />
    <v-main class="grey lighten-4">
      <v-container>
        <v-form
          class="mt-10 py-10 px-10"
          ref="form"
          style="background-color: #ded2c4; border-radius: 5px"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col cols="8">
              <h2 class="mt-2">PROFILE DETAILS</h2>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <v-btn color="#EAE1D7" rounded="xl" @click="saveProfile">
                <v-icon left>mdi-floppy</v-icon>
                Save Changes
              </v-btn>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="d-flex align-center">
              <v-img
                v-if="form.profile_photo"
                :src="form.profile_photo"
                max-width="100"
                height="100"
                class="mt-3 rounded-circle"
                @click="openUploadModal('profile_photo')"
              ></v-img>
              <v-img
                v-else
                src="https://via.placeholder.com/100"
                max-width="100"
                height="100"
                class="mt-3 rounded-circle"
              ></v-img>
              <v-btn color="#EAE1D7" @click="openUploadModal('profile_photo')"
                >Upload Image</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.first_name"
                label="First Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.last_name"
                label="Last Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="Email"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.wallet_address"
                label="Wallet Address"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.one_liner_bio"
                label="One Liner Bio"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                rows="5"
              ></v-textarea>
            </v-col>
            <!-- <v-col cols="12">
                            <v-text-field
                                v-model="form.slug"
                                label="Slug"
                                :rules="[rules.required, rules.uniqueSlug]"
                                @change="checkSlugUniqueness"
                            ></v-text-field>
                        </v-col> -->
            <v-col cols="12" md="6">
              <v-btn color="primary" @click="openUploadModal('profile_banner')"
                >Add a Profile Banner</v-btn
              >
              <v-img
                :src="form.profile_banner"
                class="mt-3"
                max-height="200"
              ></v-img>
            </v-col>

            <input type="hidden" name="userID" v-model="form.userID" />
          </v-row>
        </v-form>

        <v-form
          class="mt-10 socialForm py-10 px-10"
          style="background-color: #ded2c4; border-radius: 5px"
          ref="socialForm"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col cols="8">
              <h2 class="mt-2">SOCIAL ACCOUNTS</h2>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <v-btn color="#EAE1D7" rounded="xl" @click="saveSocials">
                <v-icon left>mdi-floppy</v-icon>
                Save Changes
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <!-- LinkedIn URL -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.linkedin_url"
                label="LinkedIn URL"
                :rules="[rules.required, rules.linkedin]"
              ></v-text-field>
            </v-col>

            <!-- Twitter URL -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.twitter_url"
                label="Twitter URL"
                :rules="[rules.required, rules.twitter]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <!-- Discord URL -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.discord_url"
                label="Discord URL"
                :rules="[rules.discord]"
              ></v-text-field>
            </v-col>

            <!-- GitHub URL -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.github_url"
                label="GitHub URL"
                :rules="[rules.github]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <!-- Dev.to URL -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.devto_url"
                label="Dev.to URL"
                :rules="[rules.devto]"
              ></v-text-field>
            </v-col>

            <!-- Website URL -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.website_url"
                label="Website URL"
                :rules="[rules.url]"
              ></v-text-field>
            </v-col>
          </v-row>
          <input type="hidden" name="userID" v-model="socialForm.userID" />
        </v-form>
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import axios from "axios";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
export default {
  name: "EditProfile",
  components: {
    AppHeader,
    AppFooter,
  },
  computed: {
    dbData() {
      return this.$store.getters.dbData;
    },
  },
  created() {
    console.log(this.dbData);
    const userData = JSON.parse(this.dbData);
    Object.keys(this.form).forEach((key) => {
      if (Object.hasOwn(userData, key)) {
        this.form[key] = userData[key];
      }
    });
  },
  mounted() {
    // Dynamically load the Cloudinary script
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.onload = this.initializeCloudinary;
    document.head.appendChild(script);
  },
  data() {
    const userData = JSON.parse(this.$store.getters.dbData);
    console.log(userData.profile_photo);
    console.log(userData.profile_banner);
    return {
      valid: false,
      bannerUrl: "",
      avatarUrl: "",
      learnerId: userData.learner_id,
      form: {
        email: userData.email || "",
        wallet_address: userData.wallet_address || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        profile_photo:
          userData.profile_photo &&
          userData.profile_photo.trim() !== "" &&
          userData.profile_photo.trim() != null
            ? userData.profile_photo
            : "https://eu.ui-avatars.com/api/?name=poapedu&size=250",
        profile_banner:
          userData.profile_banner &&
          userData.profile_banner.trim() !== "" &&
          userData.profile_banner.trim() != null
            ? userData.profile_banner
            : "https://placehold.co/600x400/png?text=poapedu",
        one_liner_bio:
          userData.one_liner_bio && userData.one_liner_bio.trim() !== ""
            ? userData.one_liner_bio
            : "",
        description:
          userData.description && userData.description.trim() !== ""
            ? userData.description
            : "",
        userID: userData.learner_id ? userData.learner_id : 1,
        slug: userData.slug || "",
      },
      socialForm: {
        linkedin_url:
          userData.linkedin_url && userData.linkedin_url.trim() !== ""
            ? userData.linkedin_url
            : "",
        twitter_url:
          userData.twitter_url && userData.twitter_url.trim() !== ""
            ? userData.twitter_url
            : "",
        discord_url:
          userData.discord_url && userData.discord_url.trim() !== ""
            ? userData.discord_url
            : "",
        github_url:
          userData.github_url && userData.github_url.trim() !== ""
            ? userData.github_url
            : "",
        devto_url:
          userData.devto_url && userData.devto_url.trim() !== ""
            ? userData.devto_url
            : "",
        website_url:
          userData.website_url && userData.website_url.trim() !== ""
            ? userData.website_url
            : "",
        userID: userData.learner_id ? userData.learner_id : 1,
      },
      rules: {
        required: (value) => !!value || "Required.",
        url: (value) =>
          /^(ftp|http|https):\/\/[^ "]+$/.test(value) || "URL must be valid.",
        linkedin: (value) =>
          !value ||
          /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(value) ||
          "Must be a valid LinkedIn URL.",
        twitter: (value) =>
          !value ||
          /^(https?:\/\/)?(www\.)?twitter\.com\/.*$/.test(value) ||
          "Must be a valid Twitter URL.",
        discord: (value) =>
          !value ||
          /^(https?:\/\/)?(www\.)?discord\.com\/.*$/.test(value) ||
          "Must be a valid Discord URL.",
        github: (value) =>
          !value ||
          /^(https?:\/\/)?(www\.)?github\.com\/.*$/.test(value) ||
          "Must be a valid GitHub URL.",
        devto: (value) =>
          !value ||
          /^(https?:\/\/)?(www\.)?dev\.to\/.*$/.test(value) ||
          "Must be a valid Dev.to URL.",
        // uniqueSlug: () => this.slugUnique === undefined
        // ? 'Checking uniqueness...'
        // : this.slugUnique || 'Slug is already taken. Try another one.',
      },
      slugUnique: undefined,
    };
  },
  methods: {
    goBack() {
      this.$router.push("/dashboard");
    },
    async handleFileChange(field) {
      const file = this[field + "File"];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          this.form[field] = data.path; // Update the form with the uploaded file path
        }
      } catch (error) {
        console.error("File upload failed", error);
      }
    },
    async checkSlugUniqueness() {
      if (!this.form.slug) {
        this.slugUnique = undefined;
        return;
      }

      try {
        const response = await fetch(
          `${
            process.env.VUE_APP_LOCAL_SERVER_URL
          }/api/check-slug?slug=${encodeURIComponent(this.form.slug)}`
        );
        const data = await response.json();
        this.slugUnique = data.unique; // Assuming the API returns { unique: true/false }
        this.$refs.form.validate(); // Trigger validation to update the UI
      } catch (error) {
        console.error("Slug uniqueness check failed", error);
        this.slugUnique = false;
      }
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
              body: JSON.stringify(this.socialForm),
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
    async updateProfilePhoto() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_LOCAL_SERVER_URL}/api/update-profile-photo`,
          {
            learner_id: this.learnerId,
            profile_photo_url: this.avatarUrl,
          }
        );
        console.log(response.data.message);
      } catch (error) {
        console.error("Error updating profile photo:", error);
      }
    },
    async updateProfileBanner() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_LOCAL_SERVER_URL}/api/update-profile-banner`,
          {
            learner_id: this.learnerId,
            profile_banner_url: this.bannerUrl,
          }
        );
        console.log(response.data.message);
      } catch (error) {
        console.error("Error updating profile banner:", error);
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
                this.avatarUrl = result.info.secure_url;
                this.updateProfilePhoto();
              } else if (type === "profile_banner") {
                this.bannerUrl = result.info.secure_url;
                this.updateProfileBanner();
              } else {
                console.log("unknown call");
              }
            }
          }
        )
        .open();
    },
  },
};
</script>
