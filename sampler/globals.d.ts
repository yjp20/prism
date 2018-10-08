declare type SchemaObjectType = 'integer' | 'number' | 'string' | 'boolean' | 'file' | 'null' | 'object' | 'array';

// integer  integer	int32	signed 32 bits
// long integer	int64	signed 64 bits
// TODO: review field types
// 
declare interface SchemaObject {
    /** START http://json-schema.org/latest/json-schema-validation.html **/
    // Validation Keywords for Any Instance Type
    type: string;
    enum?: any[];

    // Validation Keywords for Numeric Instances (number and integer)
    multipleOf?: number;
    maximum?: number;
    minimum?: number;
    exclusiveMaximum?: number;    
    exclusiveMinimum?: number;

    // Validation Keywords for Strings
    maxLength?: number;
    minLength?: number;
    pattern?: string;

    // Validation Keywords for Arrays
    items?: SchemaObject | SchemaObject[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;

    // Validation Keywords for Objects
    properties?: { [key: string]: SchemaObject };
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: SchemaObject;

    // Keywords for Applying Subschemas With Boolean Logic
    allOf?: SchemaObject[];

    // Defined Formats:
    /**
     * - Dates and Times
     * - Email Addresses
     * - Hostnames
     * - IP Addresses
     * - Resource Identifiers
     * - uri-template
     * - JSON Pointers
     * - regex
     **/
    format: string;

    // Schema Annotations
    title?: string;
    description?: string;
    default?: any;                                
    readOnly?: boolean;
    /** END OF http://json-schema.org/latest/json-schema-validation.html **/

    /** START OF "OAS2 SchemaObject" **/
    discriminator?: string;
    xml?: any; // should be Xml Object type
    externalDocs?: any; // should be External Documentation Object
    example?: any;
    /** END OF "OAS2 SchemaObject" **/
}