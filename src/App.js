import React, { Component } from 'react';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
import { Button } from 'reactstrap';

class App extends Component {

  state = {
    ipfsHash:null,
    buffer:'',
    ethAddress:'',
    transactionHash:'',
    txReceipt: '',
    account: web3.eth.accounts[0]
  };

  componentWillMount() {
      this.loadBlockchainData()
    }

    async loadBlockchainData() {
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
    }

  usercaptureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)

    //console.log(file)

  };

  convertToBuffer = async(reader) => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer-using es6 syntax
    this.setState({buffer});

  };

  //ES6 async
  functiononClick = async () => {
    try{
      this.setState({blockNumber:"waiting.."});
      this.setState({gasUsed:"waiting..."});

  await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>
  {
    console.log(err,txReceipt);
    this.setState({txReceipt});
  });
   }catch(error){
     console.log(error);    }}

  onSubmit = async (event) => {
    event.preventDefault();

    //bring in user's metamask account address
    const accounts = await web3.eth.getAccounts();
    //obtain contract address from storehash.js
    const ethAddress= await storehash.options.address;
    this.setState({ethAddress});
    //save document to IPFS,return its hash#, and set hash# to state
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err,ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash
      this.setState({ ipfsHash:ipfsHash[0].hash });
      //call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract
      //return the transaction hash from the ethereum contract
      storehash.methods.setHash(this.state.ipfsHash).send({
        from: accounts[0]}, (error, transactionHash) => {
          console.log(transactionHash);
          this.setState({transactionHash});
        });
      })
    };

    render() {

      return (

        <div className="App">
        <header className="App-header">
        <h1>BlockchainAsset.Me</h1>
        <br></br>
        <h2>Using Ethereum, Truffle, Metamask, IPFS and Infura</h2>
        <br></br>
        <h4>Account Address: {this.state.account}</h4>
        <br></br>
        <h4>Items: 10</h4>
        <h4>Value: $500.34</h4>
        </header>
        <hr/>
        <grid>
        <h3>Select a Picture to add to your Inventory</h3>
        <form onSubmit={this.onSubmit}>
        <input type = "file" onChange = {this.usercaptureFile}/>
         <Button bsStyle="primary" type="submit"> Send it </Button></form><hr/>
         <Button onClick = {this.onClick}> Get Transaction Receipt </Button> <hr/>
         <table bordered responsive>
         <thead><tr><th>Tx Receipt Category</th><th> </th>
         <th>Values</th></tr></thead>
      <tbody><tr><td>IPFS Hash stored on Ethereum</td>
      <td> : </td>
      <td><a href={'https://gateway.ipfs.io/ipfs/'+ this.state.ipfsHash} target="_blank">{this.state.ipfsHash}</a></td></tr>
      <tr><td>Ethereum Contract Address</td><td> : </td>
      <td><a href={'https://ropsten.etherscan.io/address/'+ this.state.ethAddress} target="_blank">{this.state.ethAddress}</a></td></tr><tr><td>Tx # </td>
      <td> : </td> <td><a href={'https://ropsten.etherscan.io/tx/'+ this.state.transactionHash} target="_blank">{this.state.transactionHash}</a></td></tr>
      </tbody>
      </table>
      </grid>
      </div>
    ); }} export default App;
