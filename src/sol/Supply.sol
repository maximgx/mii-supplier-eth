pragma solidity ^0.4.24;

contract Supply {
	struct Lot {
		string invoiceId;
		string lot;
		string description;
	}

	Lot[] public lots;

	constructor() public {}

	function addLot(string id, string lot, string descr) public {
		lots.push(Lot(id, lot, descr));
		return;
	}

	function getCountLots() public view returns (uint256) {
		return lots.length;
	}

	function getLot(uint256 index) public view returns (string, string, string) {
		return (
			lots[index].invoiceId,
			lots[index].lot,
			lots[index].description);
	}
}
