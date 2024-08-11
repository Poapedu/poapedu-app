<template>
    <div>
      <button @click="connectWallet">Connect MetaMask</button>
      <p v-if="account">Connected Account: {{ account }}</p>
    </div>
  </template>
  
  <script>
  import { getWeb3 } from "../utils/web3";
  
  export default {
    data() {
      return {
        account: null,
      };
    },
    methods: {
      async connectWallet() {
        try {
          const web3 = getWeb3();
          if (web3) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
            this.$emit("connected", this.account); // Emit the connected account
          } else {
            console.error("MetaMask is not installed.");
          }
        } catch (error) {
          console.error("Failed to connect MetaMask:", error);
        }
      },
    },
  };
  </script>
  