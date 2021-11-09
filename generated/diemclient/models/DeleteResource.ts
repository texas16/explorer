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

import { HttpFile } from '../http/http';

/**
* Delete account resource change.
*/
export class DeleteResource {
    'type': string;
    /**
    * Hex-encoded 16 bytes Diem account address.  Prefixed with `0x` and leading zeros are trimmed.  See [doc](https://diem.github.io/move/address.html) for more details.
    */
    'address': string;
    /**
    * String representation of an on-chain Move struct.  It is a combination of:   1. `Move module address`, `module name` and `struct name` joined by `::`.   2. `struct generic type parameters` joined by `, `.   Examples:   * `0x1::Diem::Diem<0x1::XDX::XDX>`   * `0x1::Abc::Abc<vector<u8>, vector<u64>>`   * `0x1::DiemAccount::AccountOperationsCapability`   Note:   1. Empty chars should be ignored when comparing 2 struct tag ids.   2. When used in an URL path, should be encoded by url-encoding (AKA percent-encoding).   See [doc](https://diem.github.io/move/structs-and-resources.html) for more details.
    */
    'resource': string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "type",
            "baseName": "type",
            "type": "string",
            "format": ""
        },
        {
            "name": "address",
            "baseName": "address",
            "type": "string",
            "format": "address"
        },
        {
            "name": "resource",
            "baseName": "resource",
            "type": "string",
            "format": "move_type"
        }    ];

    static getAttributeTypeMap() {
        return DeleteResource.attributeTypeMap;
    }
    
    public constructor() {
    }
}
