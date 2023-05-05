// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract MultiSig {

    // 컨트랙트의 오너만 transfer 가능하게 하기 위해.
    address public owner;

    // 트랜잭션 data 영역에 포함된 서명 검증에 필요한 데이터.
    uint public requiredSignatures;
    int public nonce;
    constructor(address _owner, uint _requiredSignatures) {
        owner = _owner;
        requiredSignatures = _requiredSignatures;
        nonce = 0;
    }

    function transfer(address _to, uint _value, uint _nonce, bytes memory _signature) payable public {
        require(owner == msg.sender, "Sender is not an owner");
        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, _to, _value, _nonce)));
        address recoveredAddress = ecrecover(message, uint8(_signature[0]), bytes32ToBytes(_signature, 1), bytes32ToBytes(_signature, 33));
        require(owner[recoveredAddress], "Invalid signature");
        // perform the transfer
        // ...
    }

    function prefixed(bytes32 _hash) private pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));
    }

    function bytes32ToBytes(bytes memory _data, uint _offset) private pure returns (bytes memory) {
        uint length = _data.length - _offset;
        bytes memory result = new bytes(length);
        for (uint i = 0; i < length; i++) {
            result[i] = _data[_offset + i];
        }
        return result;
    }
}
