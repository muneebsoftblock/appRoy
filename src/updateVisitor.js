const web3 = require('web3');
const wallet = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();

const updateVisitors = async () => {
  // console.log('{ updateVisitors }');
  const PV_KEY = process.env.PV_KEY;

  const ethereum = new wallet(PV_KEY, 'https://matic-mumbai.chainstacklabs.com');
  const Web3 = new web3(ethereum);
  const contract = new Web3.eth.Contract(
    JSON.parse(
      '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"VisitorCame","type":"event"},{"inputs":[],"name":"visitorCame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"visitors","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"visitorsReset","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
    ),
    '0xB757419b9FB0F5964EDD957f5C6A8897C222a2Ab',
  );

  const from = (await new Web3.eth.getAccounts())[0];
  const balance = await new Web3.eth.getBalance(from);

  console.log({ from, balance });

  try {
    const tx = await contract.methods
      .visitorCame()
      .send({ from, gas: '40000', gasPrice: web3.utils.toWei('100', 'gwei') })
      .on('confirmation', (i) => {
        if (i === 0) console.log('hi visitor');
      });

      console.log({ tx });
  } catch (err) {
    err && console.log(err.message);
  }
};

updateVisitors();
// module.exports = { updateVisitors };
