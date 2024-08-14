<template>
  <div class="profile-header">
    <v-parallax :src="bannerUrl" class="profile-bg"></v-parallax>
    <v-container>
      <v-row>
        <v-col cols="12" class="profile-info pa-0">
          <v-avatar v-if="isEditProfilePage" size="120" class="profile-avatar">
            <v-img src="../assets/profile-picture.jpeg"></v-img>
          </v-avatar>
          <v-avatar v-else size="120" class="profile-avatar">
            <v-img :src="avatarUrl"></v-img>
          </v-avatar>
          
          <v-btn v-if="isEditProfilePage" class="edit-profile-btn" color="secondary" text small @click="goToEditProfile">
            <v-icon left small>mdi-pencil</v-icon>
            Edit Profile
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7" class="profile-info pa-0 mt-5">
          <div class="profile-details ml-4">
            <h2 class="text-h4 font-weight-bold mb-1">{{ name }}</h2>
            <p class="text-subtitle-1 mb-2">{{ bio }}</p>
            <div>
              <v-chip v-for="skill in skills" :key="skill" class="mr-2 mb-2 skill-badges" small>
                {{ skill }}
              </v-chip>
            </div>
          </div>
        </v-col>
        <v-col cols="5" class="profile-info pa-0 mt-5">
          <div class="profile-details ml-2">
            <v-text-field
              v-if="publicProfileUrl != 'http://localhost:8080/profile/undefined'"
              :loading="isLoading"
              :value="publicProfileUrl"
              readonly 
              variant="solo"
              hide-details
              single-line
              disabled
              class="mb-2"
            >
              <template v-slot:append-inner>
                <v-icon @click="copyUrl">mdi-content-copy</v-icon>
              </template>
            </v-text-field>

            <p class="text-subtitle-1 mb-2">
              <v-icon color="#000" left small>mdi-email</v-icon> {{ userEmail }}
            </p>
            <div>
              <v-row class="mt-2 d-flex flex-wrap ga-3 ml-1">
                <v-icon
                  v-for="icon in socialIcons"
                  :key="icon.name"
                  :color="icon.color"
                  :icon="icon.icon"
                  size="large"
                  class="profile-icon"
                ></v-icon>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar">
        {{ snackbarText }}
        <template v-slot:actions>
          <v-btn color="blue" text @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
import { supabase } from '@/supabase'

