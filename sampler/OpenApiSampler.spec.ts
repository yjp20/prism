const openApiSampler = new OpenApiSampler();
const refAddress = {
    "type": "object",
    "properties": {
        "country": {
            "type": "string"
        },
        "postalCode": {
            "type": "string"
        }
    }
};

const refErrorModel = {
    "type": "object",
    "required": [
        "message",
        "code"
    ],
    "properties": {
        "message": {
            "type": "string"
        },
        "code": {
            "type": "integer",
            "minimum": 100,
            "maximum": 600
        }
    }
};

const refPet = {
    "type": "object",
    "discriminator": "petType",
    "properties": {
        "name": {
            "type": "string"
        },
        "petType": {
            "type": "string"
        }
    },
    "required": [
        "name",
        "petType"
    ]
};

const refCat = {
    "description": "A representation of a cat",
    "allOf": [
        refPet,
        {
            "type": "object",
            "properties": {
                "huntingSkill": {
                    "type": "string",
                    "description": "The measured skill for hunting",
                    "default": "lazy",
                    "enum": [
                        "clueless",
                        "lazy",
                        "adventurous",
                        "aggressive"
                    ]
                }
            },
            "required": [
                "huntingSkill"
            ]
        }
    ]
};

const refDog = {
    "description": "A representation of a dog",
    "allOf": [
        refPet,
        {
            "type": "object",
            "properties": {
                "packSize": {
                    "type": "integer",
                    "format": "int32",
                    "description": "the size of the pack the dog is from",
                    "default": 0,
                    "minimum": 0
                }
            },
            "required": [
                "packSize"
            ]
        }
    ]
};

test('sample', () => {
    // Primitive Sample
    openApiSampler.sample({
        "type": "string",
        "format": "email"
    });

    // Simple Model
    openApiSampler.sample({
        "type": "object",
        "required": [
            "name"
        ],
        "properties": {
            "name": {
                "type": "string"
            },
            "address": refAddress,
            "age": {
                "type": "integer",
                "format": "int32",
                "minimum": 0
            }
        }
    });

    // Model with Map/Dictionary Properties
    // For a simple string to string mapping:
    openApiSampler.sample({
        "type": "object",
        "additionalProperties": {
            "type": "string"
        }
    });
    // For a string to model mapping:
    openApiSampler.sample({
        "type": "object",
        "additionalProperties": refAddress
    });

    // Models with Composition
    openApiSampler.sample({
        "allOf": [
            refErrorModel,
            {
                "type": "object",
                "required": [
                    "rootCause"
                ],
                "properties": {
                    "rootCause": {
                        "type": "string"
                    }
                }
            }
        ]
    });


    // Models with Polymorphism Support
    openApiSampler.sample(refDog);
    openApiSampler.sample(refCat);

    // No XML Element
    openApiSampler.sample({
        "type": "array",
        "items": {
            "type": "string"
        }
    });

    // XML Name Replacement
    openApiSampler.sample({
        "type": "string",
        "xml": {
            "name": "animal"
        }
    });

    // XML Attribute, Prefix and Namespace
    openApiSampler.sample({
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "format": "int32",
                "xml": {
                    "attribute": true
                }
            },
            "name": {
                "type": "string",
                "xml": {
                    "namespace": "http://swagger.io/schema/sample",
                    "prefix": "sample"
                }
            }
        }
    });

    // XML Arrays
    openApiSampler.sample({
        "type": "array",
        "items": {
            "type": "string",
            "xml": {
                "name": "animal"
            }
        }
    });

    // Provide more XML examples
});