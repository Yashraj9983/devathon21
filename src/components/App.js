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
          // console.log(web3.utils.fromWei(tokenBalance))
          // console.log(token)
          var userBalance = await dbank.methods.balanceOf(this.state.account).call()
          userBalance=web3.utils.fromWei(userBalance)
          this.setState({token: token , dbank: dbank, dBankAddress : dBankAddress, userBalance : userBalance})    
          
          // const userBalance = await this.state.dbank.methods.balanceOf(this.state.account)
          // console.log('userBalance: ', web3.utils.fromWei(userBalance))
          // console.log(dBankAddress)
          // console.log(dBank)
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
        const web3 = new Web3(window.ethereum)
        var userBalance = await this.state.dbank.methods.balanceOf(this.state.account).call()
        userBalance=web3.utils.fromWei(userBalance)
        this.setState({userBalance: userBalance})
      } catch(e){
        console.log('error,deposit: ' ,e)
      }
    }
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
  }

  async withdraw(amount) {
    
    if(this.state.dbank!=='undefined'){
      
      try{
        await this.state.dbank.methods.withdraw(amount).send({
          from: this.state.account
        })
        const web3 = new Web3(window.ethereum)
        var userBalance = await this.state.dbank.methods.balanceOf(this.state.account).call()
        userBalance=web3.utils.fromWei(userBalance)
        this.setState({userBalance: userBalance})
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
        <div class="animation01">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="animation02">
        <div></div>
        <div></div>
    </div>
    <div class="animation03">
        <div class="circle">
            <div class="circle_element01"></div>
        </div>
        <div class="circle">
            <div class="circle_element02"></div>
        </div>
        <div class="circle">
            <div class="circle_element03"></div>
        </div>
        <div class="animation04">
            <div class="line_wrapper line_wrapper01">
                <span class="line line01"></span>
            </div>
            <div class="rotate45">
                <div class="line_wrapper line_wrapper02">
                    <span class="line line02"></span>
                </div>
            </div>
            <div class="line_wrapper line_wrapper03">
                <span class="line line03"></span>
            </div>
            <div class="rotate135">
                <div class="line_wrapper line_wrapper04">
                    <span class="line line04"></span>
                </div>
            </div>
            <div class="line_wrapper line_wrapper05">
                <span class="line line05"></span>
            </div>
            <div class="rotate-135">
                <div class="line_wrapper line_wrapper06">
                    <span class="line line06"></span>
                </div>
            </div>
            <div class="line_wrapper line_wrapper07">
                <span class="line line07"></span>
            </div>
            <div class="rotate-45">
                <div class="line_wrapper line_wrapper08">
                    <span class="line line08"></span>
                </div>
            </div>
        </div>
        <div class="animation05">
            <div class="double_wrapper02 green02">
                <div class="double_wrapper01 green01">
                    <div class="double_block green00"></div>
                </div>
            </div>
            <div class="double_wrapper02 navy02">
                <div class="double_wrapper01 navy01">
                    <div class="double_block navy00"></div>
                </div>
            </div>
            <div class="double_wrapper02 yellow02">
                <div class="double_wrapper01 yellow01">
                    <div class="double_block yellow00"></div>
                </div>
            </div>
            <div class="double_wrapper02 blue02">
                <div class="double_wrapper01 blue01">
                    <div class="double_block blue00"></div>
                </div>
            </div>
            <div class="double_wrapper02 red02">
                <div class="double_wrapper01 red01">
                    <div class="double_block red00"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="animation06">
        <div class="rhombus05">
            <div class="rhombus04">
                <div class="rhombus03">
                    <div class="rhombus02">
                        <div class="rhombus01"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="animation07">
        <div class="circle">
            <div class="circle_element01"></div>
        </div>
        <div class="line_wrapper line_wrapper01">
            <span class="line line01"></span>
        </div>
        <div class="rotate60">
            <div class="line_wrapper line_wrapper02">
                <span class="line line02"></span>
            </div>
        </div>
        <div class="rotate120">
            <div class="line_wrapper line_wrapper03">
                <span class="line line03"></span>
            </div>
        </div>
        <div class="line_wrapper line_wrapper04">
            <span class="line line04"></span>
        </div>
        <div class="rotate-120">
            <div class="line_wrapper line_wrapper05">
                <span class="line line05"></span>
            </div>
        </div>
        <div class="rotate-60">
            <div class="line_wrapper line_wrapper06">
                <span class="line line06"></span>
            </div>
        </div>
    </div>
    <div class="animation08">
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-2 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://github.com/Yashraj9983/devathon21"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={eth} className="App-logo" alt="logo" height="32" />
          <b><span> d₿ank</span></b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1 style={{marginTop:'50px'}}> Welcome to Decentralized ₿ank</h1>
          <div style={{fontSize:'1em'}}>{this.state.account}</div>
          <div>Balance : {this.state.userBalance}</div>
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
                    How much you want to Withdraw ?
                    <br></br>
                    <br></br>              
                  </div>
                  <div>
                  <br></br>
                    <form onSubmit={(e)=>{
                      e.preventDefault()
                      let amount = this.withdrawAmount.value  
                      // amount = amount * 10**18
                      this.withdraw(amount)                    
                    }}>
                      <div className='form-group mr-sm-2' style={{marginBottom:'10px'}}>
                        <br></br>
                          <input
                            id='withdrawAmount'
                            step='0.01'
                            type='number'
                            min='0.01'
                            max = {this.state.userBalance}
                            className='form-control form-control-md'
                            placeholder='amount...'
                            required
                            ref={(input)=>{this.withdrawAmount= input}}
                            ></input>
                      </div>
                      <button type='submit' className='btn btn-primary'>WITHDRAW</button>
                    </form>

                    {/* <button type='submit' className='btn btn-primary' onClick={(e)=> this.withdraw(e)}>
                      WITHDRAW
                    </button> */}
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
        </div>
        
    </div>
        
        {/* <div className='ocean'>
          <div className='wave'></div>
          <div className='wave'></div>
          <div className='wave'></div>
        </div> */}
      </div>
    
    );
  }
}

export default App;