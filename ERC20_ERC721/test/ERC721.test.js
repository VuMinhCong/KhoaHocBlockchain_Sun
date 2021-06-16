const { ethers } = require('hardhat');
const { expect, use } = require('chai');
const { time, expectRevert } = require('@openzeppelin/test-helpers');

describe('Test TokenERC721', async () => {
  let admin, alice, bob;
  let tokenERC721;

  beforeEach('Deploy TokenERC721', async () => {
    [admin, alice, bob] = await ethers.getSigners();

    const TokenERC721 = await ethers.getContractFactory('TokenERC721');
    tokenERC721 = await TokenERC721.connect(admin).deploy('TokenERC721', 'TokenERC721');
    await tokenERC721.deployed();
  });

  it('Mint ERC721', async () => {
    const name = await tokenERC721.name();
    const symbol = await tokenERC721.symbol();
    console.log(name);
    console.log(symbol);
    console.log('Alice address: ', alice.address);
    console.log('Bob address: ', bob.address);

    console.log('\n\n\n======Mint sucessfully======');
    await tokenERC721.connect(admin).mint(alice.address, '10');

    console.log('Alice balance: ', parseInt(await tokenERC721.balanceOf(alice.address)));
    console.log('TokenId 0 owner: ', await tokenERC721.ownerOf('10'));
    console.log(
      'Token has index 0 of Alice: ',
      parseInt(await tokenERC721.tokenOfOwnerByIndex(alice.address, '0'))
    );

    await expectRevert(
      tokenERC721.connect(admin).mint(bob.address, '10'),
      'ERC721: token already minted'
    );
  });
});
