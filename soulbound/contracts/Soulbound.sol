// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";

contract Soulbound is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    mapping(address => bool) private _hasToken;
    mapping(address => uint256) private _tokenIdByAddress;

    constructor() ERC721("SoulBound", "SBT") Ownable(msg.sender) {}

    function safeMint(address to, string memory metadataURI) public onlyOwner {
        require(!_hasToken[to], "Address already holds a token");
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        _hasToken[to] = true;
        _tokenIdByAddress[to] = newTokenId;
    }

    function getTokenIdByAddress(address owner) public view returns (uint256) {
        require(_hasToken[owner], "Address does not hold a token");
        return _tokenIdByAddress[owner];
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("Soulbound tokens cannot be transferred");
        }
        return super._update(to, tokenId, auth);
    }

    function setApprovalForAll(
        address,
        bool
    ) public pure override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be approved for all");
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be approved for transfer");
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
