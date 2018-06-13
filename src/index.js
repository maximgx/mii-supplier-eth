let Web3 = require('web3');
const socketProvider = 'wss://ropsten.infura.io/ws';
const httpProvider = 'https://ropsten.infura.io/eKV4yUUa3h0PawPo1GEQ';
// let web3 = new Web3(new Web3.providers.WebsocketProvider(httpProvider));
let web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(httpProvider));


if (process.env.NODE_ENV !== 'production') {
	console.log('DEVELOPMENT MODE');
}


const PREFIX = '0x';
const account = '0x18ee6f47ab374776a7e42c4ff7bf8f8b7e319a98';
// const privateKey = 'f885e068b2c4db0e0aedd3442aa7456e8168274bce8321eff94a2d389377aaff';

let supply = require('./../src/sol/Supply.sol');

window.supplier = {
	start: function() {
		// web3.eth.accounts.wallet.add(PREFIX + privateKey);

		this.deployInstance(supply);

		return;
	},

	buildInstance: function(contract) {
		// Check key order when multiple contracts are in the same file
		var abi = contract[Object.keys(contract)[0]].abi;
		var bytecode = contract[Object.keys(contract)[0]].bytecode;

		return new web3.eth.Contract(abi, {data: bytecode});
	},

	deployInstance: async function(contract, ...args) {
		var wei, gasLimit, txFee;
		var contractInstance = this.buildInstance(contract);
		var contractData = PREFIX.concat(contractInstance.options.data);

		await Promise.all(
		[
			web3.eth.getGasPrice()
			.then(function(result) {
				wei = result;

				return;
			}),

			web3.eth.estimateGas({ data: contractData, arguments: args })
			.then(function(result) {
				gasLimit = result;
				console.log('gasLimit: ', gasLimit);

				return;
			})
		]);

		txFee = gasLimit * wei;
		txFee = web3.utils.fromWei(web3.utils.toBN(txFee).toString(), 'ether');

		contractInstance.deploy({ data: contractData, arguments: args })
		.send({ from: account,
				gas: gasLimit,
				gasPrice: wei })
		.on('transactionHash', function(transactionHash) {
			console.log(transactionHash);
		})
		.on('confirmation', function(confirmationNumber, receipt) {
			console.log(confirmationNumber);
		})
		.on('receipt', function(receipt) {
			console.log(receipt);
		})
		.on('error', function(error) {
			console.log(error); })
		.then(function(ret) {
			return ret;
		});

		return;
	}
}

window.addEventListener('load', function() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	  if (typeof web3 !== 'undefined') {

	    // Use the browser's ethereum provider
	    var provider = web3.currentProvider

	  } else {
	    console.log('No web3? You should consider trying MetaMask!')
	  }

	supplier.start();

	return;
});
