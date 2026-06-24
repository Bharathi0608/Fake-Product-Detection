// File: js/demo-product-contract.js

class DemoProductContract {
    constructor() {
        this.demoMode = localStorage.getItem('demoMode') === 'true';
        this.demoData = {
            manufacturerId: localStorage.getItem('demoManufacturerId') || 'DEMO_MFG_001',
            demoProducts: [],
            demoSellers: []
        };
    }

    // Check if we should use demo mode
    shouldUseDemo() {
        return this.demoMode && !window.ethereum;
    }

    // Demo version of addProduct
    async demoAddProduct(productName, productSN, productBrand, productPrice) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const product = {
                    id: this.demoData.demoProducts.length + 1,
                    name: productName,
                    sn: productSN,
                    brand: productBrand,
                    price: productPrice,
                    status: 'Available',
                    manufacturerId: this.demoData.manufacturerId
                };
                
                this.demoData.demoProducts.push(product);
                localStorage.setItem('demoProducts', JSON.stringify(this.demoData.demoProducts));
                
                console.log('Demo Product Added:', product);
                resolve({ success: true, message: '✅ Product added successfully (Demo Mode)' });
            }, 1000);
        });
    }

    // Demo version of addSeller
    async demoAddSeller(sellerName, sellerBrand, sellerCode, sellerNum, sellerManager, sellerAddress) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const seller = {
                    id: this.demoData.demoSellers.length + 1,
                    name: sellerName,
                    brand: sellerBrand,
                    code: sellerCode,
                    phone: sellerNum,
                    manager: sellerManager,
                    address: sellerAddress
                };
                
                this.demoData.demoSellers.push(seller);
                localStorage.setItem('demoSellers', JSON.stringify(this.demoData.demoSellers));
                
                console.log('Demo Seller Added:', seller);
                resolve({ success: true, message: '✅ Seller added successfully (Demo Mode)' });
            }, 1000);
        });
    }

    // Demo version of view products
    async demoViewProducts() {
        const products = JSON.parse(localStorage.getItem('demoProducts') || '[]');
        return products;
    }

    // Demo version of view sellers
    async demoViewSellers() {
        const sellers = JSON.parse(localStorage.getItem('demoSellers') || '[]');
        return sellers;
    }

    // Generate demo manufacturer ID
    generateDemoManufacturerId() {
        return 'DEMO_MFG_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Setup demo mode if needed
    setupDemoMode() {
        if (this.demoMode && !localStorage.getItem('demoManufacturerId')) {
            const demoId = this.generateDemoManufacturerId();
            localStorage.setItem('demoManufacturerId', demoId);
            localStorage.setItem('demoManufacturer', '0xDemoManufacturerAddress');
        }
    }
}

// Global instance
window.demoProductContract = new DemoProductContract();