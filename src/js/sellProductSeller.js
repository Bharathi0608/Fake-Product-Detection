// // // // // App = {

// // // // //     web3Provider: null,
// // // // //     contracts: {},

// // // // //     init: async function() {
// // // // //         return await App.initWeb3();
// // // // //     },

// // // // //     initWeb3: function() {
// // // // //         if(window.web3) {
// // // // //             App.web3Provider=window.web3.currentProvider;
// // // // //         } else {
// // // // //             App.web3Provider=new Web3.proviers.HttpProvider('http://localhost:7545');
// // // // //         }

// // // // //         web3 = new Web3(App.web3Provider);
// // // // //         return App.initContract();
// // // // //     },

// // // // //     initContract: function() {

// // // // //         $.getJSON('product.json',function(data){

// // // // //             var productArtifact=data;
// // // // //             App.contracts.product=TruffleContract(productArtifact);
// // // // //             App.contracts.product.setProvider(App.web3Provider);
// // // // //         });

// // // // //         return App.bindEvents();
// // // // //     },

// // // // //     bindEvents: function() {

// // // // //         $(document).on('click','.btn-register',App.registerProduct);
// // // // //     },

// // // // //     registerProduct: function(event) {
// // // // //         event.preventDefault();

// // // // //         var productInstance;

// // // // //         var productSN = document.getElementById('productSN').value;
// // // // //         var consumerCode = document.getElementById('consumerCode').value;
 
// // // // //         //window.ethereum.enable();
// // // // //         web3.eth.getAccounts(function(error,accounts){

// // // // //             if(error) {
// // // // //                 console.log(error);
// // // // //             }

// // // // //             console.log(accounts);
// // // // //             var account=accounts[0];
// // // // //             // console.log(account);

// // // // //             App.contracts.product.deployed().then(function(instance){
// // // // //                 productInstance=instance;
// // // // //                 return productInstance.sellerSellProduct(web3.fromAscii(productSN),web3.fromAscii(consumerCode), {from:account});
// // // // //              }).then(function(result){
// // // // //                 // console.log(result);
// // // // //                 window.location.reload();
// // // // //                 document.getElementById('sellerName').innerHTML='';
// // // // //                 document.getElementById('sellerBrand').innerHTML='';

// // // // //             }).catch(function(err){
// // // // //                 console.log(err.message);
// // // // //             });
// // // // //         });
// // // // //     }
// // // // // };

// // // // // $(function() {

// // // // //     $(window).load(function() {
// // // // //         App.init();
// // // // //     })
// // // // // })


// // // // App = {

// // // //     web3Provider: null,
// // // //     contracts: {},

// // // //     init: async function () {
// // // //         return await App.initWeb3();
// // // //     },

// // // //     initWeb3: async function () {

// // // //         if (window.ethereum) {
// // // //             App.web3Provider = window.ethereum;
// // // //             web3 = new Web3(window.ethereum);

// // // //             try {
// // // //                 await window.ethereum.request({ method: "eth_requestAccounts" });
// // // //             } catch (error) {
// // // //                 console.error("User denied account access");
// // // //             }

// // // //         } else {
// // // //             alert("Please install MetaMask!");
// // // //             return;
// // // //         }

// // // //         return App.initContract();
// // // //     },

// // // //     initContract: function () {

// // // //         $.getJSON('product.json', function (data) {
// // // //             App.contracts.product = TruffleContract(data);
// // // //             App.contracts.product.setProvider(App.web3Provider);
// // // //         });

// // // //         return App.bindEvents();
// // // //     },

// // // //     bindEvents: function () {
// // // //         $(document).on('click', '.btn-register', App.registerProduct);
// // // //     },

// // // //     registerProduct: async function (event) {
// // // //         event.preventDefault();

// // // //         const productSN = document.getElementById('productSN').value;
// // // //         const consumerCode = document.getElementById('consumerCode').value;

// // // //         if (!productSN || !consumerCode) {
// // // //             alert("Please enter Product SN and Consumer Code");
// // // //             return;
// // // //         }

