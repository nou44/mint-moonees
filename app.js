const CONTRACT_ADDRESS = "0x6384B134C31d90043EcAB76266DBfF912F178F13";

const ABI = [
  {
    "inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],
    "name":"mint",
    "outputs":[],
    "stateMutability":"payable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getMintPrice",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"mintOpen",
    "outputs":[{"internalType":"bool","name":"","type":"bool"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"maxPerWallet",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"","type":"address"}],
    "name":"minted",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  }
];

let provider, signer, contract;
let connecting = false;

const connectBtn = document.getElementById("connectBtn");
const mintBtn = document.getElementById("mintBtn");

connectBtn.addEventListener("click", connectWallet);
mintBtn.addEventListener("click", mintNFT);

async function connectWallet() {
  if (connecting) return;
  connecting = true;

  if (!window.ethereum) {
    alert("MetaMask not found");
    connecting = false;
    return;
  }

  try {
    await ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x89" }],
    });

    const addr = await signer.getAddress();
    document.getElementById("wallet").innerText =
      addr.slice(0, 6) + "..." + addr.slice(-4);

    const price = await contract.getMintPrice();
    document.getElementById("price").innerText =
      "Price: " + ethers.utils.formatEther(price) + " MATIC";

    mintBtn.disabled = false;
  } catch (e) {
    console.log(e);
    alert(e.message || "Connect failed");
  }

  connecting = false;
}

async function mintNFT() {
  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  try {
    const amount = Number(document.getElementById("amount").value);
    if (amount <= 0) return alert("Invalid amount");

  const isOpen = await contract.mintOpen();

if (isOpen) {
  mintBtn.disabled = false;
  mintBtn.innerText = "Mint";
} else {
  mintBtn.disabled = true;
  mintBtn.innerText = "Mint Closed";
}


    const price = await contract.getMintPrice();
    const total = price.mul(amount);

    const already = await contract.minted(await signer.getAddress());
    const max = await contract.maxPerWallet();

    if (already.add(amount).gt(max)) {
      return alert("Wallet limit reached");
    }

    document.getElementById("status").innerText = "Minting...";

   const tx = await contract.mint(amount, { value: total });
await tx.wait();

document.getElementById("status").innerText = "Mint success ✅";
mintBtn.classList.add("shake");
setTimeout(() => mintBtn.classList.remove("shake"), 700);
// ✅ SUCCESS FX
mintSuccessEffect();

  } catch (e) {
    console.log(e);
    alert(e.reason || e.message);
  }
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => location.reload());
  window.ethereum.on("chainChanged", () => location.reload());
}
const leftImgs = ["img/1.gif","img/2.gif","img/3.gif","img/4.gif"];
const rightImgs = ["img/5.gif","img/6.gif","img/7.gif"];

let li = 0;
let ri = 0;

setInterval(() => {
  document.querySelectorAll(".left .side-img").forEach(img => {
    img.src = leftImgs[li++ % leftImgs.length];
  });
}, 3000);

setInterval(() => {
  document.querySelectorAll(".right .side-img").forEach(img => {
    img.src = rightImgs[ri++ % rightImgs.length];
  });
}, 3200);

function mintSuccessEffect() {
  const text = document.createElement("div");
  text.className = "mint-success";
  text.innerText = "🎉 ! MINT SUCCESS 🎉";
  document.body.appendChild(text);

  setTimeout(() => text.remove(), 2000);

  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * 10 + 6;
    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.left = Math.random() * 100 + "vw";
    star.style.animationDuration = Math.random() * 2 + 2 + "s";

    const colors = ["#ff9a2f", "#ff3b3b", "#ffd6a0", "#ffffff", "#7a4bff"];
    star.style.background = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(star);

    setTimeout(() => star.remove(), 4000);
  }
}

