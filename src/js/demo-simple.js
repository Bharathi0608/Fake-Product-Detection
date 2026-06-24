// File: js/demo-simple.js - SIMPLE GUARANTEED WORKING VERSION

// SIMPLE TEST - Remove this after testing
console.log("DEMO SIMPLE JS LOADED!");
alert("Demo JS is loading!");

// SIMPLE AUTO-FILL FUNCTION
function autoFillFormSimple() {
    console.log("autoFillFormSimple called");
    
    try {
        // Fill form fields directly
        document.getElementById('companyName').value = "Apple Inc. (Demo)";
        document.getElementById('registrationNumber').value = "US-2023-12345";
        document.getElementById('taxId').value = "GSTIN27ABCDE1234F";
        document.getElementById('physicalAddress').value = "One Apple Park Way, Cupertino, CA 95014, USA";
        document.getElementById('phone').value = "9876543210";
        document.getElementById('email').value = "demo@apple.com";
        document.getElementById('governmentId').value = "PASSPORT-A1234567";
        document.getElementById('documentProof').value = "QmXyZ123abc456def789ghi";
        
        alert("✅ Form auto-filled successfully!");
        
    } catch (error) {
        console.error("Error in autoFillFormSimple:", error);
        alert("❌ Error: " + error.message);
    }
}

// SIMPLE QUICK START FUNCTION
function quickStartDemoSimple() {
    console.log("quickStartDemoSimple called");
    
    try {
        // Set demo data
        localStorage.setItem('demoMode', 'true');
        localStorage.setItem('demoManufacturer', '0xDemoManufacturer123');
        localStorage.setItem('demoManufacturerId', 'DEMO_MFG_001');
        localStorage.setItem('demoManufacturerName', 'Apple Inc. (Demo)');
        
        alert("🚀 Quick Start Demo Activated!\n\nRedirecting to manufacturer dashboard...");
        
        // Redirect after 1 second
        setTimeout(function() {
            window.location.href = 'manufacturer.html';
        }, 1000);
        
    } catch (error) {
        console.error("Error in quickStartDemoSimple:", error);
        alert("❌ Error: " + error.message);
    }
}

// SIMPLE FULL FLOW FUNCTION
function fullFlowDemoSimple() {
    console.log("fullFlowDemoSimple called");
    
    try {
        // First auto-fill the form
        autoFillFormSimple();
        
        // Then show messages and redirect
        setTimeout(function() {
            alert("📋 Form submitted successfully!\n\nSimulating admin approval...");
            
            setTimeout(function() {
                alert("✅ Admin approved your registration!\n\nSetting up demo mode...");
                
                // Set demo data
                localStorage.setItem('demoMode', 'true');
                localStorage.setItem('demoManufacturer', '0xDemoManufacturer123');
                localStorage.setItem('demoManufacturerId', 'DEMO_MFG_001');
                localStorage.setItem('demoManufacturerName', 'Apple Inc. (Demo)');
                
                setTimeout(function() {
                    alert("🎉 Demo setup complete!\n\nRedirecting to manufacturer dashboard...");
                    window.location.href = 'manufacturer.html';
                }, 1000);
                
            }, 2000);
        }, 1000);
        
    } catch (error) {
        console.error("Error in fullFlowDemoSimple:", error);
        alert("❌ Error: " + error.message);
    }
}

// Make functions globally available
window.autoFillFormSimple = autoFillFormSimple;
window.quickStartDemoSimple = quickStartDemoSimple;
window.fullFlowDemoSimple = fullFlowDemoSimple;

// Test that functions are available
console.log("Functions available:", {
    autoFillFormSimple: typeof autoFillFormSimple,
    quickStartDemoSimple: typeof quickStartDemoSimple,
    fullFlowDemoSimple: typeof fullFlowDemoSimple
});