import React, { Component } from 'react';
import Web3 from 'web3';
const ethers = require("ethers");

class Header extends Component {

  constructor(props){
      super(props);
      this.state = {
          myAddress: '',
          signer: null,
          ethBalance: 0
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

  async getWalletInformation(){
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const ethBalance = await window.web3.eth.getBalance(await signer.getAddress());
      this.setState({myAddress: await signer.getAddress()});
      this.setState({ethBalance: window.web3.utils.fromWei(ethBalance)});
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.getWalletInformation();
  }

  render() {

      return (
      <div style={{backgroundColor: "lightskyblue"}} id="content" className="mt-3">

        <nav className="navbar navbar-light bg-light">
         <span className="navbar-brand mb-0 h3">AIRJ Token Air Drop! Welcome! </span> <h6><span>{this.state.myAddress} / {this.state.ethBalance} ETH</span></h6>
         
        </nav>

      </div>

      );
  }

}

export default Header;
