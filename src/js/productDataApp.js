console.log("productDataApp.js loaded");

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

            await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            const accounts = await web3.eth.getAccounts();
            App.account = accounts[0];

            // Show wallet address
            // document.getElementById("add").innerText = App.account;
            console.log("Connected account:", App.account);

setTimeout(() => {
    const addressElement = document.getElementById("add");
    if (addressElement) {
        addressElement.innerText = App.account;
    } else {
        console.log("Element #add not found");
    }
}, 500);

        } else {
            alert("Please install MetaMask!");
            return;
        }

        return App.loadContract();
    },

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

        return App.bindEvents();
    },

    bindEvents: function () {
        document.getElementById("queryBtn")
            .addEventListener("click", App.queryProducts);
    },

    queryProducts: async function () {

    try {

        const sellerCode = document.getElementById("sellerCode").value;

const sellerCodeHex = web3.utils.asciiToHex(sellerCode);

const result = await App.contracts.product.methods
    .queryProductsList(sellerCodeHex)
    .call();

        console.log("All Products:", result);

        const pids = result[0];
        const pSNs = result[1];
        const pnames = result[2];
        const pbrands = result[3];
        const pprices = result[4];
        const pstatus = result[5];

        const table = document.getElementById("logdata");
        table.innerHTML = "";

        for (let i = 0; i < pids.length; i++) {

    const row = `
        <tr>
            <td>${pids[i]}</td>
            <td>${web3.utils.hexToAscii(pSNs[i]).replace(/\u0000/g, '')}</td>
            <td>${web3.utils.hexToAscii(pnames[i]).replace(/\u0000/g, '')}</td>
            <td>${web3.utils.hexToAscii(pbrands[i]).replace(/\u0000/g, '')}</td>
            <td>${pprices[i]}</td>
            <td>${web3.utils.hexToAscii(pstatus[i]).replace(/\u0000/g, '')}</td>
        </tr>
    `;

    table.innerHTML += row;
}

    } catch (err) {
        console.error("ERROR:", err);
        alert("Error fetching products");
    }
}
        }


window.addEventListener("load", function () {
    App.init();
});