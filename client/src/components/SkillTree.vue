<template>
  <v-container fluid class="pa-5 mt-10 skills-container" v-if="!loading">
    <v-row>
      <!-- Left sidebar -->
      <v-col cols="3">
        <v-card color="#EAE1D7" class="mb-3" v-for="(item, index) in sidebarItems" :key="index" @click="selectCategory(item)">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div class="category-title">
              <v-card-title class="mt-1 text-h6 font-weight-black" v-html="formatCategoryTitle(item.title)">
              </v-card-title>
            </div>
            <div class="d-flex mt-10 mr-3 justify-center">
              <p class="text-h6 font-weight-black" color="#000">{{ item.subtitle }}</p>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Main content area -->
      <v-col cols="9">
        <v-card flat class="main-card">
          <v-card-title class="d-flex justify-space-between align-center">
            <v-btn icon @click="previousCategory" :disabled="selectedIndex === 0">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span>{{ selectedCategory.title }}</span>
            <v-btn icon @click="nextCategory" :disabled="selectedIndex === sidebarItems.length - 1">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
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
  <v-container v-else>
    <v-row justify="center" align="center" style="height: 100vh;">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from 'axios';

export default {
  name: 'SkillTree',
  computed: {
    ...mapState(["dbData", "hasFilled"]),

    // Safely handle potential null or undefined values
    learnerId() {
      return this.dbData?.learner_id || "";
    },
    selectedCategory() {
      return this.sidebarItems[this.selectedIndex];
    },
  },
  data() {
    return {
      selectedIndex: 0,
      loading: true,
      sidebarItems: [
        { 
          title: 'WEB DEV', 
          subtitle: '',
          gridItems: [
            { color: 'red', icon: 'mdi-language-html5', skill: 'HTML' },
            { color: 'blue', icon: 'mdi-language-css3', skill: 'CSS' },
            { color: 'yellow', icon: 'mdi-language-javascript', skill: 'JavaScript' },
            { color: 'green', icon: 'mdi-react', skill: 'React' },
            { color: 'teal', icon: 'mdi-nodejs', skill: 'Node.js' },
            { color: 'orange', icon: 'mdi-database', skill: 'SQL' },
            { disabled: true, text: '🔒' },
            { disabled: true, text: '🔒' },
          ]
        },
        { 
          title: 'WEB3 DEV', 
          subtitle: '',
          gridItems: [
            { color: 'purple', icon: 'mdi-ethereum', skill: 'Solidity' },
            { color: 'indigo', icon: 'mdi-ethereum', skill: 'Ethereum' },
            { color: 'deep-purple', icon: 'mdi-file-document-outline', skill: 'Smart Contracts' },
            { color: 'blue-grey', icon: 'mdi-web', skill: 'Web3.js' },
            { color: 'light-blue', icon: 'mdi-cube-outline', skill: 'Blockchain' },
            { color: 'cyan', icon: 'mdi-shield-key-outline', skill: 'Cryptography' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
          ]
        },
        {
          title: 'DATA SCIENCE',
          subtitle: '',
          gridItems: [
            { color: 'blue', icon: 'mdi-database-search', skill: 'Data Retrieval' },
            { color: 'green', icon: 'mdi-broom', skill: 'Data Cleaning' },
            { color: 'purple', icon: 'mdi-chart-bar', skill: 'Exploratory Data Analysis' },
            { color: 'orange', icon: 'mdi-cog', skill: 'Feature Engineering' },
            { color: 'red', icon: 'mdi-brain', skill: 'Machine Learning' },
            { color: 'teal', icon: 'mdi-chart-line', skill: 'Predictive Analytics' },
            { color: 'indigo', icon: 'mdi-calculator-variant', skill: 'Statistical Analysis' },
            { color: 'deep-purple', icon: 'mdi-language-python', skill: 'Python' },
            { color: 'light-blue', icon: 'mdi-database', skill: 'SQL' },
            { color: 'amber', icon: 'mdi-chart-areaspline', skill: 'Data Visualization' },
            { color: 'brown', icon: 'mdi-git', skill: 'Version Control' },
            { color: 'cyan', icon: 'mdi-atom', skill: 'Deep Learning' },
            { color: 'pink', icon: 'mdi-text', skill: 'NLP' },
            { color: 'light-green', icon: 'mdi-clock-outline', skill: 'Time Series Analysis' },
            { color: 'deep-orange', icon: 'mdi-ab-testing', skill: 'A/B Testing' },
            { color: 'blue-grey', icon: 'mdi-cloud', skill: 'Cloud Computing' },
            { color: 'yellow', icon: 'mdi-account-voice', skill: 'Data Storytelling' },
            { color: 'grey', icon: 'mdi-rocket-launch', skill: 'Model Deployment' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
          ]
        },
      ],
      userSkills: []
    }
  },
  methods: {
    selectCategory(category) {
      this.selectedIndex = this.sidebarItems.findIndex(item => item.title === category.title);
    },
    previousCategory() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    nextCategory() {
      if (this.selectedIndex < this.sidebarItems.length - 1) {
        this.selectedIndex++;
      }
    },
    userHasSkill(skill) {
      return this.userSkills.some(userSkill => 
        userSkill.toLowerCase().trim() === skill.toLowerCase().trim()
      );
    },
    updateCategorySubtitles() {
      this.sidebarItems.forEach(category => {
        const totalSkills = category.gridItems.filter(item => item.skill).length;
        console.log('total skills', totalSkills);
        const userSkillsInCategory = category.gridItems.filter(item => 
          item.skill && this.userHasSkill(item.skill)
        ).length;
        console.log(userSkillsInCategory);
        category.subtitle = `${userSkillsInCategory}/${totalSkills}`;
      });
    },
    async fetchUserSkills() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/skills/${this.learnerId}`);
        this.userSkills = response.data.skills;
        this.updateGridItems();
        this.updateCategorySubtitles();
        this.loading = false;
      } catch (error) {
        console.error('Error fetching user skills:', error);
        this.loading = false;
      }
    },
    updateGridItems() {
      this.sidebarItems.forEach(category => {
        category.gridItems.forEach(item => {
          if (item.skill) {
            const hasSkill = this.userHasSkill(item.skill);
            item.disabled = !hasSkill;
            item.color = hasSkill ? item.color : 'grey';
          }
        });
      });
    },
    formatCategoryTitle(title) {
      const words = title.split(' ');
      if (words.length > 1) {
        return words.join('<br>');
      }
      return title;
    }
  },
  created() {
    this.$watch(
      () => this.learnerId,
      (newLearnerId) => {
        if (newLearnerId) {
          this.fetchUserSkills();
        }
      },
      { immediate: true }
    );
  }
}
</script>

<style>
.skills-container {
  background: #ddd2c4;
  padding: 25px;
  border-radius: 10px;
}
.category-title {
  flex-grow: 1;
  max-width: 70%;
}
.v-card-title {
  word-break: break-word;
  line-height: 1.2;
}
</style>