const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { interface, bytecode } = require('./compile');

const mnemonicPhrase = "bunker flock hawk shove soul naive unique fan treat firm glass subject"; // 12 word mnemonic

const provider = new HDWalletProvider(
  {
    mnemonic: {
      phrase: mnemonicPhrase
    },
    providerOrUrl: "http://localhost:7545"
  }
);


const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
