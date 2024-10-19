<template>
  <v-app>
    <AppHeader />
    <v-main class="grey lighten-4">
      <v-container>
        <v-row class="back-button-row">
          <v-col cols="12" class="d-flex align-start">
            <v-btn class="back-button" @click="goBack">
              <v-icon left>mdi-chevron-left</v-icon> Back to Profile
            </v-btn>
          </v-col>
        </v-row>

        <v-container class="mint-wallet rounded-lg">
          <h2 class="">Mint NFT from Wallets</h2>
          <p class="mb-12">Connect your preferred crypto wallet to mint NFTs directly from your account - currently supporting MetaMask with more options coming soon.</p>
          <v-row>
            <v-col
              v-for="wallet in wallets"
              :key="wallet.name"
              cols="12"
              sm="6"
            >
              <v-card variant="plain">
                <v-card-text>
                  <v-row align="center">
                    <v-col
                      ><h3>{{ wallet.name }}</h3></v-col
                    >
                    <v-col class="text-right">
                      <v-btn
                        rounded="xl"
                        :color="
                          wallet.name === 'MetaMask'
                            ? wallet.connected
                              ? '#CBC0B3'
                              : '#6BA1B4'
                            : 'grey'
                        "
                        :disabled="wallet.name !== 'MetaMask'"
                        @click="connectWallet"
                      >
                        {{
                          wallet.name === "MetaMask"
                            ? wallet.connected
                              ? "Connected"
                              : "Connect"
                            : "Coming Soon"
                        }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-alert v-if="detectedNFTs.length > 0" type="info" class="mt-4">
            {{ detectedNFTs.length }} NFTs from
            {{ detectedNFTs[0].wallet }} detected!
          </v-alert>

          <v-row class="mt-4">
            <v-col
              v-for="nft in filterNFTs()"
              :key="nft.token_hash"
              cols="12"
              sm="4"
            >
              <v-card outlined height="100%">
                <v-card-text class="text-center">
                  <video
                    v-if="
                      nft.media && nft.media.original_media_url.endsWith('.mp4')
                    "
                    :src="nft.media.original_media_url"
                    height="200"
                    autoplay
                    muted
                    class="grey lighten-2"
                  ></video>

                  <!-- Fallback to using <v-img> for images -->
                  <v-img
                    v-else
                    :src="
                      nft.media && nft.media.original_media_url
                        ? nft.media.original_media_url
                        : ''
                    "
                    height="200"
                    contain
                    class="grey lighten-2"
                  ></v-img>
                  <p class="mt-2 mb-2" style="font-size: 20px">
                    {{
                      nft.metadata && JSON.parse(nft.metadata).name
                        ? JSON.parse(nft.metadata).name
                        : "Unnamed"
                    }}
                  </p>
                  <v-btn rounded="xl" color="#9AD393" @click="mintNFTFromNFT(nft)"
                    >Mint NFT</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-divider class="mint-nft-divider"></v-divider>

        <v-container class="mint-wallet rounded-lg">
          <h2>Mint NFT from Certificates</h2>
          <p class="mb-12">Enter the URL of your online certificate to automatically generate NFT data, allowing you to tokenize your achievements and credentials. We currently suppoer linkedin.com, credly, credential.net, cloudskillsboost.google.</p>
          <v-col cols="12" md="12">
            <div class="form-group">
              <label for="certificate">Insert Certificate URL</label>
              <v-text-field
                id="certificate"
                hide-details
                class="mt-3"
                bg-color="white"
                density="compact"
                variant="solo"
                v-model="certificateUrl"
                :error-messages="urlErrorMessage"
                @input="clearErrors"
              ></v-text-field>
            </div>
          </v-col>

          <v-row justify="end">
            <v-col cols="auto">
              <v-btn
                rounded="xl"
                :disabled="loading"
                color="#CBC0B3"
                class="mt-4 generate-btn"
                @click="generateData"
              >
                <template v-if="!loading"> Generate Data </template>
                <template v-else>
                  <v-progress-circular
                    indeterminate
                    color="white"
                    size="20"
                  ></v-progress-circular>
                </template>
              </v-btn>
            </v-col>
          </v-row>

          <v-alert v-if="showUnsupportedAlert" type="warning" class="mt-2">
            This platform is not supported yet.
          </v-alert>

          <div v-if="showScrapedContent">
            <h2 class="mb-4">Certificate Information</h2>
            <!-- Card for Credly -->
            <v-card
              outlined
              class="certificate-card"
              v-if="data && data.domain === 'credly.com'"
            >
              <v-card-text class="certificate-card-text">
                <v-alert
                  density="compact"
                  text="Your certificate information is only stored once you Mint NFT. Ensure to Mint NFT to save your skill information along with the NFT."
                  title="Alert!"
                  type="warning"
                  class="mb-3"
                ></v-alert>
                <v-img
                  :width="300"
                  class="certificate-image mb-3"
                  :src="scrapedContent.certificateImage"
                  :alt="scrapedContent.courseName"
                  :title="scrapedContent.courseName"
                ></v-img>
                <p>
                  <strong>Course Name:</strong>
                </p>
                <p>{{ scrapedContent.courseName }}</p>
                <br />
                <p>
                  <strong>Course Description:</strong>
                </p>
                <p>
                  {{ scrapedContent.courseDescription }}
                </p>
                <br />
                <p><strong>Skills Acquired:</strong></p>
                <v-chip-group>
                  <v-chip
                    v-for="skill in scrapedContent.skills"
                    :key="skill"
                    class="mb-2"
                  >
                    {{ skill }}
                  </v-chip>
                </v-chip-group>
                <br />
                <p><strong>Issued To:</strong></p>
                <p>{{ scrapedContent.issuedTo }}</p>
                <br v-if="scrapedContent.dateOfIssue" />
                <p v-if="scrapedContent.dateOfIssue">
                  <strong>Date of Issue:</strong>
                  {{ scrapedContent.dateOfIssue }}
                </p>
              </v-card-text>
            </v-card>
            <!-- Card for Credential -->
            <v-card
              outlined
              class="certificate-card"
              v-if="data && data.domain === 'credential.net'"
            >
              <v-card-text class="certificate-card-text">
                <v-alert
                  density="compact"
                  text="Your certificate information is only stored once you Mint NFT. Ensure to Mint NFT to save your skill information along with the NFT."
                  title="Alert!"
                  type="warning"
                  class="mb-3"
                ></v-alert>
                <v-img
                  :width="300"
                  class="certificate-image mb-3"
                  :src="scrapedContent.certificateImage"
                  :alt="scrapedContent.courseName"
                  :title="scrapedContent.courseName"
                ></v-img>
                <p>
                  <strong>Course Name:</strong>
                </p>
                <p>{{ scrapedContent.courseName }}</p>
                <br />
                <p>
                  <strong>Course Description:</strong>
                </p>
                <p>
                  {{ scrapedContent.courseDescription }}
                </p>
                <br />
                <p><strong>Skills Acquired:</strong></p>
                <v-chip-group>
                  <v-chip
                    v-for="skill in scrapedContent.skills"
                    :key="skill"
                    class="mb-2"
                  >
                    {{ skill }}
                  </v-chip>
                </v-chip-group>
                <br />
                <p><strong>Issued To: </strong></p>
                <p>{{ scrapedContent.issuedTo }}</p>
                <br v-if="scrapedContent.dateOfIssue" />
                <p v-if="scrapedContent.dateOfIssue">
                  <strong>Date of Issue: </strong>
                  {{ scrapedContent.dateOfIssue }}
                </p>
              </v-card-text>
            </v-card>
            <!-- Card for LinkedIn -->
            <v-card
              outlined
              class="certificate-card"
              v-if="data && data.domain === 'linkedin.com'"
            >
              <v-card-text class="certificate-card-text">
                <v-alert
                  density="compact"
                  text="Your certificate information is only stored once you Mint NFT. Ensure to Mint NFT to save your skill information along with the NFT."
                  title="Alert!"
                  type="warning"
                  class="mb-3"
                ></v-alert>
                <v-img
                  :width="300"
                  class="certificate-image mb-3"
                  :src="scrapedContent.certificateImage"
                  :alt="scrapedContent.courseName"
                  :title="scrapedContent.courseName"
                ></v-img>
                <p>
                  <strong>Course Name:</strong>
                </p>
                <p>{{ scrapedContent.courseName }}</p>
                <br />
                <p>
                  <strong>Course Description:</strong>
                </p>
                <p>
                  {{ scrapedContent.courseDescription }}
                </p>
                <br />
                <p><strong>Skills Acquired:</strong></p>
                <v-chip-group>
                  <v-chip
                    v-for="skill in scrapedContent.skills"
                    :key="skill"
                    class="mb-2"
                  >
                    {{ skill }}
                  </v-chip>
                </v-chip-group>
                <br />
                <p><strong>Issued To:</strong></p>
                <p>{{ scrapedContent.issuedTo }}</p>
              </v-card-text>
            </v-card>

            <v-card
              outlined
              class="mt-2"
              v-if="
                scrapedContent &&
                scrapedContent.domain === 'cloudskillsboost.google'
              "
            >
              <v-alert
                density="compact"
                text="Your certificate information is only stored once you Mint NFT. Ensure to Mint NFT to save your skill information along with the NFT."
                title="Alert!"
                type="warning"
                class="mb-2"
              ></v-alert>
              <v-row
                class="my-0 mt-3"
                align="center"
                justify="start"
                style="flex-wrap: nowrap; overflow-x: auto; white-space: nowrap"
              >
                <v-col
                  v-for="badge in scrapedContent.badges"
                  :key="badge.title"
                  cols="auto"
                  class="d-inline-block"
                  style="flex: none"
                  color="surface-variant"
                >
                  <v-card class="mx-auto" max-width="344">
                    <v-img height="200px" :src="badge.image" cover></v-img>
                    <v-card-title>
                      {{ badge.title }}
                    </v-card-title>
                    <v-card-subtitle>
                      <strong>Earned On: </strong> {{ badge.earnedOn }}
                    </v-card-subtitle>
                    <v-card-text>
                      {{ badge.description }}
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        rounded="xl"
                        color="#9AD393"
                        class="mt-4"
                        size="large"
                        @click="mintNFT"
                      >
                        Mint NFT
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
            <v-btn
              v-if="scrapedContent.domain !== 'cloudskillsboost.google'"
              rounded="xl"
              color="#9AD393"
              class="mt-4"
              size="large"
              :disabled="minting"
              @click="mintNFT"
            >
              <template v-if="!minting">
                <!-- Show "Mint NFT" when not minting -->
                Mint NFT
              </template>
              <template v-else>
                <!-- Show the loading spinner when minting -->
                <v-progress-circular
                  indeterminate
                  color="white"
                  size="20"
                ></v-progress-circular>
                Minting...
              </template>
            </v-btn>
          </div>
        </v-container>
        <v-row class="back-button-row">
          <v-col cols="12" class="d-flex align-start">
            <v-btn class="back-button" @click="goBack">
              <v-icon left>mdi-chevron-left</v-icon> Back to Profile
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import { getWeb3, getContract } from "@/utils/web3";
import { mapState } from "vuex";

export default {
  name: "EditProfile",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      web3: null,
      account: null,
      poapeduNFT: null,
      ipfsHashes: [
        "QmVpX8X5v3nLdxvmMrkmji6zn8U89QbkYrfkfBCjWoNK5T",
        "QmU6yVg55iozDEYbmj1soBykauVkwLgEdTNJ7de6WxMJev",
        "QmSrGFZjsu1azmxoDUdE5bsX6kQdGh9QDUuUS9rvJUTPrf",
        "QmTRGSf9aWPXx8WkxomDV3nKaXAVZhgxPEwA6MGKwDeSwQ",
        "QmTAHGm54GvX4vPNRXpCk1GBCMweBZNcvmXT3TYcBuh9EX",
        "QmbGZXc16x5D182ahfnBqwR8YJ2UNbY16vTD7P2fuB4bc8",
        "QmUoPvZPqvTKyDZULTZQseNQRY3xsjDYg6NGgAjdY8dLxp",
        "QmNmHaoAB22X8n9FKmgdDxznyhs8XkUAVw7zWoT1sPzPxi",
      ],

      wallets: [
        { name: "MetaMask", connected: false },
        { name: "Coinbase Wallet", connected: false },
        { name: "WalletConnect", connected: false },
        { name: "Phantom", connected: false },
      ],
      detectedNFTs: [],
      certificateUrl: "",
      showScrapedContent: false,
      showUnsupportedAlert: false,
      urlErrorMessage: "",
      scrapedContent: {
        courseName: "",
        courseDescription: "",
        skills: "",
        issuedTo: "",
        dateOfIssue: "",
        domain: "",
        certificateImage: "",
        issedBy: "",
        issuerLogo: "",
        expiresOn: "",
        badges: "",
      },
      loading: false,
      minting: false,
      error: null,
      data: null,
    };
  },
  computed: {
    ...mapState(["dbData"]),
    userEmail() {
      return this.dbData?.email || "";
    },
  },
  methods: {
    async connectWallet() {
      try {
        const web3 = getWeb3();
        if (web3) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            this.account = accounts[0];
            console.log("Connected account:", this.account);

            // Set MetaMask wallet as connected
            const metaMaskWallet = this.wallets.find(
              (wallet) => wallet.name === "MetaMask"
            );
            if (metaMaskWallet) {
              metaMaskWallet.connected = true;
            }
            // Now get the user's NFTs
            await this.getNFTs(this.account);
          } else {
            console.error(
              "No accounts found. Please ensure MetaMask is connected."
            );
          }
        } else {
          console.error("MetaMask is not installed.");
        }
      } catch (error) {
        console.error("Failed to connect MetaMask:", error);
      }
    },
    async getNFTs(walletAddress) {
      console.log("Wallet Address is", walletAddress);
      try {
        const response = await fetch(
          `${process.env.VUE_APP_LOCAL_SERVER_URL}/api/getUserNFTs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: walletAddress }), // Use the argument passed
          }
        );

        const result = await response.json();

        if (result.success) {
          console.log("NFTs:", result.nfts);
          this.detectedNFTs = result.nfts.result; // Assuming the NFTs are in `result.nfts.result`
        } else {
          console.error("Failed to retrieve NFTs:", result.message);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    },
    filterNFTs() {
      return this.detectedNFTs.filter((nft) => {
        const symbol = nft.symbol ? nft.symbol.toUpperCase() : "";
        return symbol === "ENC" || symbol === "LW3BADGES";
      });
    },
    async uploadMetadataToPinata(metadata) {
      const response = await fetch(
        `${process.env.VUE_APP_LOCAL_SERVER_URL}/upload-metadata`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metadata),
        }
      );
      const result = await response.json();
      return result.ipfsUrl;
    },
    async mintNFT() {
      try {
        this.minting = true; // Start the loading state

        if (!this.account) {
          console.warn("No account connected. Attempting to connect wallet...");
          await this.connectWallet(); // Attempt to connect the wallet

          if (!this.account) {
            console.error(
              "No account connected. Please connect your wallet first."
            );
            this.minting = false; // End the loading state
            return;
          }
        }

        const selectedImageHash =
          this.ipfsHashes[Math.floor(Math.random() * this.ipfsHashes.length)];
        const selectedImageURL = `https://gateway.pinata.cloud/ipfs/${selectedImageHash}`;

        const metadata = {
          name: this.scrapedContent.courseName,
          description: this.scrapedContent.courseDescription,
          image: selectedImageURL,
          attributes: [
            {
              trait_type: "Skills",
              value: this.scrapedContent.skills.join(", "),
            },
            { trait_type: "Issued To", value: this.scrapedContent.issuedTo },
            { trait_type: "Issued By", value: this.scrapedContent.issuedBy },
            { trait_type: "Domain", value: this.scrapedContent.domain },
          ],
        };
        console.log(metadata);
        const metadataUrl = await this.uploadMetadataToPinata(metadata);

        const contract = getContract(getWeb3());
        const tx = await contract.methods
          .mint(this.account, metadataUrl)
          .send({ from: this.account });

        console.log("Transaction receipt:", tx);
        alert("NFT minted successfully!");

        await this.saveSkillsAndEmail();
      } catch (error) {
        console.error("Failed to mint NFT:", error);
      } finally {
        this.minting = false; // End the loading state regardless of success or failure
      }
    },
    async mintNFTFromNFT(nft) {
      try {
        const selectedImageHash =
          this.ipfsHashes[Math.floor(Math.random() * this.ipfsHashes.length)];
        const selectedImageURL = `https://gateway.pinata.cloud/ipfs/${selectedImageHash}`;

        const metadata = {
          name: JSON.parse(nft.metadata).name,
          description: JSON.parse(nft.metadata).description,
          image: selectedImageURL,
          attributes: [
            {
              trait_type: "Skills",
              value: "",
            },
            { trait_type: "Issued To", value: nft.owner_of },
            { trait_type: "Issued By", value: nft.token_address },
            { trait_type: "Domain", value: nft.name },
          ],
        };
        console.log(metadata);
        const metadataUrl = await this.uploadMetadataToPinata(metadata);

        const contract = getContract(getWeb3());
        const tx = await contract.methods
          .mint(this.account, metadataUrl)
          .send({ from: this.account });

        console.log("Transaction receipt:", tx);
        alert("NFT minted successfully!");
      } catch (error) {
        console.error("Failed to mint NFT:", error);
      } finally {
        this.minting = false; // End the loading state regardless of success or failure
      }
    },
    async saveSkillsAndEmail() {
      console.log(this.userEmail);
      console.log(this.scrapedContent.skills);
      try {
        const response = await fetch(
          `${process.env.VUE_APP_LOCAL_SERVER_URL}/api/save-skills`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: this.userEmail, // Use the userEmail from the AppHeader
              skills: this.scrapedContent.skills,
            }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          console.log("Skills and email saved successfully:", result);
        } else {
          console.error("Failed to save skills and email:", result.message);
        }
      } catch (error) {
        console.error("Error saving skills and email:", error);
      }
    },
    validateUrl() {
      const credlyRegex = /^https?:\/\/(www\.)?credly\.com\//i;
      const credentialNetRegex = /^https?:\/\/(www\.)?credential\.net\//i;
      const linkedinRegex =
        /^https?:\/\/(www\.)?linkedin\.com\/learning\/certificates\//i;
      const cloudBoostRegex =
        /^https?:\/\/(www\.)?cloudskillsboost\.google\/public_profiles\//i;

      if (this.certificateUrl) {
        if (
          credlyRegex.test(this.certificateUrl) ||
          credentialNetRegex.test(this.certificateUrl) ||
          linkedinRegex.test(this.certificateUrl) ||
          cloudBoostRegex.test(this.certificateUrl)
        ) {
          return true;
        } else {
          this.urlErrorMessage =
            "Not a supported platform. We only support credly or credential.net or linkedin or google cloudboost links at the moment.";
          this.showUnsupportedAlert = true;
          return false;
        }
      } else {
        this.urlErrorMessage = "Please enter a URL";
        return false;
      }
    },
    goBack() {
      this.$router.push("/dashboard");
    },
    clearErrors() {
      this.urlErrorMessage = "";
      this.showUnsupportedAlert = false;
      this.showScrapedContent = false;
    },
    async generateData() {
      if (this.validateUrl()) {
        this.loading = true;
        this.error = null;
        this.data = null;

        try {
          const response = await fetch(
            `${
              process.env.VUE_APP_LOCAL_SERVER_URL
            }/scrape?url=${encodeURIComponent(this.certificateUrl)}`
          );
          this.data = await response.json();
        } catch (error) {
          console.error("Error fetching content:", error);
          this.error = error.message;
        } finally {
          this.loading = false;
        }

        setTimeout(() => {
          if (this.data.domain === "credly.com") {
            this.scrapedContent = {
              courseName: `${this.data.certificateTitle}`,
              courseDescription: `${this.data.description}`,
              skills: this.data.skills.split(","),
              issuedTo: `${this.data.issuedTo}`,
              domain: `${this.data.domain}`,
              issedBy: `${this.data.issuedBy}`,
              certificateImage: `${this.data.certificateImage}`,
            };
            console.log(this.scrapedContent);
            this.showScrapedContent = true;
          } else if (this.data.domain === "credential.net") {
            this.scrapedContent = {
              domain: `${this.data.domain}`,
              certificateImage: `${this.data.certificateImage}`,
              courseDescription: `${this.data.description}`,
              skills: this.data.skills.split(","),
              dateOfIssue: `${this.data.issuedOn}`,
              expiresOn: `${this.data.expiresOn}`,
              issuerLogo: `${this.data.issuerLogo}`,
              courseName: `${this.data.certificateTitle}`,
              issuedTo: `${this.data.issuedTo}`,
            };
            this.showScrapedContent = true;
          } else if (this.data.domain === "linkedin.com") {
            this.scrapedContent = {
              domain: `${this.data.domain}`,
              certificateImage: `${this.data.certificateImage}`,
              courseDescription: `${this.data.description}`,
              skills: this.data.skills.split(","),
              courseName: `${this.data.certificateTitle}`,
              issuedTo: `${this.data.issuedTo}`
            };
            this.showScrapedContent = true;
          } else if (this.data.domain === "cloudskillsboost.google") {
            this.scrapedContent = {
              domain: `${this.data.domain}`,
              badges: this.data.badges,
              issuedTo: `${this.data.issuedTo}`,
            };
            this.showScrapedContent = true;
            console.log(this.scrapedContent);
          } else {
            this.showScrapedContent = false;
            this.error =
              "Unable to fetch the data. Please try again in some time.";
          }
        }, 1000);
      } else {
        this.showScrapedContent = false;
      }
    },
  },
};
</script>

<style scoped>
.mint-nft-divider {
  margin-top: 60px;
  margin-bottom: 60px;
}

.back-button-row {
  margin-top: 80px;
  margin-bottom: 80px;
}

.back-button {
  background-color: #96adc8;
  color: white;
  border-radius: 25px;
  font-weight: bold;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.back-button v-icon {
  margin-right: 5px;
}

.mint-wallet {
  background-color: #ded2c4;
}

.generate-btn {
  background-color: #ded2c4;
  color: black;
}

.certificate-card {
  padding: 20px;
  background-color: #f9f4ef;
  border-radius: 8px;
}

.certificate-card-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.certificate-image {
  margin-bottom: 20px;
}

.v-chip-group {
  display: flex;
  flex-wrap: wrap;
}

.v-chip {
  margin-right: 10px;
  margin-bottom: 10px;
}

.mb-3 {
  margin-bottom: 20px;
}

.mt-3 {
  margin-top: 20px;
}
</style>
