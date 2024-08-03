<template>
    <div class="profile-header">
      <v-parallax src="../assets/profile-bg.jpeg" class="profile-bg"></v-parallax>
      <v-container>
        <v-row>
          <v-col cols="12" class="profile-info pa-0">
            <v-avatar size="120" class="profile-avatar">
              <v-img src="../assets/profile-picture.jpeg"></v-img>
            </v-avatar>
            <v-btn class="edit-profile-btn" color="secondary" text small @click="goToEditProfile">
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
                <div class="profile-details ml-4">

                  <p class="text-subtitle-1 mb-2">
                    <v-icon color="#000" left small>mdi-email</v-icon> firstlastname@gmail.com</p>
                  <div>
                    <v-row class="mt-2 d-flex flex-wrap ga-3 ml-1">
                      <v-icon
                        color="green-darken-2"
                        icon="mdi-github"
                        size="large"
                        class="profile-icon"
                      ></v-icon>

                      <v-icon
                        color="blue-darken-2"
                        icon="mdi-linkedin"
                        size="large"
                        class="profile-icon"
                      ></v-icon>

                      <v-icon
                        color="purple-darken-2"
                        icon="mdi-twitter"
                        size="large"
                        class="profile-icon"
                      ></v-icon>

                      <v-icon
                        color="teal-darken-2"
                        icon="mdi-dev-to"
                        size="large"
                        class="profile-icon"
                      ></v-icon>
                    </v-row>
                  </div>
                </div>
            </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProfileHeader',
    data: () => ({
      name: 'Firstname Lastname',
      bio: 'One liner about what I do and where I work',
      skills: ['Skill tag #1', 'Skill tag #2', 'Skill tag #3', 'Skill tag #4'],
      bannerUrl: 'https://placekitten.com/2500/800',
      avatarUrl: 'https://eu.ui-avatars.com/api/?name=John+Doe&size=250'
    }),
    methods: {
      goToEditProfile() {
        this.$router.push('/edit-profile');
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
  </style>