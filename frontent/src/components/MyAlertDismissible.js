import React, {  Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

class MyAlertDismissible extends Component {
//  const [show, setShow] = useState(true);

  constructor(props){
      super(props);
      this.state = {
          account: '',
          showAlert: false
      }
  }

  setShow = (newValue) => { this.setState({showAlert:newValue}) }

  render() {

  return (
    <>
      <Alert show={this.state.showAlert} variant="warning">
        <Alert.Heading>To be eligible to the AIRJ Token AIR DROP, you must purchase JNIO Tokens from our ETH SWAP AMM!</Alert.Heading>
            <span className="label">Eligible Addresses for <Badge bg="danger">AIRJ</Badge> Token Air Drop: </span>
            <ul style={{textAlign: 'left'}} >
                {this.props.formatElAddr}
            </ul>
            <Badge bg="primary">First, click below to distribute the Air Drop! Then, click on Claim Button to claim your prize tokens!</Badge>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => this.setShow(false)} variant="outline-danger">
            Close Addresses!
          </Button>
        </div>
      </Alert>

      {!this.state.showAlert && <Button onClick={() => this.setShow(true)}>Show Eligible Addresses</Button>}
    </>
  );
}


}

export default MyAlertDismissible;
