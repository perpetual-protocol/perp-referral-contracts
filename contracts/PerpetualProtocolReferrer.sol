// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.7.6;
pragma abicoder v2;

import {SafeOwnable} from "./SafeOwnable.sol";

contract PerpetualProtocolReferrer is SafeOwnable {
    enum UpsertAction {
        ADD,
        REMOVE,
        UPDATE
    }

    struct Partner {
        uint256 createdAt;
        string referralCode;
        address createdBy;
    }

    struct Trader {
        string referralCode;
        uint256 createdAt;
        uint256 updatedAt;
    }

    event OnReferralCodeCreated(
        address createdBy,
        address createdFor,
        uint256 timestamp,
        string referralCode
    );

    event OnReferralCodeUpserted(
        address addr,
        UpsertAction action,
        uint256 timestamp,
        string newReferralCode,
        string oldReferralCode
    );

    event OnUncappedPartnerAssigned(address addr, string tier);

    event OnUncappedPartnerRemoved(address addr);

    mapping(address => Partner) public partners;
    mapping(address => Trader) public traders;
    mapping(string => address) public referralCodeToPartnerMap;
    mapping(address => string) public uncappedPartners;

    bool private isInitialised;

    function init() public initializer {
        require(
            !isInitialised,
            "Contract instance has already been initialized"
        );
        isInitialised = true;
        __SafeOwnable_init();
    }

    function _createReferralCode(
        address createdFor,
        string calldata referralCode
    ) internal {
        address sender = msg.sender;
        uint256 timestamp = block.timestamp;
        // the partner for a code that already exists, used to check against a referral code
        // that has already been assigned
        address existingReferralCodePartner = referralCodeToPartnerMap[
            referralCode
        ];
        // the partner being assigned a new code cannot have an existing code - check using this
        Partner memory existingPartner = partners[createdFor];
        require(bytes(referralCode).length > 0, "Provide a referral code.");
        require(
            createdFor != address(0x0),
            "Provide an address to create the code for."
        );
        require(
            existingReferralCodePartner == address(0x0),
            "This referral code has already been assigned to an address."
        );
        require(
            bytes(existingPartner.referralCode).length == 0,
            "This address already has a referral code assigned."
        );

        partners[createdFor] = Partner(timestamp, referralCode, sender);
        referralCodeToPartnerMap[referralCode] = createdFor;
        emit OnReferralCodeCreated(sender, createdFor, timestamp, referralCode);
    }

    function createReferralCode(string calldata referralCode) public {
        _createReferralCode(msg.sender, referralCode);
    }

    function getReferralCodeByPartnerAddress(address partnerAddress)
        external
        view
        returns (string memory)
    {
        Partner memory partner = partners[partnerAddress];
        require(
            bytes(partner.referralCode).length > 0,
            "Referral code doesn't exist"
        );
        return (partner.referralCode);
    }

    function getMyRefereeCode() public view returns (string memory) {
        Trader memory trader = traders[msg.sender];
        require(
            bytes(trader.referralCode).length > 0,
            "You do not have a referral code"
        );
        return (trader.referralCode);
    }

    function getRefereeCodeByTraderAddress(address traderAddress) public view returns (string memory) {
        Trader memory trader = traders[traderAddress];
        require(
            bytes(trader.referralCode).length > 0,
            "Trader dosen't have a referral code"
        );
        return (trader.referralCode);
    }

    function _setReferralCode(string calldata referralCode, address sender)
        internal
    {
        address partner = referralCodeToPartnerMap[referralCode];
        uint256 timestamp = block.timestamp;
        UpsertAction action;
        string memory oldReferralCode = referralCode;

        require(
            partner != sender,
            "You cannot be a referee of a referral code you own"
        );

        // the trader in we are performing the upserts for
        Trader storage trader = traders[sender];

        if (
            bytes(referralCode).length == 0 &&
            bytes(trader.referralCode).length == 0
        ) {
            revert("No referral code was supplied or found.");
        }

        // when referral code is supplied by the trader
        if (bytes(referralCode).length > 0) {
            // if mapping does not exist, referral code doesn't exist.
            require(partner != address(0x0), "Referral code does not exist");

            // if there is a referral code already for that trader, update it with the supplied one
            if (bytes(trader.referralCode).length > 0) {
                oldReferralCode = trader.referralCode;
                trader.referralCode = referralCode;
                trader.updatedAt = timestamp;
                action = UpsertAction.UPDATE;
            } else {
                // if a code doesn't exist for the trader, create the trader
                traders[sender] = Trader(referralCode, timestamp, timestamp);
                action = UpsertAction.ADD;
            }
            // if the referral is not supplied and trader exists, delete trader
        } else if (bytes(trader.referralCode).length > 0) {
            oldReferralCode = trader.referralCode;
            delete traders[sender];
            action = UpsertAction.REMOVE;
        }
        emit OnReferralCodeUpserted(
            sender,
            action,
            timestamp,
            referralCode,
            oldReferralCode
        );
    }

    function setReferralCode(string calldata referralCode) public {
        address sender = msg.sender;
        _setReferralCode(referralCode, sender);
    }

    function _importPartner(
        address partnerAddress,
        string calldata referralCode,
        address[] calldata tradersToImport
    ) public onlyOwner {
        _createReferralCode(partnerAddress, referralCode);
        for (uint256 i = 0; i < tradersToImport.length; i++) {
            _setReferralCode(referralCode, tradersToImport[i]);
        }
    }

    function _upsertUncappedPartner(
        address partnerAddress,
        string calldata tier
    ) public onlyOwner {
        require(partnerAddress != address(0x0), "Provide an address");
        require(bytes(tier).length > 0, "Provide a tier");

        Partner memory partner = partners[partnerAddress];
        require(
            bytes(partner.referralCode).length > 0,
            "Partner does not exist"
        );

        uncappedPartners[partnerAddress] = tier;
        emit OnUncappedPartnerAssigned(partnerAddress, tier);
    }

    function _removeUncappedPartner(address partnerAddress) public onlyOwner {
        require(partnerAddress != address(0x0), "Provide an address");

        Partner memory partner = partners[partnerAddress];
        require(
            bytes(partner.referralCode).length > 0,
            "Partner does not exist"
        );

        string memory tier = uncappedPartners[partnerAddress];
        require(bytes(tier).length > 0, "Partner is not uncapped");

        delete uncappedPartners[partnerAddress];
        emit OnUncappedPartnerRemoved(partnerAddress);
    }

    function _batchUpdateUncappedPartner(
        address[] calldata partnerAddresses,
        string[] calldata tiers
    ) public onlyOwner {
        require(
            partnerAddresses.length == tiers.length,
            "Partner list and tier list are mistmatched"
        );
        for (uint256 i = 0; i < partnerAddresses.length; i++) {
            if (keccak256(bytes(tiers[i])) == keccak256("0")) {
                _removeUncappedPartner(partnerAddresses[i]);
            } else {
                _upsertUncappedPartner(partnerAddresses[i], tiers[i]);
            }
        }
    }
}
