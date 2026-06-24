var web3;
var App = {
  account: null,
  contract: null,

  init: async function () {
    await App.initWeb3();
    await App.initContract();
    App.bindEvents();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      App.account = accounts[0];

      console.log("Connected account:", App.account);
    } else {
      alert("Please install MetaMask");
    }
  },

  initContract: async function () {
    const response = await fetch("Product.json");
    const productJson = await response.json();

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = productJson.networks[networkId];

    if (!deployedNetwork) {
      alert("Contract not deployed on this network");
      return;
    }

    App.contract = new web3.eth.Contract(
      productJson.abi,
      deployedNetwork.address
    );

    console.log("Contract Loaded Successfully");
  },

  bindEvents: function () {
    document
      .querySelector(".btn-register")
      .addEventListener("click", App.registerSeller);
  },

  registerSeller: async function (event) {
    event.preventDefault();

    try {
      const sellerName = document.getElementById("SellerName").value;
      const sellerBrand = document.getElementById("SellerBrand").value;
      const sellerCode = document.getElementById("SellerCode").value;
      const sellerPhoneNumber = document.getElementById("SellerPhoneNumber").value;
      const sellerManager = document.getElementById("SellerManager").value;
      const sellerAddress = document.getElementById("SellerAddress").value;
      const ManufacturerId = document.getElementById("ManufacturerId").value;

      await App.contract.methods
        .addSeller(
          web3.utils.asciiToHex(ManufacturerId),
          web3.utils.asciiToHex(sellerName),
          web3.utils.asciiToHex(sellerBrand),
          web3.utils.asciiToHex(sellerCode),
          sellerPhoneNumber,
          web3.utils.asciiToHex(sellerManager),
          web3.utils.asciiToHex(sellerAddress)
        )
        .send({ from: App.account });

      alert("Seller Added Successfully ✅");

    } catch (error) {
      console.error("Transaction Error:", error);
      alert(error.message);
    }
  }
};

window.addEventListener("load", function () {
  App.init();
});