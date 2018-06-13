pragma solidity ^0.4.24;

contract Supply {
	struct Invoice {
		string id;
		string productLot;
		string description;
	}

	Invoice[] public invoices;


	constructor() public {}

	function addInvoice() public pure {

	}

	function getCountInvoices() public pure {

	}

	function getInvoice() public pure {

	}
}
