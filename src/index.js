if (process.env.NODE_ENV !== 'production') {
	console.log('DEVELOPMENT MODE');
}

let Web3 = require('web3');
const socketProvider = 'wss://ropsten.infura.io/ws';
const httpProvider = 'https://ropsten.infura.io/eKV4yUUa3h0PawPo1GEQ';
// let web3ws = new Web3(new Web3.providers.WebsocketProvider(socketProvider));
let web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(httpProvider));

const PREFIX = '0x';
const account = '0x18ee6f47ab374776a7e42c4ff7bf8f8b7e319a98';

let supply = require('./../src/sol/Supply.sol');


window.supplier = {
	start: function() {
		// web3.eth.accounts.wallet.add(PREFIX + privateKey);

		this.deployInstance(supply);
		this.submitInvoice();

		return;
	},

	buildInstance: function(contract) {
		// Check key order when multiple contracts are in the same file
		let abi = contract[Object.keys(contract)[0]].abi;
		let bytecode = contract[Object.keys(contract)[0]].bytecode;

		return new web3.eth.Contract(abi, {data: bytecode});
	},

	deployInstance: async function(contract, ...args) {
		let wei, gasLimit, txFee;
		let contractInstance = this.buildInstance(contract);
		let contractData = PREFIX.concat(contractInstance.options.data);

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
				return;
			})
		]);

		txFee = gasLimit * wei;
		txFee = web3.utils.fromWei(web3.utils.toBN(txFee).toString(), 'ether');

		contractInstance.deploy({
			data: contractData,
			arguments: args })
		.send({
			from: account,
			gas: gasLimit,
			gasPrice: wei })
		.on('transactionHash', function(transactionHash) { console.log(transactionHash); })
		.on('confirmation', function(confirmationNumber, receipt) { console.log(confirmationNumber); })
		.on('receipt', function(receipt) { console.log(receipt); })
		.on('error', function(error) { console.log(error); })
		.then(function(ret) {
			return ret;
		});

		return;
	},

	addLot: function() {
		return;
	},

	submitInvoice: async function() {
		let contractInstance = this.buildInstance(supply);

		for (let i = 0; i < 2; i++) {
			let txCount;
			web3.eth.getTransactionCount(account, function(count) {
				txCount = count;
				return;
			});

			let lot = contractInstance.methods.addLot(i.toString(), 'g', 'x').encodeABI();
			console.log(txCount, lot);

			web3.eth.sendTransaction({
				from: account,
				to: '0x674bC87D05Ca835b8Fa5D806Dd33809DaE6E4d8d',
				nonce: txCount,
				data: lot,
			})
			.on('transactionHash', function(hash) {})
			.on('receipt', function(receipt) {
				console.log(i.toString() + 'CONFIRMED');
			})
			.on('confirmation', function(confirmationNumber, receipt) {})
			.on('error', console.error);
		}

		return;
	}
}

window.addEventListener('load', function() {
	supplier.start();

	return;
});
