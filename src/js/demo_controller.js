// File: js/demo-controller.js
// Complete Demo Controller for Fake Product Detection System

const DemoController = {
    // Test data for demo
    testData: {
        manufacturers: [
            {
                address: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
                name: "Apple Inc. (Demo)",
                manufacturerId: "DEMO_MFG_APPLE_001",
                registration: "US-2023-12345",
                taxId: "GSTIN27ABCDE1234F",
                govId: "PASSPORT-A1234567",
                ipfsHash: "QmXyZ123abc456def789ghi",
                addressText: "One Apple Park Way, Cupertino, CA 95014, USA",
                phone: "9876543210",
                email: "manufacturer@apple-demo.com"
            },
            {
                address: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
                name: "Samsung Electronics (Demo)",
                manufacturerId: "DEMO_MFG_SAMSUNG_001",
                registration: "KR-2023-67890",
                taxId: "GSTIN28XYZUVW9876E",
                govId: "AADHAAR-987654321012",
                ipfsHash: "QmJkL456mno789pqr012stu",
                addressText: "129 Samsung-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do, South Korea",
                phone: "9123456789",
                email: "manufacturer@samsung-demo.com"
            }
        ],
        products: [
            { name: "iPhone 15 Pro", sn: "IPHONE15-PRO-001", brand: "Apple", price: "99999" },
            { name: "Samsung Galaxy S23", sn: "GALAXYS23-001", brand: "Samsung", price: "79999" },
            { name: "AirPods Pro", sn: "AIRPODSPRO-001", brand: "Apple", price: "24999" }
        ]
    },

    // Initialize demo system
    init: function() {
        console.log("Demo Controller Initialized");
        
        // Add demo styles
        this.addStyles();
        
        // Create demo toggle button
        this.createToggleButton();
        
        // Check if we should auto-show panel on registration page
        if (window.location.pathname.includes('manufacturerRegistration.html')) {
            setTimeout(() => {
                this.createDemoPanel();
            }, 500);
        }
        
        // Check if we're coming from full flow demo
        if (localStorage.getItem('fullFlowDemo') === 'true') {
            this.autoFillForm();
            localStorage.removeItem('fullFlowDemo');
        }
    },

    // Auto-fill the manufacturer registration form
    autoFillForm: function() {
        try {
            const form = document.getElementById('manufacturerRegistrationForm');
            if (!form) {
                console.error('Registration form not found');
                return;
            }
            
            const testData = this.testData.manufacturers[0];
            
            // Fill all form fields
            const fields = {
                'companyName': testData.name,
                'registrationNumber': testData.registration,
                'taxId': testData.taxId,
                'physicalAddress': testData.addressText,
                'phone': testData.phone,
                'email': testData.email,
                'governmentId': testData.govId,
                'documentProof': testData.ipfsHash
            };
            
            // Fill each field
            for (const [fieldId, value] of Object.entries(fields)) {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = value;
                    // Trigger change event
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            // Show success message
            this.showToast('✅ Form auto-filled with demo data!', 'success');
            
            // Scroll to submit button
            setTimeout(() => {
                document.querySelector('button[type="submit"]').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 500);
            
        } catch (error) {
            console.error('Auto-fill error:', error);
            this.showToast('❌ Error auto-filling form', 'error');
        }
    },

    // Quick Start Demo - Skip KYC entirely
    quickStartDemo: async function() {
        try {
            // Check if MetaMask is available
            if (typeof window.ethereum === 'undefined') {
                this.showToast('Please install MetaMask first!', 'error');
                return;
            }
            
            // Request accounts
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length === 0) {
                this.showToast('Please connect your wallet!', 'error');
                return;
            }
            
            // Set demo flags
            localStorage.setItem('demoMode', 'true');
            localStorage.setItem('demoManufacturer', this.testData.manufacturers[0].address);
            localStorage.setItem('demoManufacturerId', this.testData.manufacturers[0].manufacturerId);
            localStorage.setItem('demoManufacturerName', this.testData.manufacturers[0].name);
            
            this.showToast('🚀 Quick Start Demo Activated!', 'success');
            
            // Redirect to manufacturer dashboard
            setTimeout(() => {
                window.location.href = 'manufacturer.html';
            }, 1500);
            
        } catch (error) {
            console.error('Quick start error:', error);
            this.showToast('Error starting demo: ' + error.message, 'error');
        }
    },

    // Full Flow Demo
    fullFlowDemo: async function() {
        try {
            if (typeof window.ethereum === 'undefined') {
                this.showToast('Please install MetaMask first!', 'error');
                return;
            }
            
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length === 0) {
                this.showToast('Please connect your wallet!', 'error');
                return;
            }
            
            // Set full flow flag
            localStorage.setItem('fullFlowDemo', 'true');
            
            // Redirect to registration page
            window.location.href = 'manufacturerRegistration.html';
            
        } catch (error) {
            console.error('Full flow error:', error);
            this.showToast('Error: ' + error.message, 'error');
        }
    },

    // Reset demo data
    resetDemo: function() {
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoManufacturer');
        localStorage.removeItem('demoManufacturerId');
        localStorage.removeItem('demoManufacturerName');
        localStorage.removeItem('fullFlowDemo');
        localStorage.removeItem('demoProducts');
        localStorage.removeItem('demoSellers');
        
        this.showToast('✅ Demo data reset successfully!', 'success');
        
        // Reload if on manufacturer page
        if (window.location.pathname.includes('manufacturer.html')) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    },

    // Create toggle button
    createToggleButton: function() {
        if (document.getElementById('demo-toggle-btn')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'demo-toggle-btn';
        toggleBtn.innerHTML = '🚀';
        toggleBtn.title = 'Toggle Demo Panel';
        toggleBtn.onclick = () => {
            const panel = document.getElementById('demo-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            } else {
                this.createDemoPanel();
            }
        };
        
        document.body.appendChild(toggleBtn);
    },

    // Create demo panel
    createDemoPanel: function() {
        if (document.getElementById('demo-panel')) {
            document.getElementById('demo-panel').style.display = 'block';
            return;
        }
        
        const panel = document.createElement('div');
        panel.id = 'demo-panel';
        panel.innerHTML = `
            <div class="demo-header">
                <h4>🚀 Demo Controller</h4>
                <button class="demo-close" onclick="document.getElementById('demo-panel').style.display='none'">×</button>
            </div>
            <div class="demo-body">
                <div class="demo-status">
                    <strong>Demo Mode:</strong> 
                    <span class="demo-status-indicator ${localStorage.getItem('demoMode') === 'true' ? 'active' : 'inactive'}">
                        ${localStorage.getItem('demoMode') === 'true' ? '✅ ACTIVE' : '❌ INACTIVE'}
                    </span>
                </div>
                
                <div class="demo-buttons">
                    <button class="demo-btn quick-start" onclick="DemoController.quickStartDemo()">
                        🚀 Quick Start
                    </button>
                    <button class="demo-btn full-flow" onclick="DemoController.fullFlowDemo()">
                        🔄 Full Flow
                    </button>
                    <button class="demo-btn reset" onclick="DemoController.resetDemo()">
                        🔄 Reset
                    </button>
                </div>
                
                ${window.location.pathname.includes('manufacturerRegistration.html') ? `
                    <button class="demo-btn auto-fill" onclick="DemoController.autoFillForm()" style="margin-top: 10px;">
                        📝 Auto-fill Form
                    </button>
                ` : ''}
                
                ${localStorage.getItem('demoMode') === 'true' ? `
                    <div class="demo-info">
                        <p><strong>Demo Account:</strong> ${localStorage.getItem('demoManufacturerName') || 'Demo Manufacturer'}</p>
                        <p><strong>Manufacturer ID:</strong> ${localStorage.getItem('demoManufacturerId') || 'DEMO_MFG_001'}</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(panel);
    },

    // Add CSS styles
    addStyles: function() {
        if (document.getElementById('demo-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'demo-styles';
        style.textContent = `
            #demo-toggle-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
                color: white;
                border: none;
                font-size: 24px;
                cursor: pointer;
                z-index: 10000;
                box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
                transition: all 0.3s ease;
            }
            
            #demo-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255, 152, 0, 0.6);
            }
            
            #demo-panel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 300px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                z-index: 9999;
                border: 2px solid #4CAF50;
                font-family: 'Roboto', sans-serif;
                display: none;
            }
            
            .demo-header {
                background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
                color: white;
                padding: 15px;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .demo-header h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .demo-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                line-height: 1;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .demo-close:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .demo-body {
                padding: 20px;
            }
            
            .demo-status {
                margin-bottom: 15px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 6px;
                font-size: 14px;
            }
            
            .demo-status-indicator.active {
                color: #4CAF50;
                font-weight: bold;
            }
            
            .demo-status-indicator.inactive {
                color: #f44336;
            }
            
            .demo-buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin: 15px 0;
            }
            
            .demo-btn {
                padding: 12px 15px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .demo-btn.quick-start {
                background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
                color: white;
            }
            
            .demo-btn.full-flow {
                background: linear-gradient(135deg, #2196F3 0%, #0D47A1 100%);
                color: white;
            }
            
            .demo-btn.reset {
                background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
                color: white;
            }
            
            .demo-btn.auto-fill {
                background: linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%);
                color: white;
                width: 100%;
            }
            
            .demo-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(0,0,0,0.2);
            }
            
            .demo-info {
                margin-top: 20px;
                padding: 15px;
                background: #e8f5e9;
                border-radius: 8px;
                border-left: 4px solid #4CAF50;
                font-size: 12px;
            }
            
            .demo-info p {
                margin: 8px 0;
                word-break: break-all;
            }
            
            /* Toast notifications */
            .demo-toast {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                z-index: 10001;
                font-weight: 500;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                animation: slideDown 0.3s ease;
            }
            
            @keyframes slideDown {
                from {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
            
            .demo-toast.success {
                background: #4CAF50;
            }
            
            .demo-toast.error {
                background: #f44336;
            }
        `;
        
        document.head.appendChild(style);
    },

    // Show toast notification
    showToast: function(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.demo-toast');
        if (existingToast) existingToast.remove();
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `demo-toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // Check if in demo mode
    isDemoMode: function() {
        return localStorage.getItem('demoMode') === 'true';
    },

    // Get demo manufacturer data
    getDemoManufacturerData: function() {
        if (this.isDemoMode()) {
            return {
                address: localStorage.getItem('demoManufacturer') || this.testData.manufacturers[0].address,
                id: localStorage.getItem('demoManufacturerId') || this.testData.manufacturers[0].manufacturerId,
                name: localStorage.getItem('demoManufacturerName') || this.testData.manufacturers[0].name
            };
        }
        return null;
    }
};

// Make it globally available
window.DemoController = DemoController;

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    DemoController.init();
});