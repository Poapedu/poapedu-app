<template>
    <!-- <v-container class="skills-container mb-6 mt-10">
      <v-row>
        <v-col cols="12" md="4">
          <v-card color="#EAE1D7" class="mb-3" v-for="skill in skills" :key="skill.name">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="mt-1 text-h4 font-weight-black" v-html="skill.name">
                </v-card-title>
              </div>
              <div class="d-flex mt-10 mr-3 justify-center">
                <p class="text-h4 font-weight-black" color="#000">{{ skill.progress }}</p>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Learn The Basics</v-card-title>
            <v-carousel hide-delimiters>
              <v-carousel-item v-for="n in 5" :key="n">
                <v-sheet height="100%" tile>
                  <v-row class="fill-height" align="center" justify="center">
                    <v-col class="text-center">
                      <h3 class="mb-4">Lesson {{ n }}</h3>
                      <v-btn color="primary">Start</v-btn>
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </v-col>
      </v-row>
    </v-container> -->
    <v-container fluid class="pa-0 main-container">
      <v-row no-gutters>
        <!-- Left sidebar -->
        <v-col cols="3">
          <v-card color="#EAE1D7" class="mb-3" v-for="skill in skills" :key="skill.name">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="mt-1 text-h4 font-weight-black" v-html="skill.name">
                </v-card-title>
              </div>
              <div class="d-flex mt-10 mr-3 justify-center">
                <p class="text-h4 font-weight-black" color="#000">{{ skill.progress }}</p>
              </div>
            </div>
          </v-card>

          <v-list dense>
            <v-list-item 
              v-for="(item, index) in sidebarItems" 
              :key="index"
              @click="selectCategory(item)"
              :class="{ 'v-list-item--active': item.title === selectedCategory.title }"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Main content area -->
        <v-col cols="9">
          <v-card flat class="main-card">
            <v-card-title class="d-flex justify-space-between align-center">
              <v-btn icon><v-icon>mdi-chevron-left</v-icon></v-btn>
              <span>{{ selectedCategory.title }}</span>
              <v-btn icon><v-icon>mdi-chevron-right</v-icon></v-btn>
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col v-for="(item, index) in selectedCategory.gridItems" :key="index" cols="2">
                  <v-btn 
                    :color="item.color" 
                    :disabled="item.disabled" 
                    block 
                    height="60"
                  >
                    <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                    <span v-else>{{ item.text }}</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'SkillTree',
    computed: {
      selectedCategory() {
        return this.sidebarItems[this.selectedIndex];
      }
    },
    data() {
      return {
        selectedIndex: 0,
        sidebarItems: [
          { 
            title: 'WEB DEV', 
            subtitle: '2/42',
            gridItems: [
              { color: 'red', icon: 'mdi-television' },
              { color: 'yellow', icon: 'mdi-exit-to-app' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              // ... add more items for WEB DEV
            ]
          },
          { 
            title: 'WEB 3 DEV', 
            subtitle: '8/51',
            gridItems: [
              { color: 'blue', icon: 'mdi-ethereum' },
              { color: 'green', icon: 'mdi-bitcoin' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              // ... add more items for WEB 3 DEV
            ]
          },
          { 
            title: 'DATA ANALYST', 
            subtitle: '26/123',
            gridItems: [
              { color: 'purple', icon: 'mdi-chart-bar' },
              { color: 'cyan', icon: 'mdi-database' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              // ... add more items for DATA ANALYST
            ]
          },
          { 
            title: 'DATA SCIENTIST', 
            subtitle: '6/84',
            gridItems: [
              { color: 'deep-purple', icon: 'mdi-atom' },
              { color: 'indigo', icon: 'mdi-math-compass' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              { disabled: true, text: '🔒' },
              // ... add more items for DATA SCIENTIST
            ]
          },
        ],
      }
    },
    methods: {
      addNewSkill() {
        // Implement logic to add a new skill
      },
      selectCategory(category) {
        this.selectedIndex = this.sidebarItems.findIndex(item => item.title === category.title);
      }
    },
    mounted() {
      // Set the initial selected category
      this.selectedCategory = this.sidebarItems[0];
    }
  }
  </script>

  <style>
  .skills-container {
    background: #ddd2c4;
    padding: 25px;
    border-radius: 10px;
  }
  </style>