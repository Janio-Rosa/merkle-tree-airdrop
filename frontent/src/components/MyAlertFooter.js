import React, {  Component } from 'react';
import Alert from 'react-bootstrap/Alert';

class MyAlertFooter extends Component {
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
      <Alert variant="info">
        <Alert.Heading></Alert.Heading>
        <p>
Air Drop (c) - Janio Silva - All rights reserved. Quantstamp here we go!
        </p>
        <hr />
        <div className="d-flex justify-content-end">
        </div>
      </Alert>

    </>
  );
}


}

export default MyAlertFooter;
