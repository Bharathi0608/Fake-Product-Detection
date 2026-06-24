// Check wallet connection on page load
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            displayWalletInfo(accounts[0]);
        }
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                logoutWallet();
            } else {
                displayWalletInfo(accounts[0]);
            }
        });
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }
});

// Connect Wallet
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        displayWalletInfo(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet. Please try again.');
    }
}

// Display Wallet Info
function displayWalletInfo(address) {
    const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    document.getElementById('walletAddress').textContent = shortAddress;
    document.getElementById('walletInfo').classList.remove('hidden');
    document.getElementById('connectWallet').classList.add('hidden');
}

// Logout Wallet
function logoutWallet() {
    localStorage.removeItem('walletAddress');
    document.getElementById('walletInfo').classList.add('hidden');
    document.getElementById('connectWallet').classList.remove('hidden');
}