console.log("productApp.js loaded");

App = {

    web3Provider: null,
    contract: null,
    account: null,

    init: async function () {
        return await App.initWeb3();
    },

    initWeb3: async function () {

        if (window.ethereum) {

            App.web3Provider = window.ethereum;
            window.web3 = new Web3(window.ethereum);

            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                App.account = accounts[0];
                console.log("Connected account:", App.account);

            } catch (error) {
                alert("User denied MetaMask access");
                return;
            }

        } else {
            alert("Please install MetaMask!");
            return;
        }

        return await App.loadContract();
    },

    loadContract: async function () {
  try {
    const response = await fetch("../../build/contracts/Product.json");
    const data = await response.json();

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = data.networks[networkId];

    if (!deployedNetwork) {
      alert("Contract not deployed on this network!");
      return;
    }

    App.contract = new web3.eth.Contract(
      data.abi,
      deployedNetwork.address
    );

    console.log("Contract loaded successfully:", deployedNetwork.address);

  } catch (error) {
    console.error("Error loading contract:", error);
    alert("Contract not loaded properly!");
  }
},

   addProduct: async function () {

    try {

        if (!App.contract) {
            alert("Contract not loaded yet!");
            return;
        }

        const manufacturerId = document.getElementById('manufacturerID').value;
        const productName = document.getElementById('productName').value;
        const productSN = document.getElementById('productSN').value;
        const productBrand = document.getElementById('productBrand').value;
        const productPrice = document.getElementById('productPrice').value;

        await App.contract.methods.addProduct(
            manufacturerId,
            productName,
            productSN,
            productBrand,
            productPrice
        ).send({
            from: App.account,
            gas: 3000000
        });

        console.log("Blockchain transaction successful");
        alert("Product added successfully!");

        return true;

    } catch (err) {
        console.error(err);
        alert("Blockchain transaction failed!");
        throw err;
    }
}
};

window.addEventListener("load", function () {
    App.init();
});