pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {


  Token private token;

   mapping(address => uint) public depositStart;
  mapping(address => uint) public etherBalanceOf;
  mapping(address => uint) public collateralEther;

  // mapping(address => bool) public isDeposited;
  mapping(address => bool) public isBorrowed;



  event Deposit(address indexed user,uint etherAmount, uint timeStart);
  event Withdraw(address indexed user,uint etherAmount, uint depositTime , uint interest);
  event Borrow(address indexed user, uint collateralEtherAmount, uint borrowedTokenAmount);
  event PayOff(address indexed user, uint fee);

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
    require(msg.value>=1e16, 'Error, collateral must be >= 0.01 ETH');
    require(isBorrowed[msg.sender] == false, 'Error, loan already taken');

    //this Ether will be locked till user payOff the loan
    collateralEther[msg.sender] = collateralEther[msg.sender] + msg.value;

    //calc tokens amount to mint, 50% of msg.value
    uint tokensToMint = collateralEther[msg.sender] / 2;

    //mint&send tokens to user
    token.mint(msg.sender, tokensToMint);

    //activate borrower's loan status
    isBorrowed[msg.sender] = true;

    emit Borrow(msg.sender, collateralEther[msg.sender], tokensToMint);
  }

  function payOff() public {
    require(isBorrowed[msg.sender] == true, 'Error, loan not active');
    require(token.transferFrom(msg.sender, address(this), collateralEther[msg.sender]/2), "Error, can't receive tokens"); //must approve dBank 1st

    uint fee = collateralEther[msg.sender]/10; //calc 10% fee

    //send user's collateral minus fee
    msg.sender.transfer(collateralEther[msg.sender]-fee);

    //reset borrower's data
    collateralEther[msg.sender] = 0;
    isBorrowed[msg.sender] = false;

    emit PayOff(msg.sender, fee);
  }
}
