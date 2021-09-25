import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import eth from '../eth.png';
import Web3 from 'web3';
import './App.css';



class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      // console.log(netId)
      const accounts = await web3.eth.getAccounts()
      // console.log(accounts[0])

      if(typeof accounts[0] !== 'undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        // console.log(balance)
        this.setState({ account: accounts[0], balance: balance, web3: web3})

        try{
          const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
          const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
          const dBankAddress = dBank.networks[netId].address

          const tokenBalance = await token.methods.balanceOf(this.state.account).call()
          console.log(web3.utils.fromWei(tokenBalance))
          console.log(token)
          this.setState({token: token , dbank: dbank, dBankAddress : dBankAddress})    
          // console.log(dBankAddress)
        }catch(e){
          console.log('Error',e)
          window.alert('Contracts not deployed to current network')
        }
      } else{
        window.alert('Please login with metamask')
      }

    } else{
      window.alert('install metamask browser extension to proceed')
    }
    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    // console.log(amount)
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.deposit().send({
          value: amount.toString(),
          from: this.state.account
        })
      } catch(e){
        console.log('error,deposit: ' ,e)
      }
    }
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
  }

  async withdraw(e) {
    e.preventDefault()
    if(this.state.dbank!=='undefined'){
      
      try{
        await this.state.dbank.methods.withdraw().send({
          from: this.state.account
        })
      } catch(e){
        console.log('error,withdraw: ' ,e)
      }
    }
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-2 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://github.com/Yashraj9983/devathon21"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={eth} className="App-logo" alt="logo" height="32"/>
          <b><span> d₿ank</span></b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1 style={{marginTop:'50px'}}> Welcome to Decentralized ₿ank</h1>
          <div style={{fontSize:'1em'}}>{this.state.account}</div>
          <br></br>
    
          
          <div className="row " style={{marginLeft:'510px',marginTop:'20px'}}>
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" >
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit">
                  <div>
                    <br></br>
                    How much do you want to deposit?
                    <div style={{color:'cyan'}}>
                    (min. amount is 0.01 ETH)
                    <br></br>
                    (1 deposit is possible at a time)
                    </div>
                    <br></br>
                    <form onSubmit={(e)=>{
                      e.preventDefault()
                      let amount = this.depositAmount.value
                      // if(amount>0){
                      amount = amount * 10**18
                      this.deposit(amount)
                      // } else{
                      //   window.alert("You cant just enter a negative number")
                      // }
                    }}>
                      <div className='form-group mr-sm-2' style={{marginBottom:'10px'}}>
                        <br></br>
                          <input
                            id='depositAmount'
                            step='0.01'
                            type='number'
                            min='0.01'
                            className='form-control form-control-md'
                            placeholder='amount...'
                            required
                            ref={(input)=>{this.depositAmount= input}}
                            ></input>
                      </div>
                      <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <div>
                    <br></br>
                    Do you want to withdraw + take interest?
                    <br></br>
                    <br></br>              
                  </div>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e)=> this.withdraw(e)}>
                      WITHDRAW
                    </button>
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;