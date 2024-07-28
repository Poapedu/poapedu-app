<template>
    <v-container>
      <h2 class="mb-4">Skill Tree</h2>
      <v-row>
        <v-col cols="12" md="4">
          <v-list>
            <v-list-item v-for="skill in skills" :key="skill.name">
              <v-list-item-content>
                <v-list-item-title>{{ skill.name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                {{ skill.progress }}
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-btn text color="primary" @click="addNewSkill">
            + Add new skill
          </v-btn>
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
        { name: 'Python', progress: '12/42' },
        { name: 'Java', progress: '8/51' },
        { name: 'C++', progress: '26/123' },
        { name: 'Vue', progress: '8/84' },
      ]
    }),
    methods: {
      addNewSkill() {
        // Implement logic to add a new skill
      }
    }
  }
  </script>