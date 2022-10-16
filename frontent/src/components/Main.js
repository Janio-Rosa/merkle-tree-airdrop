import React, { Component, MouseEvent } from 'react';
import Web3 from 'web3';
import { Contract,  providers, utils, Wallet } from "ethers";
import EthSwap from '../abis/contracts/EthSwap.sol/EthSwap.json';
import AirDrop from '../abis/contracts/MyAirDropToken.sol/MyAirDropToken.json';

const ethers = require("ethers");
//const ethers = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');


class Main extends Component {
  
  constructor(props){
      super(props);
      this.state = {
          account: '',
          ethBalance: '0',
          myEthSwap: '',
          myToken: '',
          tokenBalance: '0',
          loading: true,
          eligibleAddr: [],
          signer: null,
          rootHash: '',
          myAirDrop: '',
          myMerkleTree: ''
      }
  }


  async loadWeb3() {
      if(window.ethereum){
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
      }else if(window.web3){
          window.web3 = new Web3(window.web3.currentProvider)
      }else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
  }

 async componentWillMount() {
      await this.loadWeb3();
//      console.log(window.web3);
      const result = await this.loadBlockchainData();
//      if(result)
          this.setState({loading: false})
  }

  async loadBlockchainData() {
      const accounts = await window.web3.eth.getAccounts()
      console.log(accounts);
      console.log(accounts[0]);
      this.setState({ account: accounts[0] })
      console.log(this.state.account);

      const ethBalance = await window.web3.eth.getBalance(accounts[0])
      this.setState( { ethBalance: ethBalance })
      console.log(this.state.ethBalance)
      console.log("Ethereum balance of the account logged in ")
      const r1 = await this.loadEthContracts();
      return (r1 );
  }

 async loadEthContracts() {
      const ETH_SWAP_ADDR="0x5050a99908D274d877576c774FF8C605D2488F3F";

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("My Wallet Address: ", await signer.getAddress()); 

      const EthSwapFactory = new ethers.Contract(ETH_SWAP_ADDR, EthSwap.abi, signer);
      const myEthSwap = EthSwapFactory.attach(ETH_SWAP_ADDR);

      const name2 = await myEthSwap.token();
      const name1 = await myEthSwap.name();
      const addrs = await myEthSwap.getAirDropEligibleAdressess();
      this.setState({eligibleAddr: addrs});
      this.setState({signer: signer});
      console.log("Nome do TOKEN:", name2);
      console.log("Nome do Eth Swap:", name1);
      console.log(myEthSwap);
      console.log("Endereço",myEthSwap.address);
  
      console.log("Endereços elegíveis:", addrs);
      window.Buffer = window.Buffer || require("buffer").Buffer;
      this.leafNodes = addrs.map(_i => keccak256(_i));
      this.merkleTree = new MerkleTree(this.leafNodes, keccak256, {sortPairs: true});
      this.newRoot = this.merkleTree.getRoot();
 
      console.log("Merkle Tree: ", this.merkleTree);
      console.log("New Root Hash: ", this.newRoot);
      this.setState({rootHash: this.newRoot});
      this.setState({myMerkleTree: this.merkleTree});
      this.setState({myEthSwap: myEthSwap});
  }

  async setNewRootHash() {
      const AIR_DROP_ADDR="0xF652b6F5A1eDb2c6c05F6Ffc0c870E7c98d87feb";
      const signer = this.state.signer;
      const AirDropFactory = new ethers.Contract(AIR_DROP_ADDR, AirDrop.abi, signer);
      const myAirDrop = AirDropFactory.attach(AIR_DROP_ADDR);
 
      const airDropSymbol = myAirDrop.symbol(); 
      const airDropName = myAirDrop.name(); 
      const newRoot = this.state.rootHash;

      console.log("New Root: ",newRoot);
      console.log("Air Drop Symbol: ",airDropSymbol);
      console.log("Air Drop Name: ",airDropName);

      myAirDrop.changeSeason(newRoot);
      this.setState({myAirDrop: myAirDrop});

  }

  async checkEligibilityAndClaim() {
      window.Buffer = window.Buffer || require("buffer").Buffer;
      const myAddress = await this.state.signer.getAddress();
      alert(myAddress);
      const proof = this.state.myMerkleTree.getHexProof(keccak256(myAddress.toString()));
      const airDrop = this.state.myAirDrop;
      if (proof.length !== 0) {
        await airDrop.connect(this.state.signer).claim(proof);
      }

  }

  handleSetNewHash = (_event) => {
     _event.preventDefault();
      this.setNewRootHash();
  }

  handleCheckAndClaim = (_event) => {
     _event.preventDefault();
      this.checkEligibilityAndClaim();
  }


//  function handleSetNewHash(event: MouseEvent<HTMLButtonElement>): void {
//    event.preventDefault();



  render() {


      return (
      <div id="content" className="mt-3">

       <div className="d-flex justify-content-between mb-3">
       </div>
       <div className="card mb-4" >
       </div>
        <div className="card-body"> 
            Main content! {this.state.ethBalance} <br/> 
            Eligible Addresses: {this.state.eligibleAddr} <br/>
            New Root hash: {this.state.rootHash}
        </div>

        <div>
            <button className='button' onClick={this.handleSetNewHash} >
                 Set New Root Hash! Begin new Season of Air Drop!
            </button>
        </div>
        <div>
            <button className='button' onClick={this.handleCheckAndClaim}>
                 Now Check your Eligibility and Claim your REWARDS!
            </button>
        </div>

      </div>

      );
  }

}

export default Main;
