// // // App = {
// // //     web3Provider: null,
// // //     contracts: {},

// // //     init: async function() {
// // //         return await App.initWeb3();
// // //     },

// // //     initWeb3: function() {
// // //         if(window.web3) {
// // //             App.web3Provider = window.web3.currentProvider;
// // //         } else {
// // //             App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
// // //         }

// // //         web3 = new Web3(App.web3Provider);
// // //         return App.initContract();
// // //     },

// // //     initContract: function() {
// // //         $.getJSON('product.json', function(data) {
// // //             var productArtifact = data;
// // //             App.contracts.product = TruffleContract(productArtifact);
// // //             App.contracts.product.setProvider(App.web3Provider);
// // //         });

// // //         return App.bindEvents();
// // //     },

// // //     bindEvents: function() {
// // //         $(document).on('click', '.btn-register', App.getData);
// // //     },

// // //     getData: function(event) {
// // //         event.preventDefault();
// // //         var productSN = document.getElementById('productSN').value;
// // //         var consumerCode = document.getElementById('consumerCode').value;
// // //         var productInstance;

// // //         web3.eth.getAccounts(function(error, accounts) {
// // //             if (error) {
// // //                 console.log(error);
// // //             }

// // //             var account = accounts[0];
// // //             App.contracts.product.deployed().then(function(instance) {
// // //                 productInstance = instance;
// // //                 return productInstance.verifyProduct(
// // //                     web3.fromAscii(productSN),
// // //                     web3.fromAscii(consumerCode),
// // //                     { from: account }
// // //                 );
// // //             }).then(function(result) {
// // //                 var t = "";
// // //                 var tr = "<tr>";

// // //                 // Handle both string and bool return values
// // //                 if (typeof result === "string") {
// // //                     if (result.includes("Genuine")) {
// // //                         tr += "<td>Genuine Product.</td>";
// // //                     } else {
// // //                         tr += "<td>Fake Product.</td>";
// // //                     }
// // //                 } else {
// // //                     if (result) {
// // //                         tr += "<td>Genuine Product.</td>";
// // //                     } else {
// // //                         tr += "<td>Fake Product.</td>";
// // //                     }
// // //                 }

// // //                 tr += "</tr>";
// // //                 t += tr;

// // //                 document.getElementById('logdata').innerHTML = t;
// // //                 document.getElementById('add').innerHTML = account;
// // //             }).catch(function(err) {
// // //                 console.log(err.message);
// // //             });
// // //         });
// // //     }
// // // };

// // // $(function() {
// // //     $(window).load(function() {
// // //         App.init();
// // //     });
// // // });


// // App = {

// //     web3Provider: null,
// //     contracts: {},

// //     init: async function () {
// //         return await App.initWeb3();
// //     },

// //     initWeb3: async function () {

// //         if (window.ethereum) {
// //             App.web3Provider = window.ethereum;
// //             web3 = new Web3(window.ethereum);

// //             try {
// //                 await window.ethereum.request({ method: "eth_requestAccounts" });
// //             } catch (error) {
// //                 console.error("User denied account access");
// //             }

// //         } else {
// //             alert("Please install MetaMask!");
// //             return;
// //         }

// //         return App.initContract();
// //     },

// //     initContract: function () {

// //         $.getJSON('product.json', function (data) {
// //             App.contracts.product = TruffleContract(data);
// //             App.contracts.product.setProvider(App.web3Provider);
// //         });

// //         return App.bindEvents();
// //     },

// //     bindEvents: function () {
// //         $(document).on('click', '.btn-register', App.getData);
// //     },

// //     getData: async function (event) {
// //         event.preventDefault();

// //         const productSN = document.getElementById('productSN').value;
// //         const consumerCode = document.getElementById('consumerCode').value;

// //         if (!productSN || !consumerCode) {
// //             alert("Enter Product SN and Consumer Code");
// //             return;
// //         }

// //         const accounts = await web3.eth.getAccounts();
// //         const account = accounts[0];

// //         const instance = await App.contracts.product.deployed();

// //         try {
// //             const result = await instance.verifyProduct.call(
// //                 web3.utils.fromAscii(productSN),
// //                 web3.utils.fromAscii(consumerCode)
// //             );

// //             let output = "";

// //             if (result === true) {
// //                 output = "<tr><td>Genuine Product ✅</td></tr>";
// //             } else {
// //                 output = "<tr><td>Fake Product ❌</td></tr>";
// //             }

// //             document.getElementById('logdata').innerHTML = output;
// //             document.getElementById('add').innerHTML = account;

// //         } catch (err) {
// //             console.error(err);
// //         }
// //     }
// // };

// // $(function () {
// //     $(window).load(function () {
// //         App.init();
// //     });
// // });

// App = {
//     web3Provider: null,
//     contracts: {},

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

//         $.getJSON('js/Product.json', function (data) {

//             App.contracts.product = TruffleContract(data);
//             App.contracts.product.setProvider(App.web3Provider);
//         });

//         return App.bindEvents();
//     },

//     bindEvents: function () {
//         $('.btn-register').click(App.verifyProduct);
//     },

//     verifyProduct: function (event) {

//         event.preventDefault();

//         var productSN = $('#productSN').val();
//         var consumerCode = $('#consumerCode').val();

//         web3.eth.getAccounts(function (error, accounts) {

//             if (error) {
//                 console.log(error);
//                 return;
//             }

//             var account = accounts[0];

//             App.contracts.product.deployed().then(function (instance) {

//                 return instance.verifyProduct(
//                     web3.fromAscii(productSN),
//                     web3.fromAscii(consumerCode),
//                     { from: account }
//                 );

//             }).then(function (result) {

//                 if (result == true) {
//                     $('#status').html("<h3 style='color:green'>✅ Genuine Product</h3>");
//                 } else {
//                     $('#status').html("<h3 style='color:red'>❌ Fake Product</h3>");
//                 }

//             }).catch(function (err) {
//                 console.log(err.message);
//             });

//         });

//     }
// };

// $(window).load(function () {
//     App.init();
// });

App = {
    web3Provider: null,
    contracts: {},
    account: null,

    init: async function () {
        await App.initWeb3();
        await App.initContract();
        App.bindEvents();
    },

    initWeb3: async function () {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            App.account = accounts[0];
        } else {
            alert("Install MetaMask");
            return;
        }
    },

    initContract: async function () {
        const response = await fetch("js/Product.json");
        const productJSON = await response.json();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = productJSON.networks[networkId];

        App.contracts.product = new web3.eth.Contract(
            productJSON.abi,
            deployedNetwork.address
        );
    },

    bindEvents: function () {
        document
            .querySelector(".btn-register")
            .addEventListener("click", App.verifyProduct);
    },

    verifyProduct: async function (event) {
        event.preventDefault();

        const productSN = document.getElementById("productSN").value;
        const consumerCode = document.getElementById("consumerCode").value;

        try {
            const result = await App.contracts.product.methods
                .verifyProduct(
                    web3.utils.asciiToHex(productSN),
                    web3.utils.asciiToHex(consumerCode)
                )
                .call({ from: App.account });

            if (result) {
                document.getElementById("resultBox").innerHTML =
                    "<h3 style='color:green'>✅ Genuine Product</h3>";
            } else {
                document.getElementById("resultBox").innerHTML =
                    "<h3 style='color:red'>❌ Fake Product</h3>";
            }

            document.getElementById("add").innerHTML = App.account;

        } catch (error) {
            console.log(error);
        }
    }
};

window.addEventListener("load", function () {
    App.init();
});