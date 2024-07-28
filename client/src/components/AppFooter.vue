<template>
    <v-footer dark padless>
      <v-container class="py-10">
        <v-row>
          <!-- Navigation columns -->
          <v-col cols="12" sm="6" md="2" lg="2" v-for="(column, index) in columns" :key="index">
            <h3 class="text-h6 font-weight-bold mb-4">{{ column.title }}</h3>
            <ul class="pa-0 footer-links">
                <li v-for="(item, i) in column.items" :key="i">
                    <a href="#" class="footer-link">{{ item }}</a>
                </li>
            </ul>
          </v-col>
  
          <!-- Newsletter subscription -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <h3 class="text-h6 font-weight-bold mb-4">Subscribe to our newsletter</h3>
            <p class="mb-4">The latest news, articles, and resources, sent to your inbox weekly.</p>
            <v-form @submit.prevent="subscribeNewsletter">
              <v-text-field
                v-model="email"
                label="Enter your email"
                outlined
                dense
                dark
                append-outer-icon="mdi-send"
                @click:append-outer="subscribeNewsletter"
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
  
        <!-- Bottom section -->
        <v-row class="mt-10 align-center">
          <v-col cols="12" md="4">
            <v-img src="path/to/learnweb3-logo.png" max-width="150" contain></v-img>
          </v-col>
          <v-col cols="12" md="4" class="text-center text-md-left">
            <span>poapedu</span>
          </v-col>
          <!-- <v-col cols="12" md="4">
            <v-btn v-for="icon in socialIcons" :key="icon.icon" icon :href="icon.link" target="_blank">
              <v-icon>{{ icon.icon }}</v-icon>
            </v-btn>
          </v-col> -->
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script>
  export default {
    data: () => ({
      email: '',
      columns: [
        {
          title: 'Learn',
          items: ['Minis', 'Lessons', 'Courses & Degrees']
        },
        {
          title: 'Opportunities',
          items: ['Hackathons', 'Open Source', 'Events']
        },
        {
          title: 'Community',
          items: ['Leaderboard', 'Credentials', 'Discord', 'My Profile']
        },
        {
          title: 'Resources',
          items: ['Testnet Faucet', 'Level Up']
        },
        {
          title: 'Legal',
          items: ['Privacy Policy', 'Terms and Conditions']
        }
      ],
      socialIcons: [
        { icon: 'mdi-twitter', link: '#' },
        { icon: 'mdi-discord', link: '#' },
        { icon: 'mdi-youtube', link: '#' },
        { icon: 'mdi-github', link: '#' },
        { icon: 'mdi-linkedin', link: '#' },
        { icon: 'mdi-instagram', link: '#' },
        { icon: 'mdi-reddit', link: '#' },
        { icon: 'mdi-facebook', link: '#' }
      ]
    }),
    methods: {
      subscribeNewsletter() {
        // Implement newsletter subscription logic here
        console.log('Subscribing:', this.email);
      }
    }
  }
  </script>
  
  <style scoped>
    .v-footer {
    background-color: #dbdbdb !important;
    }

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