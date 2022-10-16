//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.8.19;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MyAirDropToken is ERC20, Ownable {
    //The Root of the Merkel Tree which will controll the Air Drop elegibility
    //Seasonably the owner can start New Airdrop events by replacing the old Merkel Tree with new one
    //Elegible candidates that didn't claim their tokens before new events, will lose them.
    bytes32 public root;
    //Users that claimed their reward won't be elegible anymore, in any event season
    mapping(address => bool) claimed;
    uint256 public constant REWARD_AMOUNT=500 ether;

    constructor(uint256 _supply) ERC20("My Air Drop Token - Janio","AIRJ") {
        //Mint already emits a transfer event - so it is publicly known that msg.sender has the inittial supply of _supply
        _mint(msg.sender,_supply); 
    }

    //Arrays (non-fixed size) should be avoided as parameters to functions
    function claim(bytes32[] calldata _proof) external  {
        require(!claimed[msg.sender],"User already claimed its air drop!");
        claimed[msg.sender]=true;
        bytes32 _leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_proof, root, _leaf), "Incorrect merkle proof - not eligible");
        _mint(msg.sender, REWARD_AMOUNT);
    }

    function changeSeason(bytes32 _newRoot) external onlyOwner {
        root = _newRoot;
    }

	function eligible(bytes32[] calldata _proof) external view returns (uint256){
        if(claimed[msg.sender]){
            return 0;
        }else {
            bytes32 _leaf = keccak256(abi.encodePacked(msg.sender));
            require(MerkleProof.verify(_proof, root, _leaf), "Incorrect Merkle Proof");
            return REWARD_AMOUNT;
        }
    }    

}
