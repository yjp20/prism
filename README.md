<div align="center">
  <a href="https://stoplight.io/api-mocking?utm_source=github&utm_medium=prism&utm_campaign=readme">
    <img src="./examples/readme-header.svg" alt="Life-like mock servers from any API Specification Document.">
	<br>
  <br>
  <a href="https://circleci.com/gh/stoplightio/prism">
    <img src="https://img.shields.io/circleci/build/github/stoplightio/prism/master" alt="Build Status">
  </a>
  <a href="https://www.npmjs.com/package/@stoplight/prism-cli">
    <img src="https://img.shields.io/npm/dw/@stoplight/prism-http?color=blue" alt="NPM Downloads">
  </a>
  <a href="https://offset.earth/stoplightinc">
    <img src="https://img.shields.io/badge/Buy%20us%20a%20tree-%F0%9F%8C%B3-lightgreen" alt="Buy us a Tree">
  </a>
	<br>
  <br>
</div>

- **Mock Servers**: Life-like mock servers from any API Specification Document.
- **Validation Proxy**: Contract Testing for API Consumers and Developers.
- **Comprehensive API Specification Support**: OpenAPI 3.0, OpenAPI 2.0 (FKA Swagger) and Postman Collections support.

![Demo of Prism Mock Server being called with curl from the CLI](./examples/prism-cli.svg)

> Note: This branch refers to Prism 3.x, which is the current version most likely you will use. If you're looking for the 2.x version, look at the [`2.x` branch][2.x]

## 🧰 Install and Use

**Installation**
```bash
npm install -g @stoplight/prism-cli

# OR

yarn global add @stoplight/prism-cli
```
> Prism requires NodeJS >= 12 to properly work.

For more installation options, see our [installation documentation](https://meta.stoplight.io/docs/prism/docs/getting-started/01-installation.md).

**Mocking**

```bash
prism mock https://raw.githack.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml
```

**Validation Proxy**

```bash
prism proxy examples/petstore.oas2.yaml https://petstore.swagger.io/v2
```

## 📖 Documentation & Community

- [Documentation](https://meta.stoplight.io/docs/prism)
  - [Getting Started](https://meta.stoplight.io/docs/getting-started/01-installation.md)
  - [Guides](https://meta.stoplight.io/docs/guides/01-mocking.md)
- [Community](https://github.com/stoplightio/prism/discussions)

## 🚧 Roadmap

- [x] Content Negotiation
- [x] Security Validation
- [x] Validation Proxy
- [ ] Custom Mocking
- [ ] Recording / "Learning" mode to create spec files
- [ ] Data Persistence (allow Prism act like a sandbox)

## ❓ FAQs

**Cannot access mock server when using docker?**

Prism uses localhost by default, which usually means 127.0.0.1. When using docker the mock server will
be unreachable outside of the container unless you run the mock command with `-h 0.0.0.0`.

**Why am I getting 404 errors when I include my basePath?**

OpenAPI v2.0 had a concept called "basePath", which was essentially part of the HTTP path the stuff
after host name and protocol, and before query string. Unlike the paths in your `paths` object, this
basePath was applied to every single URL, so Prism v2.x used to do the same. In OpenAPI v3.0 they
merged the basePath concept in with the server.url, and Prism v3 has done the same.

We treat OAS2 `host + basePath` the same as OAS3 `server.url`, so we do not require them to go in
the URL. If you have a base path of `api/v1` and your path is defined as `hello`, then a request to
`http://localhost:4010/hello` would work, but `http://localhost:4010/api/v1/hello` will fail. This
confuses some, but the other way was confusing to others. Check the default output of Prism CLI to
see what URLs you have available.

**Is there a hosted version of Prism?**

Yes, hosted mocking is available as part of Stoplight Platform. [Learn More](https://stoplight.io/api-mocking?utm_source=github&utm_medium=prism&utm_campaign=readme) 

## ⚙️ Integrations

- [Stoplight Studio](https://stoplight.io/studio/?utm_source=github&utm_medium=prism&utm_campaign=readme): Free visual OpenAPI designer that comes integrated with mocking powered by Prism.
- [Stoplight Platform](https://stoplight.io/?utm_source=github&utm_medium=prism&utm_campaign=readme): Collaborative API Design Platform for designing, developing and documenting APIs with hosted mocking powered by Prism. 

## 🏁 Help Others Utilize Prism 

If you're using Prism for an interesting use case, create a pull request or [contact us]() for a case study. Spread the goodness 🎉

## 👏 Contributing

If you are interested in contributing to Prism itself, check out our [contributing docs ⇗][contributing] and [code of conduct ⇗][code_of_conduct] to get started.

This project is maintained by [Stoplight](https://stoplight.io/?utm_source=github&utm_medium=prism&utm_campaign=readme)

## 🎉 Thanks

Prism is built on top of lots of excellent packages, and here are a few we'd like to say a special thanks to.

- [ajv](https://www.npmjs.com/package/ajv)
- [faker](https://www.npmjs.com/package/faker)
- [fp-ts](https://www.npmjs.com/package/fp-ts)
- [gavel](https://www.npmjs.com/package/gavel)
- [json-schema-faker](https://www.npmjs.com/package/json-schema-faker)
- [lerna](https://www.npmjs.com/package/lerna)
- [micri](https://www.npmjs.com/package/micri)
- [openapi-sampler](https://www.npmjs.com/package/openapi-sampler)
- [yargs](https://www.npmjs.com/package/yargs)

Check these projects out!

[code_of_conduct]: CODE_OF_CONDUCT.md
[contributing]: CONTRIBUTING.md
[download-release]: https://github.com/stoplightio/prism/releases/latest
[core]: https://www.npmjs.com/package/@stoplight/prism-core
[http]: https://www.npmjs.com/package/@stoplight/prism-http
[http-server]: https://www.npmjs.com/package/@stoplight/prism-http-server
[cli]: https://www.npmjs.com/package/@stoplight/prism-cli
[cli-docs]: ./docs/getting-started/03-cli.md
[2.x]: https://github.com/stoplightio/prism/tree/2.x
[http-docs]: packages/http/README.md

## 📜 License

Prism is 100% free and open-source, under [Apache License 2.0](LICENSE).

## 🌲 Sponsor Prism by Planting a Tree

<div align="center">
  <a href="https://offset.earth/stoplightinc">
    <img src="https://i.ibb.co/xfHsXgn/ecologi-social-good-graphic.png" alt="Buy us a tree">
	<br>
  <br>
  <a href="https://offset.earth/stoplightinc">
    <img src="https://img.shields.io/badge/Buy%20us%20a%20tree-%F0%9F%8C%B3-lightgreen" alt="Buy us a Tree">
  </a>
</div>