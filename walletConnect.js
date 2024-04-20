"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

let web3Modal;
let provider;
let selectedAccount;

function init() {
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log(
    "window.web3 is",
    window.web3,
    "window.ethereum is",
    window.ethereum
  );
  
  document.querySelector(".buy-stash").style.display = "none"
  document.querySelector(".ready-race").style.display = "none"
  // document.querySelector(".wallet-page").style.display = "none"

  web3Modal = new Web3Modal({
    cacheProvider: false,
    disableInjectedProvider: false,
  });
}

async function fetchAccountData() {
  const web3 = new Web3(provider);
  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);

  const accounts = await web3.eth.getAccounts();
  selectedAccount = accounts[0];

}

async function onConnect() {
  try {
    provider = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
  }

  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });
  document.querySelector(".wallet-page").style.display = "none";
  document.querySelector(".buy-stash").style.display = "block";
}

async function onDisconnect() {
  if (provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }
}

function onStash() {
  document.querySelector(".buy-stash").style.display = "none";
  document.querySelector(".ready-race").style.display = "block";
}

function onRace() {
  document.querySelector(".buy-race").style.display = "none";
  document.querySelector(".ready-ready").style.display = "block";
}

window.addEventListener("load", async () => {
  init();
  document.querySelector("#btn-wallet").addEventListener("click", onConnect);
  document.querySelector("#btn-stash").addEventListener("click", onStash)
  document.querySelector("#btn-race").addEventListener("click", onRace)
});