export default {
  name: 'ProfileHeader',
  data() {
    return {
      userEmail: '',
      userData: null,
      isAuthenticated: false,
      isLoading: false,
      name: '',
      bio: '',
      skills: [],
      bannerUrl: 'https://placekitten.com/2500/800',
      avatarUrl: 'https://eu.ui-avatars.com/api/?name=John+Doe&size=250',
      user: {},
      snackbar: false,
      snackbarText: '',
      imagePreview: '../assets/profile-picture.jpeg',
      learnerId: 1,
      socialIcons: [
        { name: 'github', icon: 'mdi-github', color: 'green-darken-2' },
        { name: 'linkedin', icon: 'mdi-linkedin', color: 'blue-darken-2' },
        { name: 'twitter', icon: 'mdi-twitter', color: 'purple-darken-2' },
        { name: 'dev', icon: 'mdi-dev-to', color: 'teal-darken-2' },
      ],
    }
  },
  computed: {
    publicProfileUrl() {
      return `${window.location.origin}/profile/${this.user.username}`
    },
    isDashboard() {
      return this.$route.path.includes('dashboard')
    },
    isEditProfilePage() {
      return this.$route.path.includes('edit-profile')
    }
  },
  created() {
    console.log('Component created')
    this.checkAuthAndFetchData()
  },
  methods: {
    async checkAuthAndFetchData() {
      //console.log('checkAuthAndFetchData called')
      try {
        //console.log('Checking user authentication...')
        const { data: { user } } = await supabase.auth.getUser()
        //console.log('User data from Supabase:', user)

        if (user) {
          //console.log('User is authenticated')
          this.isAuthenticated = true
          this.userEmail = user.email
          
          try {
            console.log('Fetching user data from API...')
            axios.post(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/learners/check-email`, {
              email: user.email
            }).then(response => {
              //console.log('User data:', response.data);
              this.userData = response.data;
              this.learnerId = response.data.learner_id;
              this.name = response.data.first_name + " " + response.data.last_name;
              this.bio = response.data.one_liner_bio;
              this.avatarUrl = response.data.profile_photo;
              this.bannerUrl = response.data.profile_banner;

              if(this.userData.first_name == null || this.userData.last_name == null) {
                this.$store.dispatch('updateDbData', JSON.stringify(this.userData));
                this.$router.push('/edit-profile');
              } else {
                console.log(JSON.stringify(response.data));
                console.log('user profile data available');
              }

            })
            .catch(error => {
              console.error('Error fetching user data:', error.response ? error.response.data : error.message);
              if (error.response && error.response.status === 404) {
                console.log('User not found, creating new user')
                this.createNewUser(user);
              } else {
                throw error
              }
            });
            
          } catch (error) {
            console.error('Error fetching user data:', error)
            
          }
        } else {
          console.log('User not authenticated, redirecting to login')
          this.$router.push('/')
        }
      } catch (error) {
        console.error('Error in checkAuthAndFetchData:', error)
      } finally {
        this.isLoading = false
      }
    },
    async createNewUser(user) {
      console.log('Creating new user...')
      try {
        const response = await axios.post(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/learners`, {
          email: user.email,
          app_metadata: JSON.stringify(user.app_metadata),
          aud: user.aud,
          confirmation_sent_at: user.confirmation_sent_at,
          confirmed_at: user.confirmed_at,
          email_confirmed_at: user.email_confirmed_at,
          id: user.id,
          identities: JSON.stringify(user.identities[0]),
          is_anonymous: user.is_anonymous,
          last_sign_in_at: user.last_sign_in_at,
          phone: user.phone,
          recovery_sent_at: user.recovery_sent_at,
          role: user.role,
          user_metadata: JSON.stringify(user.user_metadata)
        })
        console.log('New user created:', response.data)
        this.userData = response.data
      } catch (error) {
        console.error('Error creating new user:', error)
      }
    },
    goToEditProfile() {
      this.$router.push('/edit-profile')
    },
    copyUrl() {
      navigator.clipboard.writeText(this.publicProfileUrl).then(() => {
        this.snackbarText = 'URL copied to clipboard!'
        this.snackbar = true
      }, (err) => {
        console.error('Could not copy text: ', err)
      })
    },
    async updateProfilePhoto() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/update-profile-photo`, {
          learner_id: this.learnerId,
          profile_photo_url: this.avatarUrl
        })
        console.log(response.data.message)
      } catch (error) {
        console.error('Error updating profile photo:', error)
      }
    },
    async updateProfileBanner() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/update-profile-banner`, {
          learner_id: this.learnerId,
          profile_banner_url: this.bannerUrl
        })
        console.log(response.data.message)
      } catch (error) {
        console.error('Error updating profile banner:', error)
      }
    },
    openUploadModal(type) {
      window.cloudinary.openUploadWidget(
        { 
          cloud_name: `${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}`,
          upload_preset: `${process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET}`
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            if(type === "profile_photo") {
              this.avatarUrl = result.info.secure_url
              this.updateProfilePhoto()
            } else if(type === "profile_banner") {
              this.bannerUrl = result.info.secure_url
              this.updateProfileBanner()
            } else {
              console.log('unknown call')
            }
          }
        }
      ).open()
    }
  }
}
</script>

<style scoped>
.profile-header {
  position: relative;
  margin-bottom: 60px;
}

.banner {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.profile-info {
  position: relative;
  margin-top: -60px;
  display: flex;
  align-items: flex-end;
}

.profile-avatar {
  border: 4px solid white;
}

.profile-details {
  flex-grow: 1;
}

.edit-profile-btn {
  position: absolute;
  top: 70px;
  right: 16px;
}

.skill-badges {
  background-color: #6BA1B4;
  color: #fff;
}

.profile-bg {
  max-height: 350px;
  background-size: cover;
}

.profile-icon {
  background: #BFD9E2;
  padding: 20px;
  border: 1px solid #403A32;
  border-radius: 10%;
}

.url-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.url-container input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 5px;
}

.profile-avatar {
  position: relative;
}

.profile-avatar .v-img {
  cursor: pointer;
}
</style>