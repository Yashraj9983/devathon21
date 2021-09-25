pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  address public minter;

  event MinterChanged(address indexed from, address to);

  constructor() public payable ERC20("Decentralized Bank Currency", "DBC") {
    minter = msg.sender;
  }

  function passMinterRole(address dBank) public returns (bool){
    require(msg.sender==minter,'Error,only owner can change role');
    minter = dBank;

    emit MinterChanged(msg.sender,dBank);
    return true;
  }

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender== minter,"error, sender dont have minter role");
		_mint(account, amount);
	}
}