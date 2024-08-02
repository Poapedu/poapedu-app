<template>
    <v-container class="skills-container mb-6 mt-10">
      <v-row>
        <v-col cols="12" md="4">
          <v-card color="#EAE1D7" class="mb-3" v-for="skill in skills" :key="skill.name">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="mt-1 text-h4 font-weight-black" v-html="skill.name">
                </v-card-title>
              </div>
              <div class="d-flex mt-10 mr-3 justify-center">
                <p class="text-h3 font-weight-black" color="#000">{{ skill.progress }}</p>
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
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'SkillTree',
    data: () => ({
      skills: [
        { name: 'WEB<br>DEV', progress: '12/42' },
        { name: 'WEB3<br>DEV', progress: '8/51' },
        { name: 'DATA<br>ANALYST', progress: '26/123' },
        { name: 'DATA<br>SCIENTIST', progress: '8/84' },
      ]
    }),
    methods: {
      addNewSkill() {
        // Implement logic to add a new skill
      }
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