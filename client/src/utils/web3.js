import Web3 from "web3";

let web3;

export function getWeb3() {
  if (!web3) {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    } else {
      console.error("MetaMask is not installed.");
    }
  }
  return web3;
}

export function getContract(web3) {
  const contractAddress = "0x68E17271c47cc96A98B98722fc1F0C559ddc6c2E"; // Your deployed contract address
  const contractABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "string",
          name: "courseName",
          type: "string",
        },
        {
          internalType: "string",
          name: "userName",
          type: "string",
        },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    // Other contract methods
  ];
  return new web3.eth.Contract(contractABI, contractAddress);
}
