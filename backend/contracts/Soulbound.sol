// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";

contract Soulbound is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(address => bool) private _hasToken;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("SoulBound", "SBT") Ownable(msg.sender) {}

    function safeMint(
        address to,
        string calldata metadataURI
    ) public onlyOwner {
        require(to != address(0) && !_hasToken[to], "Invalid mint");

        unchecked {
            _tokenIdCounter++;
        }
        _tokenURIs[_tokenIdCounter] = metadataURI;
        _safeMint(to, _tokenIdCounter);
        _hasToken[to] = true;
    }

    function hasToken(address owner) external view returns (bool) {
        return _hasToken[owner];
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("No transfers");
        }
        return super._update(to, tokenId, auth);
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("No approvals");
    }

    function approve(address, uint256) public pure override {
        revert("No approvals");
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }
}
