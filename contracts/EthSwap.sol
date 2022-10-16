//SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;
import "./JanioToken.sol";

contract EthSwap {

	string public name = "EthSwap Janio Exchange";
	JanioToken public token;
	uint public rate = 100;
	address[] public eligibleAddr;

	event TokenPurchased(address from, address to, address tokenAddress, uint amount, uint rate );

	constructor (JanioToken _tokenAddr) {
		token = _tokenAddr;

	}

	//Buy tokens at the basic rate where each eth can buy 100 tokens
	function buyTokens() public payable {
	    uint tokenAmount = msg.value * rate;
	    require(token.balanceOf(address(this))>=tokenAmount);
	    token.transfer(msg.sender, tokenAmount);
		
		//Add sender to the eligible airdrop array
		eligibleAddr.push(msg.sender);

		//Emit the purchase event for the blockchain logging pattern
	    emit TokenPurchased(address(this), msg.sender, address(token), tokenAmount, rate);	
	}

    //Sell tokens at the basic rate where each 100 tokens can buy 1 ether  
	function sellTokens(uint _tokenAmount) public payable {
	    require(token.balanceOf(msg.sender)>=_tokenAmount);
	    token.transferFrom(msg.sender,address(this),_tokenAmount);
	    uint etherAmount = _tokenAmount / rate;
	    require(address(this).balance >= etherAmount);
	    payable(msg.sender).transfer(etherAmount);
	    emit TokenPurchased(msg.sender, address(this), address(token), _tokenAmount, rate);	
	}

	//Returning a array of addresses on function is not advisable. If the array is too big, all the gas is spent and the function will revert, becoming useless
	//We will use here only for learning purposes
	function getAirDropEligibleAdressess()external view returns (  address[] memory ) {
		return eligibleAddr;
	}
}
