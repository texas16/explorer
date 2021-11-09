/**
 * Diem Dev API Specification
 * Diem Dev API is REST API for client applications to interact the Diem blockchain. 
 *
 * OpenAPI spec version: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { BlockMetadataTransactionProperties } from './BlockMetadataTransactionProperties';
import { OnChainTransactionInfo } from './OnChainTransactionInfo';
import { HttpFile } from '../http/http';

export class BlockMetadataTransaction {
    'type': string;
    /**
    * All bytes data are represented as hex-encoded string prefixed with `0x` and fulfilled with two hex digits per byte.  Different with `Address` type, hex-encoded bytes should not trim any zeros.
    */
    'id': string;
    /**
    * Unsiged int64 type value
    */
    'round': string;
    'previousBlockVotes': Array<string>;
    /**
    * Hex-encoded 16 bytes Diem account address.  Prefixed with `0x` and leading zeros are trimmed.  See [doc](https://diem.github.io/move/address.html) for more details.
    */
    'proposer': string;
    /**
    * Timestamp in microseconds, e.g. ledger / block creation timestamp.
    */
    'timestamp': string;
    /**
    * Unsiged int64 type value
    */
    'version': string;
    /**
    * All bytes data are represented as hex-encoded string prefixed with `0x` and fulfilled with two hex digits per byte.  Different with `Address` type, hex-encoded bytes should not trim any zeros.
    */
    'hash': string;
    /**
    * All bytes data are represented as hex-encoded string prefixed with `0x` and fulfilled with two hex digits per byte.  Different with `Address` type, hex-encoded bytes should not trim any zeros.
    */
    'stateRootHash': string;
    /**
    * All bytes data are represented as hex-encoded string prefixed with `0x` and fulfilled with two hex digits per byte.  Different with `Address` type, hex-encoded bytes should not trim any zeros.
    */
    'eventRootHash': string;
    /**
    * Unsiged int64 type value
    */
    'gasUsed': string;
    /**
    * Transaction execution result (success: true, failure: false). See `vm_status` for human readable error message from Diem VM.
    */
    'success': boolean;
    /**
    * Human readable transaction execution result message from Diem VM.
    */
    'vmStatus': string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "type",
            "baseName": "type",
            "type": "string",
            "format": ""
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "string",
            "format": "hex"
        },
        {
            "name": "round",
            "baseName": "round",
            "type": "string",
            "format": "uint64"
        },
        {
            "name": "previousBlockVotes",
            "baseName": "previous_block_votes",
            "type": "Array<string>",
            "format": "address"
        },
        {
            "name": "proposer",
            "baseName": "proposer",
            "type": "string",
            "format": "address"
        },
        {
            "name": "timestamp",
            "baseName": "timestamp",
            "type": "string",
            "format": "uint64"
        },
        {
            "name": "version",
            "baseName": "version",
            "type": "string",
            "format": "uint64"
        },
        {
            "name": "hash",
            "baseName": "hash",
            "type": "string",
            "format": "hex"
        },
        {
            "name": "stateRootHash",
            "baseName": "state_root_hash",
            "type": "string",
            "format": "hex"
        },
        {
            "name": "eventRootHash",
            "baseName": "event_root_hash",
            "type": "string",
            "format": "hex"
        },
        {
            "name": "gasUsed",
            "baseName": "gas_used",
            "type": "string",
            "format": "uint64"
        },
        {
            "name": "success",
            "baseName": "success",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "vmStatus",
            "baseName": "vm_status",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return BlockMetadataTransaction.attributeTypeMap;
    }
    
    public constructor() {
    }
}
