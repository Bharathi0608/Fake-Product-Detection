// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuthSystem {
    struct User {
        string name;
        string email;
        string passwordHash;
        string role;
        string roleData;
        address walletAddress;
    }
    
    mapping(string => User) private users;
    mapping(address => string) private walletToEmail;
    
    event UserRegistered(string email, string role);
    
    function registerUser(
        string memory name,
        string memory email,
        string memory passwordHash,
        string memory role,
        string memory roleData
    ) public {
        require(bytes(users[email].email).length == 0, "User already exists");
        
        users[email] = User({
            name: name,
            email: email,
            passwordHash: passwordHash,
            role: role,
            roleData: roleData,
            walletAddress: msg.sender
        });
        
        walletToEmail[msg.sender] = email;
        
        emit UserRegistered(email, role);
    }
    
    function loginUser(
        string memory email,
        string memory passwordHash
    ) public view returns (bool, string memory, string memory) {
        User storage user = users[email];
        
        if (bytes(user.email).length == 0) {
            return (false, "", "");
        }
        
        if (keccak256(abi.encodePacked(user.passwordHash)) != keccak256(abi.encodePacked(passwordHash))) {
            return (false, "", "");
        }
        
        return (true, user.name, user.role);
    }
    
    function getUserByEmail(string memory email) public view returns (User memory) {
        return users[email];
    }
    
    function getUserByWallet(address wallet) public view returns (User memory) {
        return users[walletToEmail[wallet]];
    }
}