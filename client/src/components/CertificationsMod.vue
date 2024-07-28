<template>
    <v-container>
      <h2 class="mb-4">Certifications</h2>
      <v-row>
        <v-col v-for="(cert, index) in certifications" :key="index" cols="12" sm="6" md="3">
          <v-card>
            <v-img :src="cert.image" height="200px"></v-img>
            <v-card-title>{{ cert.title }}</v-card-title>
            <v-card-subtitle>{{ cert.date }}</v-card-subtitle>
            <v-card-actions>
              <v-btn text color="primary" @click="openDialog(cert)">
                View Certificate
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-btn text color="primary" @click="showMore" v-if="!showAll">
        View More
      </v-btn>
  
      <v-dialog v-model="dialog" max-width="500px">
        <v-card v-if="selectedCert">
          <v-img :src="selectedCert.image" height="300px"></v-img>
          <v-card-title>{{ selectedCert.title }}</v-card-title>
          <v-card-subtitle>{{ selectedCert.date }}</v-card-subtitle>
          <v-card-text>{{ selectedCert.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'CertificationsMod',
    data: () => ({
      certifications: [
        { title: 'Certificate 1', date: '12 Apr 2023', image: 'https://images.credly.com/size/340x340/images/8936144c-307b-4207-a42e-50e6abbea464/image.png', description: 'Description 1' },
        { title: 'Certificate 2', date: '15 Apr 2023', image: 'path/to/image2.jpg', description: 'Description 2' },
        { title: 'Certificate 3', date: '18 Apr 2023', image: 'path/to/image3.jpg', description: 'Description 3' },
        { title: 'Certificate 4', date: '21 Apr 2023', image: 'path/to/image4.jpg', description: 'Description 4' },
        { title: 'Certificate 5', date: '24 Apr 2023', image: 'path/to/image5.jpg', description: 'Description 5' },
        { title: 'Certificate 6', date: '27 Apr 2023', image: 'path/to/image6.jpg', description: 'Description 6' },
        { title: 'Certificate 7', date: '30 Apr 2023', image: 'path/to/image7.jpg', description: 'Description 7' },
        { title: 'Certificate 8', date: '03 May 2023', image: 'path/to/image8.jpg', description: 'Description 8' },
      ],
      showAll: false,
      dialog: false,
      selectedCert: null
    }),
    methods: {
      showMore() {
        this.showAll = true
      },
      openDialog(cert) {
        this.selectedCert = cert
        this.dialog = true
      }
    },
    computed: {
      visibleCertifications() {
        return this.showAll ? this.certifications : this.certifications.slice(0, 4)
      }
    }
  }
  </script>