// // // //         const accounts = await web3.eth.getAccounts();
// // // //         const account = accounts[0];

// // // //         const instance = await App.contracts.product.deployed();

// // // //         try {
// // // //             await instance.sellerSellProduct(
// // // //                 web3.utils.fromAscii(productSN),
// // // //                 web3.utils.fromAscii(consumerCode),
// // // //                 { from: account }
// // // //             );

// // // //             alert("Product successfully sold to Consumer ✅");
// // // //             window.location.reload();

// // // //         } catch (err) {
// // // //             console.error(err);
// // // //         }
// // // //     }
// // // // };

// // // // $(function () {
// // // //     $(window).load(function () {
// // // //         App.init();
// // // //     });
// // // // });


// // // App = {

// // //     web3Provider: null,
// // //     contracts: {},
// // //     account: null,

// // //     init: async function () {
// // //         return await App.initWeb3();
// // //     },

// // //     initWeb3: async function () {

// // //         if (window.ethereum) {

// // //             App.web3Provider = window.ethereum;
// // //             web3 = new Web3(window.ethereum);

// // //             await window.ethereum.request({ method: "eth_requestAccounts" });

// // //             const accounts = await web3.eth.getAccounts();
// // //             App.account = accounts[0];

// // //         } else {
// // //             alert("Please install MetaMask!");
// // //             return;
// // //         }

// // //         return App.initContract();
// // //     },

// // //     initContract: function () {

// // //         $.getJSON('product.json', function (data) {

// // //             App.contracts.product = TruffleContract(data);
// // //             App.contracts.product.setProvider(App.web3Provider);

// // //         });

// // //         return App.bindEvents();
// // //     },

// // //     bindEvents: function () {
// // //         $(document).on('click', '.btn-register', App.sellToConsumer);
// // //     },

// // //     sellToConsumer: async function (event) {

// // //         event.preventDefault();

// // //         try {

// // //             const productSN = $('#productSN').val();
// // //             const consumerCode = $('#consumerCode').val();

// // //             const instance = await App.contracts.product.deployed();

// // //             await instance.sellerSellProduct(
// // //                 web3.utils.asciiToHex(productSN),
// // //                 web3.utils.asciiToHex(consumerCode),
// // //                 { from: App.account }
// // //             );

// // //             alert("Product sold to consumer ✅");

// // //             window.location.reload();

// // //         } catch (err) {
// // //             console.error(err);
// // //             alert(err.message);
// // //         }
// // //     }

// // // };

// // // $(function () {
// // //     $(window).load(function () {
// // //         App.init();
// // //     });
// // // });


// // App = {
// //     web3Provider: null,
// //     contracts: {},

// //     init: function () {
// //         return App.initWeb3();
// //     },

// //     initWeb3: function () {

// //         if (typeof web3 !== 'undefined') {
// //             App.web3Provider = web3.currentProvider;
// //             web3 = new Web3(web3.currentProvider);
// //         } else {
// //             alert("Please install MetaMask!");
// //             return;
// //         }

// //         return App.initContract();
// //     },

// //     initContract: function () {

// //         $.getJSON('js/Product.json', function (data) {

// //             App.contracts.product = TruffleContract(data);
// //             App.contracts.product.setProvider(App.web3Provider);
// //         });

// //         return App.bindEvents();
// //     },

// //     bindEvents: function () {
// //         $('.btn-register').click(App.sellProduct);
// //     },

// //     sellProduct: function (event) {

// //         event.preventDefault();

// //         var productSN = $('#productSN').val();
// //         var consumerCode = $('#consumerCode').val();

// //         if (!productSN || !consumerCode) {
// //             alert("Enter Product SN and Consumer Code");
// //             return;
// //         }

// //         web3.eth.getAccounts(function (error, accounts) {

// //             if (error) {
// //                 console.log(error);
// //                 return;
// //             }

// //             var account = accounts[0];

// //             App.contracts.product.deployed().then(function (instance) {

