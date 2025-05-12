// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ThreatSharing {
    struct Threat {
        string anonymousId;
        string threatType;
        string threatValue;
        string description;
        string clubTag;
        uint256 timestamp;
        uint256 votes;
    }

    Threat[] public threats;
    address public manager;

    constructor() {
        manager = msg.sender;
    }

    function submitThreat(
        string memory _anonymousId,
        string memory _threatType,
        string memory _threatValue,
        string memory _description,
        string memory _clubTag
    ) public {
        threats.push(
            Threat({
                anonymousId: _anonymousId,
                threatType: _threatType,
                threatValue: _threatValue,
                description: _description,
                clubTag: _clubTag,
                timestamp: block.timestamp,
                votes: 0
            })
        );
    }

    function voteThreat(uint256 _index) public {
        require(_index < threats.length, "Invalid threat index");
        threats[_index].votes += 1;
    }

    function getThreatsCount() public view returns (uint256) {
        return threats.length;
    }

    function getThreat(uint256 _index) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        uint256
    ) {
        require(_index < threats.length, "Invalid threat index");
        Threat memory t = threats[_index];
        return (
            t.anonymousId,
            t.threatType,
            t.threatValue,
            t.description,
            t.clubTag,
            t.timestamp,
            t.votes
        );
    }
}
