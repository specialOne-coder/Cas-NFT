//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CasNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 supply = 500;
    event Airdrop(address indexed to, uint256 tokenId);
    string public baseTokenURI;
    uint256 limitMintPerWallet = 5;
    uint256 wlMintPerWallet = 1;
    mapping(address => uint) userMint;
    mapping(address => uint) wlMint;

    constructor(string memory baseURI) ERC721("CasNFT", "CAS") {
        setBaseURI(baseURI);
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    /// Mint NFT function
    function mintNFT(uint256 _numTokens) public {
        require(
            _numTokens > 0 && _numTokens < limitMintPerWallet,
            "Tokens number should be greater than 0"
        );
        require(
            userMint[msg.sender] + _numTokens <= limitMintPerWallet,
            "Exceeds limit"
        );
        require(_tokenIds.current() < supply, "Supply exceded");
        for (uint i = 0; i < _numTokens; ) {
            uint mintIndex = _tokenIds.current();
            if (mintIndex < 1000) {
                _safeMint(_msgSender(), mintIndex);
                _tokenIds.increment();
            }
            unchecked {
                i++;
            }
        }
        userMint[msg.sender] += _numTokens;
    }

    // burn nft with tokenId as param
    function burnNFT(uint256 tokenId) public {
        require(
            ownerOf(tokenId) == _msgSender(),
            "You are not the owner of this token"
        );
        _burn(tokenId);
    }

    /// only owner airdrop function
    function airdrop(address[] memory recipients) public onlyOwner {
        require(_tokenIds.current() < supply, "Supply exceded");
        for (uint256 i = 0; i < recipients.length; ) {
            uint mintIndex = _tokenIds.current();
            if (mintIndex < 1000) {
                uint256 newItemId = _tokenIds.current();
                _mint(recipients[i], newItemId);
                _tokenIds.increment();
                emit Airdrop(recipients[i], newItemId);
            }
            unchecked {
                ++i;
            }
        }
    }

    // tokenUri function returns the URI of the token if it is revealed.
    function tokenURI(
        uint256 _nftId
    ) public view override returns (string memory) {
        require(_exists(_nftId), "This NFT doesn't exist.");

        string memory currentBaseURI = baseTokenURI;
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        Strings.toString(_nftId),
                        ".json"
                    )
                )
                : "";
    }

    function getTokenIds(address _owner) public view returns (uint[] memory) {
        uint[] memory _tokensOfOwner = new uint[](ERC721.balanceOf(_owner));
        uint i;

        for (i = 0; i < ERC721.balanceOf(_owner); i++) {
            _tokensOfOwner[i] = ERC721Enumerable.tokenOfOwnerByIndex(_owner, i);
        }
        return (_tokensOfOwner);
    }

    function recoverSigner(
        bytes32 hash,
        bytes memory signature
    ) public pure returns (address) {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSA.recover(messageDigest, signature);
    }

    function presale(
        uint256 _numTokens,
        bytes32 hash,
        bytes memory signature
    ) public {
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not allowlisted"
        );
        require(
            _numTokens > 0 && _numTokens < wlMintPerWallet,
            "Tokens number should be greater than 0"
        );
        require(
            wlMint[msg.sender] + _numTokens <= wlMintPerWallet,
            "Exceeds limit"
        );
        require(_tokenIds.current() < supply, "Supply exceded");
        for (uint i = 0; i < _numTokens; ) {
            uint mintIndex = _tokenIds.current();
            if (mintIndex < 1000) {
                _safeMint(_msgSender(), mintIndex);
                _tokenIds.increment();
            }
            unchecked {
                i++;
            }
        }
        wlMint[msg.sender] += _numTokens;
    }
}
