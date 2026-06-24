
/**
 * Blockchain UI Utilities
 * Provides unified transaction notifications and wallet status
 */

const BlockchainUI = {
    toastContainer: null,

    init: function() {
        this.createToastContainer();
        this.checkNetwork();
    },

    createToastContainer: function() {
        if (document.getElementById('blockchain-toast-container')) return;
        
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'blockchain-toast-container';
        this.toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(this.toastContainer);

        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .bc-toast {
                min-width: 300px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 15px;
                border-left: 5px solid #ccc;
                transform: translateX(120%);
                transition: transform 0.3s ease-out;
                pointer-events: auto;
                font-family: 'Roboto', sans-serif;
            }
            .bc-toast.show { transform: translateX(0); }
            .bc-toast.pending { border-left-color: #ffc107; }
            .bc-toast.success { border-left-color: #28a745; }
            .bc-toast.error { border-left-color: #dc3545; }
            .bc-toast-header { font-weight: bold; margin-bottom: 5px; display: flex; justify-content: space-between; }
            .bc-toast-body { font-size: 14px; color: #666; word-break: break-all; }
            .bc-toast-loader { width: 14px; height: 14px; border: 2px solid #f3f3f3; border-top: 2px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; display: inline-block; margin-right: 8px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    },

    showToast: function(title, message, type = 'pending', txHash = null) {
        const id = 'toast-' + Math.random().toString(36).substr(2, 9);
        const toast = document.createElement('div');
        toast.className = `bc-toast ${type}`;
        toast.id = id;
        
        let txLink = txHash ? `<br><small><a href="#" onclick="BlockchainUI.openExplorer('${txHash}'); return false;" style="color: #007bff;">View Transaction</a></small>` : '';
        
        toast.innerHTML = `
            <div class="bc-toast-header">
                <span>${type === 'pending' ? '<span class="bc-toast-loader"></span>' : ''}${title}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="border:none; background:none; cursor:pointer;">&times;</button>
            </div>
            <div class="bc-toast-body">
                ${message}
                ${txLink}
            </div>
        `;
        
        this.toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        
        if (type !== 'pending') {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 6000);
        }
        
        return id;
    },

    updateToast: function(id, title, message, type) {
        const toast = document.getElementById(id);
        if (toast) {
            toast.className = `bc-toast ${type} show`;
            toast.querySelector('.bc-toast-header span').innerHTML = (type === 'pending' ? '<span class="bc-toast-loader"></span>' : '') + title;
            toast.querySelector('.bc-toast-body').innerHTML = message;
            
            if (type !== 'pending') {
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 6000);
            }
        }
    },

    openExplorer: function(txHash) {
        alert("Transaction Hash: " + txHash + "\nCheck Ganache Transactions tab for details.");
    },

    checkNetwork: async function() {
        if (window.ethereum) {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x1691') { // 5777 in hex
                this.showToast('Network Warning', 'Please connect MetaMask to Ganache (Network ID 5777, RPC http://127.0.0.1:7545)', 'error');
            }
        }
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BlockchainUI.init());
} else {
    BlockchainUI.init();
}
