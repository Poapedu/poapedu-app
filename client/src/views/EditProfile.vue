<template>
    <v-app>
        <AppHeader />
        <v-main class="grey lighten-4">
            <v-container>
                <v-btn rounded="xl" text @click="goBack">
                    <v-icon left>mdi-chevron-left</v-icon>
                    Back to Profile
                </v-btn>
            
                <h2 class="mt-10">Mint NFT from Wallets</h2>
            
                <v-row>
                    <v-col v-for="wallet in wallets" :key="wallet.name" cols="12" sm="6">
                        <v-card variant="plain">
                            <v-card-text>
                                <v-row align="center">
                                    <v-col><h3>{{ wallet.name }}</h3></v-col>
                                    <v-col class="text-right">
                                        <v-btn rounded="xl" :color="wallet.connected ? 'primary' : 'default'">
                                            {{ wallet.connected ? 'Disconnect' : 'Connect' }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            
                <v-alert v-if="detectedNFTs.length > 0" type="info" class="mt-4">
                    {{ detectedNFTs.length }} NFTs from {{ detectedNFTs[0].wallet }} detected!
                </v-alert>
            
                <v-row class="mt-4">
                    <v-col v-for="nft in detectedNFTs" :key="nft.name" cols="12" sm="4">
                    <v-card outlined height="100%">
                        <v-card-text class="text-center">
                        <v-img
                            :src="nft.image"
                            height="150"
                            contain
                            class="grey lighten-2"
                        ></v-img>
                        <p class="mt-2 mb-2" style="font-size:20px">{{ nft.name }}</p>
                        <v-btn rounded="xl" color="primary" block>Mint NFT</v-btn>
                        </v-card-text>
                    </v-card>
                    </v-col>
                </v-row>

                <v-divider></v-divider>

                <h2 class="mt-6">Mint NFT from Certificates</h2>

                <v-text-field class="mt-3"
                label="Insert Certificate URL"
                v-model="certificateUrl"
                :error-messages="urlErrorMessage"
                append-icon="mdi-refresh"
                @click:append="generateData"
                @input="clearErrors"
                ></v-text-field>

                <v-alert v-if="showUnsupportedAlert" type="warning" class="mt-2">
                This platform is not supported yet.
                </v-alert>

                <div v-if="showScrapedContent">
                    <h3 class="mt-4">Scraped Content</h3>
                    
                    <v-card outlined class="mt-2">
                        <v-card-text>
                            <p><strong>Course Name:</strong> {{ scrapedContent.courseName }}</p>
                            <p><strong>Course Description:</strong> {{ scrapedContent.courseDescription }}</p>
                            <p><strong>Skills Acquired:</strong></p>
                            <v-chip-group>
                                <v-chip v-for="skill in scrapedContent.skills" :key="skill">
                                {{ skill }}
                                </v-chip>
                            </v-chip-group>
                            <p><strong>Issued To:</strong> {{ scrapedContent.issuedTo }}</p>
                            <p><strong>Date of Issue:</strong> {{ scrapedContent.dateOfIssue }}</p>
                        </v-card-text>
                    </v-card>
                    
                    <v-btn rounded="xl" color="primary" class="mt-4">Mint NFT</v-btn>
                </div>


                <v-btn rounded="xl" class="mt-15" text @click="goBack">
                    <v-icon left>mdi-chevron-left</v-icon>
                    Back to Profile
                </v-btn>
            </v-container>
        </v-main>
        <AppFooter />
    </v-app>
  </template>
  
  <script>
    import AppHeader from '../components/AppHeader.vue'
    import AppFooter from '../components/AppFooter.vue'
    export default {
        name: 'EditProfile',
        components: {
            AppHeader,
            AppFooter
        },
        data() {
            return {
                wallets: [
                    { name: 'MetaMask', connected: false },
                    { name: 'Coinbase Wallet', connected: false },
                    { name: 'WalletConnect', connected: false },
                    { name: 'Phantom', connected: false },
                ],
                detectedNFTs: [
                    { name: 'Intro to Solidity', wallet: 'MetaMask', image: '' },
                    { name: 'Intro to MetaMask', wallet: 'MetaMask', image: '' },
                    { name: 'Advanced Contracts', wallet: 'MetaMask', image: '' },
                ],
                certificateUrl: 'https://www.example.com/certificate/123456789',
                showScrapedContent: false,
                showUnsupportedAlert: false,
                urlErrorMessage: '',
                scrapedContent: {
                    courseName: '',
                    courseDescription: '',
                    skills: [],
                    issuedTo: '',
                    dateOfIssue: '',
                },
            };
        },
        methods: {
            validateUrl() {
                const credlyRegex = /^https?:\/\/(www\.)?credly\.com\//i;
                const credentialNetRegex = /^https?:\/\/(www\.)?credential\.net\//i;

                if (this.certificateUrl) {
                    if (credlyRegex.test(this.certificateUrl) || credentialNetRegex.test(this.certificateUrl)) {
                        return true;
                    } else {
                        this.urlErrorMessage = 'Please enter a valid Credly or Credential.net URL';
                        this.showUnsupportedAlert = true;
                        return false;
                    }
                } else {
                    this.urlErrorMessage = 'Please enter a URL';
                    return false;
                }
            },
            goBack() {
                this.$router.push('/dashboard');
            },
            clearErrors() {
                this.urlErrorMessage = '';
                this.showUnsupportedAlert = false;
                this.showScrapedContent = false;
            },
            generateData() {
                if (this.validateUrl()) {
                    // Here you would typically make an API call to scrape the data
                    // For this example, we'll just simulate it with a timeout
                    setTimeout(() => {
                    this.scrapedContent = {
                        courseName: '[Language] Web-scraping Test for Extractive and Abstractive Summarizers',
                        courseDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
                        skills: ['Skill Tag #1', 'Skill Tag #2', 'Skill Tag #3', 'Skill Tag #4'],
                        issuedTo: 'Firstname Lastname',
                        dateOfIssue: '29 July 2024',
                    };
                    this.showScrapedContent = true;
                    }, 1000);
                } else {
                    this.showScrapedContent = false;
                }
            },
        },
    };
  </script>