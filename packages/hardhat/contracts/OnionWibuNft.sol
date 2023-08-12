// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2; //Do not change the solidity version as it negativly impacts submission grading

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract OnionWibuNft is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
	using Counters for Counters.Counter;

	Counters.Counter private _tokenIdCounter;
	uint256 public constant maxMintPerCooldown = 6;
	uint256 public constant mintingCooldown = 10 minutes;

	mapping(address => uint256) private mintedCount;
	mapping(address => uint256) private lastMintTimestamp;

	constructor() ERC721("OnionWibuNft", "OWN") {}

	function _baseURI() internal pure override returns (string memory) {
		return "https://ipfs.io/ipfs/";
	}

	function mintItem(address to, string memory uri) public returns (uint256) {
		uint256 currentTimestamp = block.timestamp;
        uint256 lastMint = lastMintTimestamp[msg.sender];
		uint256 userMintCount = mintedCount[msg.sender];
        if (currentTimestamp >= lastMint + mintingCooldown) {
            userMintCount = 0;
			mintedCount[msg.sender] = 0;
        }
		string memory userMintCountString;
		userMintCountString = Strings.toString(userMintCount);
		require(userMintCount < maxMintPerCooldown, string.concat("ALREADY HAVE REACHED ", userMintCountString, " ", Strings.toString(currentTimestamp), " ", Strings.toString(lastMint + mintingCooldown)));

		_tokenIdCounter.increment();
		uint256 tokenId = _tokenIdCounter.current();
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, uri);

		mintedCount[msg.sender]++;
		lastMintTimestamp[msg.sender] = currentTimestamp;

		return tokenId;
	}

	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 batchSize
	) internal override(ERC721, ERC721Enumerable) {
		super._beforeTokenTransfer(from, to, tokenId, batchSize);
	}

	function _burn(
		uint256 tokenId
	) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function tokenURI(
		uint256 tokenId
	) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

	function supportsInterface(
		bytes4 interfaceId
	)
		public
		view
		override(ERC721, ERC721Enumerable, ERC721URIStorage)
		returns (bool)
	{
		return super.supportsInterface(interfaceId);
	}
}
