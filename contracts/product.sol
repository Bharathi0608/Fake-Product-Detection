// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Product {

    uint256 sellerCount;
    uint256 productCount;

    struct seller{
        uint256 sellerId;
        bytes32 sellerName;
        bytes32 sellerBrand;
        bytes32 sellerCode;
        uint256 sellerNum;
        bytes32 sellerManager;
        bytes32 sellerAddress;
    }
    mapping(uint=>seller) public sellers;

    struct productItem{
        uint256 productId;
        bytes32 productSN;
        bytes32 productName;
        bytes32 productBrand;
        uint256 productPrice;
        bytes32 productStatus;
    }

    mapping(uint256=>productItem) public productItems;
    mapping(bytes32=>uint256) public productMap;
    mapping(bytes32=>bytes32) public productsManufactured;
    mapping(bytes32=>bytes32) public productsForSale;
    mapping(bytes32=>bytes32) public productsSold;
    mapping(bytes32=>bytes32[]) public productsWithSeller;
    mapping(bytes32=>bytes32[]) public productsWithConsumer;
    mapping(bytes32=>bytes32[]) public sellersWithManufacturer;

    // ========================= DEMO MODE ADDITIONS =========================
    
    address public admin;
    bool public isDemoMode = true; // Enable for demo by default
    
    // Pre-approved test manufacturer addresses for demo
    address[] public demoManufacturers;
    
    // Demo test accounts (Common test addresses)
    address public constant TEST_MANUFACTURER_1 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
    address public constant TEST_MANUFACTURER_2 = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db;
    address public constant TEST_SELLER_1 = 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB;
    address public constant TEST_CONSUMER_1 = 0x617F2E2fD72FD9D5503197092aC168c91465E7f2;
    
    // Track verified manufacturers
    mapping(address => bool) public isVerifiedManufacturer;
    mapping(address => bytes32) public manufacturerIds; // Map address to manufacturer code
    
    // Events for demo
    event ManufacturerVerified(address indexed manufacturer, bytes32 manufacturerId);
    event DemoModeToggled(bool status);
    event DemoManufacturerAdded(address indexed manufacturer, bytes32 manufacturerId);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    modifier onlyVerifiedManufacturer() {
        require(
            isVerifiedManufacturer[msg.sender] || 
            (isDemoMode && isDemoAccount(msg.sender)), 
            "Not a verified manufacturer"
        );
        _;
    }
    
    // ========================= CONSTRUCTOR =========================
    
    constructor() {
        admin = msg.sender;
        
        // Add test accounts to demo manufacturers list
        demoManufacturers.push(TEST_MANUFACTURER_1);
        demoManufacturers.push(TEST_MANUFACTURER_2);
        
        // Auto-create manufacturer IDs for demo accounts
        manufacturerIds[TEST_MANUFACTURER_1] = keccak256(abi.encodePacked("DEMO_MANUFACTURER_1"));
        manufacturerIds[TEST_MANUFACTURER_2] = keccak256(abi.encodePacked("DEMO_MANUFACTURER_2"));
        
        // Auto-verify demo manufacturers in demo mode
        if (isDemoMode) {
            for(uint i = 0; i < demoManufacturers.length; i++) {
                isVerifiedManufacturer[demoManufacturers[i]] = true;
                emit ManufacturerVerified(demoManufacturers[i], manufacturerIds[demoManufacturers[i]]);
            }
        }
    }
    
    // ========================= DEMO MODE FUNCTIONS =========================
    
    // Admin can toggle demo mode
    function toggleDemoMode(bool _status) public onlyAdmin {
        isDemoMode = _status;
        emit DemoModeToggled(_status);
    }
    
    // Add a demo manufacturer (for quick testing)
    function addDemoManufacturer(address manufacturer, bytes32 manufacturerCode) public onlyAdmin {
        demoManufacturers.push(manufacturer);
        isVerifiedManufacturer[manufacturer] = true;
        manufacturerIds[manufacturer] = manufacturerCode;
        emit DemoManufacturerAdded(manufacturer, manufacturerCode);
    }
    
    // Check if account is a demo account
    function isDemoAccount(address account) public view returns (bool) {
        for(uint i = 0; i < demoManufacturers.length; i++) {
            if(demoManufacturers[i] == account) {
                return true;
            }
        }
        return false;
    }
    
    // Quick verify any address for demo (bypasses KYC)
    function quickVerifyForDemo(address manufacturer, bytes32 manufacturerCode) public onlyAdmin {
        isVerifiedManufacturer[manufacturer] = true;
        manufacturerIds[manufacturer] = manufacturerCode;
        emit ManufacturerVerified(manufacturer, manufacturerCode);
    }
    
    // Register manufacturer (for real KYC flow - simplified for demo)
    function registerManufacturer(
        string memory companyName,
        string memory registrationNumber,
        string memory taxId,
        string memory physicalAddress,
        string memory phoneNumber,
        string memory email,
        string memory governmentIdHash,
        string memory documentProofHash
    ) external returns (bytes32) {
        // Generate a manufacturer ID from company name
        bytes32 manufacturerId = keccak256(abi.encodePacked(companyName, block.timestamp, msg.sender));
        
        // Store the mapping
        manufacturerIds[msg.sender] = manufacturerId;
        
        return manufacturerId;
    }
    
    // Admin approves manufacturer (for real KYC flow)
    function verifyManufacturer(address manufacturer) external onlyAdmin {
        isVerifiedManufacturer[manufacturer] = true;
        emit ManufacturerVerified(manufacturer, manufacturerIds[manufacturer]);
    }
    
    // Get manufacturer ID for an address
    function getManufacturerId(address manufacturerAddr) public view returns (bytes32) {
        return manufacturerIds[manufacturerAddr];
    }
    
    // Check if account can act as manufacturer (for demo or real)
    function canActAsManufacturer(address account) external view returns (bool) {
        return isVerifiedManufacturer[account] || (isDemoMode && isDemoAccount(account));
    }
    
    // Get all demo manufacturers
    function getDemoManufacturers() public view returns (address[] memory, bytes32[] memory) {
        address[] memory addresses = new address[](demoManufacturers.length);
        bytes32[] memory ids = new bytes32[](demoManufacturers.length);
        
        for(uint i = 0; i < demoManufacturers.length; i++) {
            addresses[i] = demoManufacturers[i];
            ids[i] = manufacturerIds[demoManufacturers[i]];
        }
        
        return (addresses, ids);
    }
    
    // ========================= EXISTING FUNCTIONS WITH MODIFIERS =========================
    
    // SELLER SECTION - Only verified manufacturers can add sellers
    function addSeller(bytes32 _manufacturerId, bytes32 _sellerName, bytes32 _sellerBrand, bytes32 _sellerCode,
    uint256 _sellerNum, bytes32 _sellerManager, bytes32 _sellerAddress) public onlyVerifiedManufacturer {
        sellers[sellerCount] = seller(sellerCount, _sellerName, _sellerBrand, _sellerCode,
        _sellerNum, _sellerManager, _sellerAddress);
        sellerCount++;

        sellersWithManufacturer[_manufacturerId].push(_sellerCode);
    }

    // PRODUCT SECTION - Only verified manufacturers can add products
    function addProduct(bytes32 _manufacturerID, bytes32 _productName, bytes32 _productSN, bytes32 _productBrand,
    uint256 _productPrice) public onlyVerifiedManufacturer {
        productItems[productCount] = productItem(productCount, _productSN, _productName, _productBrand,
        _productPrice, "Available");
        productMap[_productSN] = productCount;
        productCount++;
        productsManufactured[_productSN] = _manufacturerID;
    }

    // SELL Product - Only verified manufacturers can sell to sellers
    function manufacturerSellProduct(bytes32 _productSN, bytes32 _sellerCode) public onlyVerifiedManufacturer {
        productsWithSeller[_sellerCode].push(_productSN);
        productsForSale[_productSN] = _sellerCode;
    }

    // ========================= REST OF EXISTING FUNCTIONS (UNCHANGED) =========================

    function viewSellers () public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory) {
        uint256[] memory ids = new uint256[](sellerCount);
        bytes32[] memory snames = new bytes32[](sellerCount);
        bytes32[] memory sbrands = new bytes32[](sellerCount);
        bytes32[] memory scodes = new bytes32[](sellerCount);
        uint256[] memory snums = new uint256[](sellerCount);
        bytes32[] memory smanagers = new bytes32[](sellerCount);
        bytes32[] memory saddress = new bytes32[](sellerCount);
        
        for(uint i=0; i<sellerCount; i++){
            ids[i] = sellers[i].sellerId;
            snames[i] = sellers[i].sellerName;
            sbrands[i] = sellers[i].sellerBrand;
            scodes[i] = sellers[i].sellerCode;
            snums[i] = sellers[i].sellerNum;
            smanagers[i] = sellers[i].sellerManager;
            saddress[i] = sellers[i].sellerAddress;
        }
        return(ids, snames, sbrands, scodes, snums, smanagers, saddress);
    }

    function viewProductItems () public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory) {
        uint256[] memory pids = new uint256[](productCount);
        bytes32[] memory pSNs = new bytes32[](productCount);
        bytes32[] memory pnames = new bytes32[](productCount);
        bytes32[] memory pbrands = new bytes32[](productCount);
        uint256[] memory pprices = new uint256[](productCount);
        bytes32[] memory pstatus = new bytes32[](productCount);
        
        for(uint i=0; i<productCount; i++){
            pids[i] = productItems[i].productId;
            pSNs[i] = productItems[i].productSN;
            pnames[i] = productItems[i].productName;
            pbrands[i] = productItems[i].productBrand;
            pprices[i] = productItems[i].productPrice;
            pstatus[i] = productItems[i].productStatus;
        }
        return(pids, pSNs, pnames, pbrands, pprices, pstatus);
    }

    function sellerSellProduct(bytes32 _productSN, bytes32 _consumerCode) public {   
        bytes32 pStatus;
        uint256 i;
        uint256 j=0;

        if(productCount>0) {
            for(i=0;i<productCount;i++) {
                if(productItems[i].productSN == _productSN) {
                    j=i;
                }
            }
        }

        pStatus = productItems[j].productStatus;
        if(pStatus == "Available") {
            productItems[j].productStatus = "NA";
            productsWithConsumer[_consumerCode].push(_productSN);
            productsSold[_productSN] = _consumerCode;
        }
    }

    function queryProductsList(bytes32 _sellerCode) public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory){
        bytes32[] memory productSNs = productsWithSeller[_sellerCode];
        uint256 k=0;

        uint256[] memory pids = new uint256[](productCount);
        bytes32[] memory pSNs = new bytes32[](productCount);
        bytes32[] memory pnames = new bytes32[](productCount);
        bytes32[] memory pbrands = new bytes32[](productCount);
        uint256[] memory pprices = new uint256[](productCount);
        bytes32[] memory pstatus = new bytes32[](productCount);

        
        for(uint i=0; i<productCount; i++){
            for(uint j=0; j<productSNs.length; j++){
                if(productItems[i].productSN==productSNs[j]){
                    pids[k] = productItems[i].productId;
                    pSNs[k] = productItems[i].productSN;
                    pnames[k] = productItems[i].productName;
                    pbrands[k] = productItems[i].productBrand;
                    pprices[k] = productItems[i].productPrice;
                    pstatus[k] = productItems[i].productStatus;
                    k++;
                }
            }
        }
        return(pids, pSNs, pnames, pbrands, pprices, pstatus);
    }

    function querySellersList (bytes32 _manufacturerCode) public view returns(uint256[] memory, bytes32[] memory, bytes32[] memory, bytes32[] memory, uint256[] memory, bytes32[] memory, bytes32[] memory) {
        bytes32[] memory sellerCodes = sellersWithManufacturer[_manufacturerCode];
        uint256 k=0;
        uint256[] memory ids = new uint256[](sellerCount);
        bytes32[] memory snames = new bytes32[](sellerCount);
        bytes32[] memory sbrands = new bytes32[](sellerCount);
        bytes32[] memory scodes = new bytes32[](sellerCount);
        uint256[] memory snums = new uint256[](sellerCount);
        bytes32[] memory smanagers = new bytes32[](sellerCount);
        bytes32[] memory saddress = new bytes32[](sellerCount);
        
        for(uint i=0; i<sellerCount; i++){
            for(uint j=0; j<sellerCodes.length; j++){
                if(sellers[i].sellerCode==sellerCodes[j]){
                    ids[k] = sellers[i].sellerId;
                    snames[k] = sellers[i].sellerName;
                    sbrands[k] = sellers[i].sellerBrand;
                    scodes[k] = sellers[i].sellerCode;
                    snums[k] = sellers[i].sellerNum;
                    smanagers[k] = sellers[i].sellerManager;
                    saddress[k] = sellers[i].sellerAddress;
                    k++;
                    break;
               }
            }
        }

        return(ids, snames, sbrands, scodes, snums, smanagers, saddress);
    }

    function getPurchaseHistory(bytes32 _consumerCode) public view returns (bytes32[] memory, bytes32[] memory, bytes32[] memory){
        bytes32[] memory productSNs = productsWithConsumer[_consumerCode];
        bytes32[] memory sellerCodes = new bytes32[](productSNs.length);
        bytes32[] memory manufacturerCodes = new bytes32[](productSNs.length);
        for(uint i=0; i<productSNs.length; i++){
            sellerCodes[i] = productsForSale[productSNs[i]];
            manufacturerCodes[i] = productsManufactured[productSNs[i]];
        }
        return (productSNs, sellerCodes, manufacturerCodes);
    }

    // Verify Product
    function verifyProduct(bytes32 _productSN, bytes32 _consumerCode) public view returns(bool){
        if(productsSold[_productSN] == _consumerCode){
            return true;
        }
        else{
            return false;
        }
    }
}