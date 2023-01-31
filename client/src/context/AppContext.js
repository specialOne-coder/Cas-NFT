import { BigNumber, ethers } from "ethers";
import React, { useState, createContext, useEffect } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { writeJsonFile } from "write-json-file";
import { chainlist } from "../utils/chain-contants";
import { getDatabase, ref, onValue, get, set, child } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
const { FormatIPFS } = require("../utils/formatIPFS");
const { NonceManager } = require("@ethersproject/experimental");
const Wallet = require("./Wallet");
const Alert = require("sweetalert2");
const adresss = require("../utils/db");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdz2Xwg9KeUs11v-FCRV7Tvvn3bIweR-w",
  authDomain: "cas-nft.firebaseapp.com",
  databaseURL: "https://cas-nft-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cas-nft",
  storageBucket: "cas-nft.appspot.com",
  messagingSenderId: "803385186868",
  appId: "1:803385186868:web:5d216a3184a450729d0861",
  measurementId: "G-D67NKNLMKX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

export const AppContext = createContext(); // global apk context

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState();
  const [networkId, setNetworkId] = useState();
  const [networkRpc, setNetworkRpc] = useState();
  const [exist, setExist] = useState(false);
  const [networkProvider, setNetworkProvider] = useState();
  const [nonce, setNonce] = useState(0);
  const [tokens, setTokens] = useState([]);

  async function writeUserNonce() {
    // if (loading) {
    //   console.log('Already')
    //   return
    // }
    // setLoading(true)
    // const uw = ref(db, 'nonces')
    // get(uw).then(
    //   async (snapshot) => {
    //     const nonces = snapshot.val()
    //     const nonce = nonces.nonce
    //     const userNonce = nonces.userNonce
    //     let val = userNonce + 1
    //     set(uw, {
    //       userNonce: val,
    //       nonce: nonce,
    //     })
    //   },
    //   {
    //     onlyOnce: true,
    //   },
    //)
  }

  function writeTxNonce(nonce) {
    const unonces = ref(db, "nonces");
    get(unonces).then((snapshot) => {
      const data = snapshot.val();
      const userNonce = data.userNonce;
      set(unonces, {
        userNonce: userNonce,
        nonce: nonce,
      });
    });
  }

  const ourProvider = async () => {
    const provider = await Wallet.provider();
    setNetworkProvider(provider);
  };
  // connect to wallet
  const connectWallet = async () => {
    await ourProvider();
    const account = await Wallet.connect();
    console.log("le compte =>", account[0]);
    setCurrentAccount(account[0]);
    return account[0];
  };

  // disconnect from wallet
  const disconnectWallet = async () => {
    await Wallet.disconnect();
    setCurrentAccount();
  };

  // verify network
  const verifyNetwork = async (networkId, networkName, networkRpc) => {
    console.log("In context, networkId is =>", networkId);
    const verify = Wallet.verifyNetwork(networkId, networkName, networkRpc);
    setNetworkId(verify);
    setNetworkRpc(networkRpc);
  };

  const tokenData = async (contractAddress, contractABI) => {
    const signer = await Wallet.signer();
    const user = await Wallet.connect();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log("user =>", user);
    let tokens = await contract.getTokenIds(user[0], {
      //gasLimit: 500000,
    });
    let toks = [];
    if (tokens.length > 0) {
      setExist(true);
      for (let i = 0; i < tokens.length; i++) {
        const link = await contract.tokenURI(
          BigNumber.from(tokens[i]).toString()
        );
        console.log("link =>", link);
        let ipfs_url = FormatIPFS(link);
        console.log("ipfs_url =>", ipfs_url);
        await fetch(ipfs_url)
          .then((res) => res.json())
          .then(async (out) => {
            //console.log("out =>", out);
            toks.push(out);
          })
          .catch((err) => {
            //throw err;
          });
      }
      console.log("toks =>", toks);
      //localStorage.setItem(`${user[0]}`, toks);
      setTokens(toks);
    }
  };

  const presale = async (
    contractAddress,
    contractABI,
    tokenNumbers,
    explorer,
    user
  ) => {
    await Wallet.verifyNetwork(
      "0x5",
      "Goerli Testnet",
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    setLoading(true);
    const signer = await Wallet.signer();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const user = await Wallet.connect();
    for (let i = 0; i < adresss.length; i++) {
      if (adresss[i] === user[0]) {
        let transaction;
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
        try {
          let presaleMint = await contract.presale(tokenNumbers, {
            gasLimit: 500000,
          });
          transaction = presaleMint.hash;
          console.log("transaction hash =>", transaction);
          await presaleMint.wait();
          setLoading(false);
          console.log("Link => ", `${explorer}/tx/${transaction}`);
          Alert.fire({
            position: "center",
            icon: "success",
            title: `Presale`,
            text: `Your presale mint is done`,
            showConfirmButton: false,
            footer: `<a target="_blank" href=${explorer}/tx/${transaction}/>See Transaction</a>`,
          });
        } catch (error) {
          if (
            error.code === 4001 ||
            error.message.includes("User rejected the transaction")
          ) {
            setLoading(false);
            Alert.fire({
              icon: "error",
              title: "Oops...",
              text: "Permission denied",
              showConfirmButton: false,
            });
          } else {
            setLoading(false);
            Alert.fire({
              icon: "error",
              title: "Oops...",
              text: "Mint Error, verify if collection isn't sold out",
              showConfirmButton: false,
              footer: `<a target="_blank" href=${explorer}/tx/${transaction}/>See Transaction</a>`,
            });
          }
        }
      }else if(i === adresss.length - 1){
        Alert.fire({
          icon: "error",
          title: "Oops...",
          text: "You are not in the whitelist",
          showConfirmButton: false,
        });
      }
    }
  };

  const mintNFT = async (
    contractAddress,
    contractABI,
    tokenNumbers,
    explorer
  ) => {
    await Wallet.verifyNetwork(
      "0x5",
      "Goerli Testnet",
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    await setLoading(true);
    const signer = await Wallet.signer();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    let transaction;
    try {
      let mintNFT = await contract.mintNFT(tokenNumbers, {
        gasLimit: 500000,
      });
      transaction = mintNFT.hash;
      console.log("transaction hash =>", transaction);
      await mintNFT.wait();
      setLoading(false);
      console.log("Link => ", `${explorer}/tx/${transaction}`);
      Alert.fire({
        position: "center",
        icon: "success",
        title: `Mint  `,
        text: `Your mint is done`,
        showConfirmButton: false,
        footer: `<a target="_blank" href=${explorer}/tx/${transaction}/>See Transaction</a>`,
      });
    } catch (error) {
      if (
        error.code === 4001 ||
        error.message.includes("User rejected the transaction")
      ) {
        setLoading(false);
        Alert.fire({
          icon: "error",
          title: "Oops...",
          text: "Permission denied",
          showConfirmButton: false,
        });
      } else {
        setLoading(false);
        Alert.fire({
          icon: "error",
          title: "Oops...",
          text: "Mint Error, verify if collection isn't sold out",
          showConfirmButton: false,
          footer: `<a target="_blank" href=${explorer}/tx/${transaction}/>See Transaction</a>`,
        });
      }
    }
  };

  const burnNFT = async (contractAddress, contractABI, tokenId, explorer) => {
    await Wallet.verifyNetwork(
      "0x5",
      "Goerli Testnet",
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    await setLoading(true);
    const signer = await Wallet.signer();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    let transaction;
    try {
      let burnNFT = await contract.burnNFT(tokenId, {
        gasLimit: 500000,
      });
      transaction = burnNFT.hash;
      console.log("transaction hash =>", transaction);
      await burnNFT.wait();
      setLoading(false);
      Alert.fire({
        position: "center",
        icon: "success",
        title: `Burn  `,
        text: `Your burn is done`,
        showConfirmButton: false,
        footer: `<a target="_blank" href=${explorer}/tx/${transaction}/>See Transaction</a>`,
      });
    } catch (error) {
      if (
        error.code === 4001 ||
        error.message.includes("User rejected the transaction")
      ) {
        setLoading(false);
        Alert.fire({
          icon: "error",
          title: "Oops...",
          text: "Permission denied",
          showConfirmButton: false,
        });
      } else {
        setLoading(false);
        Alert.fire({
          icon: "error",
          title: "Oops...",
          text: "Burn Error, verify if you can burn this NFT",
          showConfirmButton: false,
          footer: `<a target="_blank" href=${explorer}/tx/${transaction}/>See Transaction</a>`,
        });
      }
    }
  };
  const prov = new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );

  const airdrop = async (
    userAddress,
    contractAddress,
    contractABI,
    explorer
  ) => {
    if (loading) {
      console.log("Already");
      return;
    }
    setLoading(true);
    await Wallet.verifyNetwork(
      "0x5",
      "Goerli Testnet",
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    const account = new ethers.Wallet(
      "your private key",
      prov
    );
    console.log("Account =>", account);
    const contract = new ethers.Contract(contractAddress, contractABI, account);
    let transaction;
    try {
      let airdropNFT = await contract.airdrop([userAddress], {
        gasLimit: 500000,
      });
      let signer = await Wallet.signer();
      const nonceManager = new NonceManager(signer);
      nonceManager.incrementTransactionCount();
      writeTxNonce(airdropNFT.nonce);
      transaction = airdropNFT.hash;
      airdropNFT.wait();
      prov.on("pending", (tx) => {
        prov.getTransaction(tx).then(function (transaction) {
          console.log(transaction);
        });
      });
      contract.on("Airdrop", (userAddr, tokenId) => {
        console.log({ eventAddress: userAddr, tokenId: tokenId });
        if (userAddr === userAddress) {
          Alert.fire({
            position: "top-end",
            icon: "success",
            title: `Airdrop  `,
            text: `Your airdrop is done`,
            showConfirmButton: false,
            footer: `<a target="_blank" href=${explorer}/tx/${transaction}/>See Transaction</a>`,
          });
          setLoading(false);
        }
      });
    } catch (error) {
      console.log({ error });
      if (
        error.code === 4001 ||
        error.message.includes("User rejected the transaction")
      ) {
        setLoading(false);
        Alert.fire({
          icon: "error",
          title: "Oops...",
          text: "Permission denied",
          showConfirmButton: false,
        });
      }
      //else {
      //   setLoading(false)
      //   Alert.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: 'Airdrop Error, verify if you can airdrop',
      //     showConfirmButton: false,
      //     footer: `<a target="_blank" href=${explorer}/tx/${transaction}/>See Transaction</a>`,
      //   })
      // }
    }
  };

  // every time page is loaded, connect to wallet
  useEffect(() => {
    if (Wallet.web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     tokenData()
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [])

  // every time provider is changed, follow the change
  useEffect(() => {
    if (networkProvider?.on) {
      const handleAccountsChanged = (accounts) => {
        // accounts changed
        console.log("accountsChanged", accounts);
        if (accounts) setCurrentAccount(accounts[0]);
      };

      const handleChainChanged = async (_hexChainId) => {
        // chain changed event
        console.log("chainChanged", _hexChainId);
        console.log("account when chain change", currentAccount);
        Alert.fire({
          icon: "info",
          title: "Network change",
          confirmButtonText: "Ok",
          text: "Make sure you are on the right network before mint",
          width: "auto",
        });
      };

      const handleDisconnect = () => {
        // disconnect event
        disconnectWallet();
      };

      networkProvider.on("accountsChanged", handleAccountsChanged);
      networkProvider.on("chainChanged", handleChainChanged);
      networkProvider.on("disconnect", handleDisconnect);

      return () => {
        if (networkProvider.removeListener) {
          networkProvider.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          networkProvider.removeListener("chainChanged", handleChainChanged);
          networkProvider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [networkProvider]);
  return (
    <AppContext.Provider
      value={{
        connectWallet,
        currentAccount,
        mintNFT,
        burnNFT,
        verifyNetwork,
        db,
        exist,
        loading,
        tokens,
        writeUserNonce,
        tokenData,
        airdrop,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
