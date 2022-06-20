const web3 = require('web3');
const wallet = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();

const updateVisitors = async () => {
  // console.log('{ updateVisitors }');
  const PV_KEY = process.env.PV_KEY;

  const ethereum = new wallet(PV_KEY, process.env.ETH_URL);
  const Web3 = new web3(ethereum);
  const contract = new Web3.eth.Contract(JSON.parse(process.env.VISITOR_ABI), process.env.VISITOR_ADDRESS);

  const from = (await new Web3.eth.getAccounts())[0];
  const balance = await new Web3.eth.getBalance(from);

  console.log({ from, balance: web3.utils.fromWei('' + balance) });

  try {
    const tx = await contract.methods
      .visitorCame()
      .send({ from })
      .on('confirmation', (i) => {
        if (i === 0) console.log('hi visitor');
      });

    console.log({ tx: tx.transactionHash });
  } catch (err) {
    err && console.log(err.message);
  }
};

module.exports = { updateVisitors };
