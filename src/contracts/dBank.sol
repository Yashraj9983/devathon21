pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {


  Token private token;

  mapping(address => uint) public etherBalanceOf;
  mapping(address => uint) public depositStart;
  // mapping(address => bool) public isDeposited;


  event Deposit(address indexed user,uint etherAmount, uint timeStart);
  event Withdraw(address indexed user,uint etherAmount, uint depositTime , uint interest);

  //pass as constructor argument deployed Token contract
  constructor(Token _token) public {
    token = _token;
  }

  function balanceOf(address _owner) external view returns (uint) {
    return etherBalanceOf[_owner];
  }
  function deposit() payable public {
    //check if msg.sender didn't already deposited funds
    // require(isDeposited[msg.sender]== false, 'Error, deposit already active');
    //check if msg.value is >= than 0.01 ETH
    require(msg.value>=1e16,'Error , deposit must be >= 0.01 ETH');
    
    etherBalanceOf[msg.sender]=etherBalanceOf[msg.sender]+msg.value;//increase msg.sender ether deposit balance
    depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;//start msg.sender hodling time
    // isDeposited[msg.sender] = true;//set msg.sender deposit status to true
    emit Deposit(msg.sender, msg.value, block.timestamp);//emit Deposit event
  }

  function withdraw(uint withdrawAmount) public {
    withdrawAmount= withdrawAmount * 1e18;
    // require(isDeposited[msg.sender]==true,'error, no previous deposit');
    //check if msg.sender deposit status is true
    require(withdrawAmount>=1e16,'Error , withdraw must be >= 0.01 ETH');
    uint userBalance = etherBalanceOf[msg.sender];
    require(withdrawAmount <= userBalance,'Error ,  insufficient Balance');
    //assign msg.sender ether deposit balance to variable for event

    //check user's hodl time
    uint depositTime = block.timestamp - depositStart[msg.sender];

    //calc interest per second
    uint interestPerSecond = 31668017 * (etherBalanceOf[msg.sender] / 1e16);
    //calc accrued interest
    uint interest = interestPerSecond * depositTime;

    //send eth to user
    msg.sender.transfer(withdrawAmount);
    token.mint(msg.sender, interest);
    //send interest in tokens to user

    //reset depositer data
    depositStart[msg.sender]=0;
    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] - withdrawAmount;
    
    // isDeposited[msg.sender]=false;
    
    emit Withdraw(msg.sender, withdrawAmount, depositTime, interest);

    //emit event
  }

  function borrow() payable public {
    //check if collateral is >= than 0.01 ETH
    //check if user doesn't have active loan

    //add msg.value to ether collateral

    //calc tokens amount to mint, 50% of msg.value

    //mint&send tokens to user

    //activate borrower's loan status

    //emit event
  }

  function payOff() public {
    //check if loan is active
    //transfer tokens from user back to the contract

    //calc fee

    //send user's collateral minus fee

    //reset borrower's data

    //emit event
  }
}
