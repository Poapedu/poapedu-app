<template>
  <v-container fluid class="pa-5 mt-10 skills-container" v-if="!loading">

    <h2 class="mb-4" style="font-weight:900;">SKILLS</h2>

    <!-- No skills notice -->
    <v-alert
      v-if="userSkills.length === 0"
      type="info"
      outlined
      prominent
      class="mb-4"
    >
      <v-row align="center">
        <v-col class="grow">You haven't added any skills yet. Start your journey by completing courses and earning certifications!</v-col>
        <v-col class="shrink text-right">
          <v-btn
            color="info"
            @click="scrollToPartners"
          >
            Explore Learning Paths
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
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
                <!-- <v-btn 
                  :color="item.color" 
                  :disabled="item.disabled" 
                  block 
                  height="60"
                  style="padding:0px !important;"
                > -->
                  <v-img 
                    v-if="item.image" 
                    :src="item.image"
                    :class="{ 'greyed-out': item.disabled }"
                    height="60" 
                    width="60" 
                    contain
                    :alt="item.skill"
                    :title="item.skill"
                  ></v-img>
                  <span v-else>{{ item.text }}</span>
                <!-- </v-btn> -->
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

  <v-container fluid class="pa-5 mt-10 oc-container" ref="partnersSection">
    <h2 class="mb-4" style="font-weight:900;">YOU MAY ALSO LIKE</h2>
    <p class="mb-4">Enhance your skill set and earn valuable certifications from our trusted partners. Explore the exciting learning opportunities below to accelerate your career growth!</p>
    <v-row>
      <v-col cols="6">
        <a href="https://www.hackquest.io/en/?ref=poapedu">
          <v-img aspect-ratio="16/9" cover :src="HackQuestOCP" alt="Earn certificates issued by leading Web3 ecosystems" title="Earn certificates issued by leading Web3 ecosystems"></v-img>
        </a>
      </v-col>
      <v-col cols="6">
        <a href="https://www.newcampus.com/?ref=poapedu">
          <v-img aspect-ratio="16/9" cover :src="NewCampusOCP" alt="Empowering Southeast Asia’s startups to scale sustainably" title="Empowering Southeast Asia’s startups to scale sustainably"></v-img>
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from 'axios';
import HackQuestOCP from '@/assets/hackquest-partner.png';
import NewCampusOCP from '@/assets/new-campus-partner.png';

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
            { color: 'red', image: this.getRandomBadgeImage(), skill: 'HTML' },
            { color: 'blue', image: this.getRandomBadgeImage(), skill: 'CSS' },
            { color: 'yellow', image: this.getRandomBadgeImage(), skill: 'JavaScript' },
            { color: 'green', image: this.getRandomBadgeImage(), skill: 'React' },
            { color: 'teal', image: this.getRandomBadgeImage(), skill: 'Node.js' },
            { color: 'orange', image: this.getRandomBadgeImage(), skill: 'SQL' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
          ]
        },
        { 
          title: 'WEB3 DEV', 
          subtitle: '',
          gridItems: [
            { color: 'purple', image: this.getRandomBadgeImage(), skill: 'Solidity' },
            { color: 'indigo', image: this.getRandomBadgeImage(), skill: 'Ethereum' },
            { color: 'deep-purple', image: this.getRandomBadgeImage(), skill: 'Smart Contracts' },
            { color: 'blue-grey', image: this.getRandomBadgeImage(), skill: 'Web3.js' },
            { color: 'light-blue', image: this.getRandomBadgeImage(), skill: 'Blockchain' },
            { color: 'cyan', image: this.getRandomBadgeImage(), skill: 'Cryptography' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
          ]
        },
        {
          title: 'DATA SCIENCE',
          subtitle: '',
          gridItems: [
            { color: 'blue', image: this.getRandomBadgeImage(), skill: 'Data Retrieval' },
            { color: 'green', image: this.getRandomBadgeImage(), skill: 'Data Cleaning' },
            { color: 'purple', image: this.getRandomBadgeImage(), skill: 'Exploratory Data Analysis' },
            { color: 'orange', image: this.getRandomBadgeImage(), skill: 'Feature Engineering' },
            { color: 'red', image: this.getRandomBadgeImage(), skill: 'Machine Learning' },
            { color: 'teal', image: this.getRandomBadgeImage(), skill: 'Predictive Analytics' },
            { color: 'indigo', image: this.getRandomBadgeImage(), skill: 'Statistical Analysis' },
            { color: 'deep-purple', image: this.getRandomBadgeImage(), skill: 'Python' },
            { color: 'light-blue', image: this.getRandomBadgeImage(), skill: 'SQL' },
            { color: 'amber', image: this.getRandomBadgeImage(), skill: 'Data Visualization' },
            { color: 'brown', image: this.getRandomBadgeImage(), skill: 'Version Control' },
            { color: 'cyan', image: this.getRandomBadgeImage(), skill: 'Deep Learning' },
            { color: 'pink', image: this.getRandomBadgeImage(), skill: 'NLP' },
            { color: 'light-green', image: this.getRandomBadgeImage(), skill: 'Time Series Analysis' },
            { color: 'deep-orange', image: this.getRandomBadgeImage(), skill: 'A/B Testing' },
            { color: 'blue-grey', image: this.getRandomBadgeImage(), skill: 'Cloud Computing' },
            { color: 'yellow', image: this.getRandomBadgeImage(), skill: 'Data Storytelling' },
            { color: 'grey', image: this.getRandomBadgeImage(), skill: 'Model Deployment' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
            // { disabled: true, text: '🔒' },
          ]
        },
      ],
      userSkills: [],
      HackQuestOCP,
      NewCampusOCP
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
        //console.log('total skills', totalSkills);
        const userSkillsInCategory = category.gridItems.filter(item => 
          item.skill && this.userHasSkill(item.skill)
        ).length;
        //console.log(userSkillsInCategory);
        category.subtitle = `${userSkillsInCategory}/${totalSkills}`;
      });
    },
    async fetchUserSkills() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/skills/${this.learnerId}`);
        this.userSkills = response.data.skills;
        if (this.userSkills.length === 0) {
          console.log('No skills found for this user');
        }
        this.updateGridItems();
        this.updateCategorySubtitles();
      } catch (error) {
        console.error('Error fetching user skills:', error);
        this.userSkills = []; // Set to empty array in case of error
      } finally {
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
    },
    getRandomBadgeImage() {
      const elements = ['fire', 'lightning', 'nature', 'water'];
      const types = ['arrows', 'bow', 'icon', 'lamp', 'magehat', 'wand'];
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return require(`@/assets/badges/badge_${randomElement}_${randomType}.png`);
    },
    scrollToPartners() {
      const partnersSection = this.$refs.partnersSection;
      if (partnersSection) {
        partnersSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
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
.skills-container, .oc-container {
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
.greyed-out {
  filter: grayscale(100%) opacity(50%);
}
.oc-container p {
  font-size: 1.1em;
  line-height: 1.5;
  color: #333;
}
</style>