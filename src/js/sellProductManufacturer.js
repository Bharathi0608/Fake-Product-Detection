// App = {

//     web3Provider: null,
//     contracts: {},
//     account: null,

//     init: function () {
//         return App.initWeb3();
//     },

//     initWeb3: function () {

//         if (typeof web3 !== 'undefined') {
//             App.web3Provider = web3.currentProvider;
//             web3 = new Web3(web3.currentProvider);
//         } else {
//             alert("Please install MetaMask!");
//             return;
//         }

//         return App.initContract();
//     },

//     initContract: function () {

//         $.getJSON('Product.json', function (data){

//             App.contracts.product = TruffleContract(data);
//             App.contracts.product.setProvider(App.web3Provider);

//         });

//         return App.bindEvents();
//     },

//     bindEvents: function () {
//         $(document).on('click', '.btn-register', App.sellProduct);
//     },

//     sellProduct: function (event) {

//         event.preventDefault();

//         var productSN = $('#productSN').val();
//         var sellerCode = $('#sellerCode').val();

//         if (!productSN || !sellerCode) {
//             alert("Enter Product SN and Seller Code");
//             return;
//         }

//         web3.eth.getAccounts(function (error, accounts) {

//             if (error) {
//                 console.log(error);
//                 return;
//             }

//             var account = accounts[0];

//             App.contracts.product.deployed().then(function (instance) {

//                 // return instance.manufacturerSellProduct(
//                 //     // web3.fromAscii(productSN),
//                 //     // web3.fromAscii(sellerCode),
//                 //     web3.utils.padRight(web3.utils.asciiToHex(productSN), 64),
//                 //     web3.utils.padRight(web3.utils.asciiToHex(sellerCode), 64),
//                 //     { from: account }
//                 // );
//                 const productSNHex = web3.utils.padRight(
//     web3.utils.asciiToHex(productSN),
//     64
// );

// const sellerCodeHex = web3.utils.padRight(
//     web3.utils.asciiToHex(sellerCode),
//     64
// );

// return instance.manufacturerSellProduct(
//     productSNHex,
//     sellerCodeHex,
//     { from: account }
// );
//             }).then(function (result) {

//                 alert("✅ Transaction Successful!");
//                 window.location.reload();

//             }).catch(function (err) {

//                 console.log(err.message);
//                 alert("Transaction Failed");

//             });

//         });

//     }

// };

// $(function () {
//     $(window).load(function () {
//         App.init();
//     });
// });

let web3;
let contract;
let account;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        account = accounts[0];

        const response = await fetch("Product.json");
        const productJson = await response.json();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = productJson.networks[networkId];

        if (!deployedNetwork) {
            alert("Contract not deployed on this network");
            return;
        }

        contract = new web3.eth.Contract(
            productJson.abi,
            deployedNetwork.address
        );

        console.log("Contract Loaded:", contract);
    } else {
        alert("Please install MetaMask!");
    }
});

async function sellProduct(event) {
    event.preventDefault();

    const productSN = document.getElementById("productSN").value;
    const sellerCode = document.getElementById("sellerCode").value;

    if (!productSN || !sellerCode) {
        alert("Enter Product SN and Seller Code");
        return;
    }

    try {
        const productSNHex = web3.utils.padRight(
            web3.utils.asciiToHex(productSN),
            64
        );

        const sellerCodeHex = web3.utils.padRight(
            web3.utils.asciiToHex(sellerCode),
            64
        );

        await contract.methods
            .manufacturerSellProduct(productSNHex, sellerCodeHex)
            .send({ from: account });

        alert("✅ Transaction Successful!");
        window.location.reload();

    } catch (error) {
        console.error(error);
        alert("Transaction Failed");
    }
}