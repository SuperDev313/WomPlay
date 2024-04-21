"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

let web3Modal;
let provider;
let selectedAccount;

let isKeyDisabled = true;

function handleKeyEvent(event) {
  if (isKeyDisabled) {
    event.preventDefault(); // Prevent default behavior (e.g., scrolling)
    event.stopPropagation(); // Stop event propagation to parent elements
    return false; // Stop further processing of the event
  }
}

function init() {
  document.body.addEventListener("keydown", handleKeyEvent);
  document.body.addEventListener("keyup", handleKeyEvent);

  web3Modal = new Web3Modal({
    cacheProvider: false,
    disableInjectedProvider: false,
  });

  const intervalID = setInterval(() => {
    var ok_button = document.getElementsByClassName("swal2-confirm")[0];
    if (ok_button) {
      clearInterval(intervalID);
      ok_button?.addEventListener("click", () => {
        document.querySelector(".wallet-page").style.display = "block";
        document.querySelector(".price-page").style.display = "flex";
        // isKeyDisabled = false;
      });
    }
  }, 300);

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
  document.querySelector(".state-page").style.display = "block";
  isKeyDisabled = false;
}

async function onDisconnect() {
  if (provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }
}

async function onStash() {
  document.querySelector(".buy-stash").style.display = "none";
  document.querySelector(".race").style.display = "block";
}

async function onRace() {
  document.querySelector(".race").style.display = "none";
  document.querySelector(".ready").style.display = "block";
}

async function onReady() {
  document.querySelector(".ready").style.display = "none";
  document.querySelector(".go").style.display = "flex";
  var countNum = document.getElementById("countNum");
  var cnt = 3;
  var interval = setInterval(() => {
    countNum.innerHTML = `<p>${cnt ? cnt : "Go!"}</p>`;
    console.log(cnt);
    cnt--;
    if (cnt < 0) {
      clearInterval(interval);
      setTimeout(() => {
        document.querySelector(".go").style.display = "none";
      }, 1000);
    }
  }, 1000);
}

window.addEventListener("load", async () => {
  init();
  document.querySelector("#btn-wallet").addEventListener("click", onConnect);
  document.querySelector("#btn-stash").addEventListener("click", onStash);
  document.querySelector("#btn-race").addEventListener("click", onRace);
  document.querySelector("#btn-ready").addEventListener("click", onReady);
});
