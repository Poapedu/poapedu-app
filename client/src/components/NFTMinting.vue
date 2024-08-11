<template>
    <div>
      <input v-model="courseName" placeholder="Course Name" />
      <input v-model="userName" placeholder="User Name" />
      <button @click="mintNFT" :disabled="!account">Mint NFT</button>
    </div>
  </template>
  
  <script>
  import { getWeb3, getContract } from "../utils/web3";
  
  export default {
    props: ["account"],
    data() {
      return {
        courseName: "",
        userName: "",
      };
    },
    methods: {
      async mintNFT() {
        try {
          const web3 = getWeb3();
          const contract = getContract(web3);
  
          if (!this.courseName || !this.userName) {
            alert("Please enter both the course name and user name.");
            return;
          }
  
          const receipt = await contract.methods
            .mint(this.account, this.courseName, this.userName)
            .send({ from: this.account });
  
          console.log("NFT Minted", receipt);
        } catch (error) {
          console.error("Failed to mint NFT:", error);
        }
      },
    },
  };
  </script>
  