// //                 return instance.sellerSellProduct(
// //                     web3.fromAscii(productSN),
// //                     web3.fromAscii(consumerCode),
// //                     { from: account }
// //                 );

// //             }).then(function () {

// //                 alert("✅ Product sold to Consumer!");
// //                 window.location.reload();

// //             }).catch(function (err) {

// //                 console.log(err);
// //                 alert("Transaction failed");

// //             });

// //         });

// //     }
// // };

// // $(window).load(function () {
// //     App.init();
// // });


// App = {
//     web3Provider: null,
//     contracts: {},
//     account: null,

//     init: async function () {
//         return await App.initWeb3();
//     },

//     initWeb3: async function () {

//         if (window.ethereum) {

//             App.web3Provider = window.ethereum;
//             web3 = new Web3(window.ethereum);

//             try {
//                 await window.ethereum.request({ method: "eth_requestAccounts" });
//                 const accounts = await web3.eth.getAccounts();
//                 App.account = accounts[0];

//                 console.log("Connected account:", App.account);

//             } catch (error) {
//                 console.error("User denied MetaMask access");
//                 return;
//             }

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
//         $(document).on('click', '.btn-register', App.sellProduct);
//     },

//     sellProduct: async function (event) {

//         event.preventDefault();

//         const productSN = $('#productSN').val();
//         const consumerCode = $('#consumerCode').val();

//         if (!productSN || !consumerCode) {
//             alert("Enter Product SN and Consumer Code");
//             return;
//         }

//         try {

//             const instance = await App.contracts.product.deployed();

//             console.log("Sending transaction from:", App.account);

//             await instance.sellerSellProduct(
//                 web3.utils.asciiToHex(productSN),
//                 web3.utils.asciiToHex(consumerCode),
//                 { from: App.account }
//             );

//             alert("✅ Product Sold Successfully!");
//             window.location.reload();

//         } catch (err) {
//             console.error(err);
//             alert("❌ Transaction Failed");
//         }
//     }
// };

// $(function () {
//     $(window).load(function () {
//         App.init();
//     });
// });



App = {
    web3Provider: null,
    contracts: {},
    account: null,

    init: async function () {
        return await App.initWeb3();
    },

    initWeb3: async function () {

        if (window.ethereum) {

            App.web3Provider = window.ethereum;
            window.web3 = new Web3(window.ethereum);

            try {
                // Connect MetaMask
                await window.ethereum.request({ method: "eth_requestAccounts" });

                const accounts = await web3.eth.getAccounts();
                App.account = accounts[0];

                console.log("Connected account:", App.account);

            } catch (error) {
                console.error("User denied MetaMask access");
                return;
            }

        } else {
            alert("Please install MetaMask!");
            return;
        }

        return App.loadContract();
    },

    // 🔥 NEW FUNCTION (Replaces TruffleContract)
    loadContract: async function () {

        const response = await fetch('js/Product.json');
        const data = await response.json();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = data.networks[networkId];

        if (!deployedNetwork) {
            alert("Contract not deployed on this network!");
            return;
        }

        App.contracts.product = new web3.eth.Contract(
            data.abi,
            deployedNetwork.address
        );

        console.log("Contract loaded at:", deployedNetwork.address);

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-register', App.sellProduct);
    },

    sellProduct: async function (event) {

        event.preventDefault();

        const productSN = $('#productSN').val();
        const consumerCode = $('#consumerCode').val();

        if (!productSN || !consumerCode) {
            alert("Enter Product SN and Consumer Code");
            return;
        }

        try {

            console.log("Sending transaction from:", App.account);

            await App.contracts.product.methods
                .sellerSellProduct(
                    web3.utils.asciiToHex(productSN),
                    web3.utils.asciiToHex(consumerCode)
                )
                .send({ from: App.account });

            alert("✅ Product Sold Successfully!");
            window.location.reload();

        } catch (err) {
            console.error(err);
            alert("❌ Transaction Failed");
        }
    }
};

$(function () {
    $(window).on('load', function () {
        App.init();
    });
});