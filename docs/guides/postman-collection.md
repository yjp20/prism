# Postman Collections support

Prism offers a _limited_ support for Postman Collection. The basic workflow of using Prism (both from the CLI and deployed in a Docker container) are fundamentally the same, however there are some known limitations that it's important to keep in mind:

## Authentication

Postman collections support more authentication methods than OpenAPI 2 and 3, although some of these are a specialisation of another method included in their support; this is mostly to drive the UI of their application.

In case the authentication method does not have a corresponding element in the OpenAPI specification, it can ultimately be expressed as a header. In such a case, Prism will "downgrade" according to the following table:

| Postman Collection | Transformation         |
| ------------------ | ---------------------- |
| apikey             | apikey                 |
| bearer             | http + bearer scheme   |
| digest             | http + digest scheme   |
| oauth1             | http + bearer scheme   |
| oauth2             | http + bearer scheme   |
| awk                | Hardcoded header value |
| aws                | Hardcoded header value |
| akamai             | Hardcoded header value |
| ntlm               | Hardcoded header value |

## Events

Events are linked to the Postman hosted platform, and so Prism is going to skip this section entirely.

**Warning:** these scripts/event handlers could potentially modify variable values, with the consequence of changing the way the subsequent requests would work.

## Request Body

Postman Collections support saving GraphQL queries as well as regular HTTP. Prism has no GraphQL support at the moment, so that section is going to be skipped.

In case the disabled flag is set to true for any of the parameter type, Prism will ignore such section, as there is no concept of disabled parameter.

## JSON Schema Generation

OpenAPI 2 and 3 are schema driven, while Postman Collections are examples driven.

Essentially, while in OpenAPI 2/3 you can either define an example request/response body OR define a JSON Schema to describe how the payload will look like, in a Postman Collections you can only define examples.

For such reason, Prism will _try_ to infer a JSON Schema from an example, and use such one to perform request/response validation as well as examples generation in case the it is running in `dynamic` mode.

Infer a JSON Schema from a payload is an operation usually complicated — and there's no way a perfect result will be achieved. We can cover the base cases, but keep in mind you might get validation errors that are legit.

To give an example, this JSON object:

```json
{
  "name": "Bugatti Veyron",
  "type": "Sport Car",
  "speed": 3000
}
```

will likely generate this schema:

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "type": {
      "type": "string"
    },
    "speed": {
      "type": "number"
    }
  }
}
```

Although the result seems good:

- There is no way to understand whether all or some of the properties are required or not, so they'll all be marked as optionals.
- There is no way to understand whether a type is indeed an `enum` instead of a regular `string`. In this specific example, maybe the author's intention is that type is either `Sport Car` or `SUV`
- There is no way to understand whether a type can be something stricter; for example, maybe the author's intention was to mark the `speed` property as `integer` instead of `number`.

## Operations Merging

Postman Collections allows to define the same response multiple times, as long they differ for the returned response type, payload, examples. Prism will try to merge all these definitions in a single operation and then selecting the appropriate example based on its internal negotiator.

## Reference documents

- [Postman schema](https://schema.getpostman.com/collection/json/v2.1.0/draft-07/docs/index.html)
- [Postman Collection SDK](https://www.postmanlabs.com/postman-collection/)
