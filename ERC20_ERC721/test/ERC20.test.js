const { ethers } = require('hardhat');
const { expect, use } = require('chai');
const { time, expectRevert } = require('@openzeppelin/test-helpers');

describe('Test TokenERC20', async () => {
  let admin, alice, bob;
  let token, bank;

  beforeEach('Deploy TokenERC20 and Bank', async () => {
    [admin, alice, bob] = await ethers.getSigners();

    const TokenERC20 = await ethers.getContractFactory('TokenERC20');
    token = await TokenERC20.connect(admin).deploy('TestERC20', 'TestERC20');
    await token.deployed();

    const Bank = await ethers.getContractFactory('Bank');
    bank = await Bank.connect(admin).deploy();
    await bank.deployed();
  });

  it('Deposit and withdraw ERC20', async () => {
    const name = await token.name();
    const symbol = await token.symbol();
    console.log(name);
    console.log(symbol);

    await token.connect(admin).mint(alice.address, '1000000');
    await token.connect(alice).approve(bank.address, '500000');

    console.log('\n\n\n===========Befor deposit==========');
    console.log('Alice balance: ', parseInt(await token.balanceOf(alice.address)));
    console.log('Bank balance: ', parseInt(await token.balanceOf(bank.address)));

    await bank.connect(alice).depositERC20(token.address, '500000');
    console.log('\n\n\n===========Deposit successfully==========');
    console.log('Alice balance: ', parseInt(await token.balanceOf(alice.address)));
    console.log('Bank balance: ', parseInt(await token.balanceOf(bank.address)));

    await bank.connect(alice).withdrawERC20(token.address, '500000');
    console.log('\n\n\n===========Withdraw successfully==========');
    console.log('Alice balance: ', parseInt(await token.balanceOf(alice.address)));
    console.log('Bank balance: ', parseInt(await token.balanceOf(bank.address)));
  });

  it('Deposit and withdraw ETH', async () => {
    console.log('\n\n\n===========Befor deposit==========');
    console.log('Alice balance: ', parseInt(await ethers.provider.getBalance(alice.address)));
    console.log('Bank balance: ', parseInt(await ethers.provider.getBalance(bank.address)));

    await bank.connect(alice).depositETH({ value: '1000000000000000000' });
    console.log('\n\n\n===========Alice deposits successfully==========');
    console.log('Alice balance: ', parseInt(await ethers.provider.getBalance(alice.address)));
    console.log('Bank balance: ', parseInt(await ethers.provider.getBalance(bank.address)));

    const ReceiverContract = await ethers.getContractFactory('ReceiverContract');
    const receiverContract = await ReceiverContract.connect(bob).deploy(bank.address);

    await receiverContract.connect(bob).depositToBank({ value: '1000000000000000000' });
    console.log('\n===========Bob deposits by ReceiverContract Contract successfully==========');
    console.log('Bob balance: ', parseInt(await ethers.provider.getBalance(bob.address)));
    console.log('Bank balance: ', parseInt(await ethers.provider.getBalance(bank.address)));
    console.log(
      'Receiver Contract balance: ',
      await ethers.provider.getBalance(receiverContract.address)
    );

    await receiverContract.connect(bob).withdrawFromBank();
    console.log('\n===========Bob withdraws by ReceiverContract Contract successfully==========');
    console.log('Bank balance: ', parseInt(await ethers.provider.getBalance(bank.address)));
    console.log(
      'Receiver Contract balance: ',
      parseInt(await ethers.provider.getBalance(receiverContract.address))
    );
  });
});
