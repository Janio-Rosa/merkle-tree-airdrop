import React, {  Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
//import ListGroup from 'react-bootstrap/ListGroup';

class MyAlertDetails extends Component {
//  const [show, setShow] = useState(true);

  constructor(props){
      super(props);
      this.state = {
          account: ''
      }
  }

  setShow = (newValue) => { this.setState({showAlert:newValue}) }

  render() {

  return (
    <>
      <Alert variant="danger">
        <Alert.Heading>Air Drop implementation using Merkle Tree</Alert.Heading>
        <p>
            This Air Drop website is deployed on <Badge bg='danger'>Goerli</Badge> Testnet! 
        </p>
        <p>
           The stack used is Solidity plus Hardhat and React for the frontend.
           It works by distributing AIRJ Toekns for those who purchased JNIO Tokens on our ETH SWAP website.
            The backend uses zero knowledge concepts such as Merkle Tree to store the root on chain and check proofs for each leaf claim (each wallet who purchased tokens).
        </p>
 
      </Alert>
    </>
  );
}


}

export default MyAlertDetails;
