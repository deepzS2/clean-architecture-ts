<h1 align="center">Clean Architecture with Typescript</h1>

<div align="center">
  <a href='https://github.com/deepzS2/clean-architecture-ts/actions/workflows/node.js.yml'><img src='https://github.com/deepzS2/clean-architecture-ts/actions/workflows/node.js.yml/badge.svg' alt='Build' /></a>
  <a href='https://coveralls.io/github/deepzS2/clean-architecture-ts?branch=main&service'><img src='https://coveralls.io/repos/github/deepzS2/clean-architecture-ts/badge.svg?branch=main&service=github' alt='Coverage Status' /></a>
</div>

<p align="center">Learning about Clean Architecture with Typescript (Node.js), applying Design Patterns, Test-Driven Development, Domain Driven Design, SOLID, etc.</p>

<p align="right">
  <em>Course provided by <a href="https://github.com/rmanguinho">Rodrigo Manguinho</a> in Udemy platform.</em>
</p>

## Original repository

Here is the [original repository](https://github.com/rmanguinho/clean-ts-api) link, the content is in Portuguese.

## What I changed from original?

Instead of using [Jest](https://jestjs.io/pt-BR/) which is used for Node.js testing, I used the newest [Vitest](https://vitest.dev) which has support for Jest syntax and is `blazingly fast`.

I also used [Github Actions](https://github.com/features/actions) instead of [Travis CI](https://www.travis-ci.com), I give it a try and is really awesome all the possibilities you have for making your Continuous Integration looks great.

## Test it yourself

You can run the tests or even run the [Docker](https://www.docker.com) for running the API.

Run the tests with the following commands:

```bash
# Unit tests
yarn test:unit

# Integration tests
yarn test:integration

# Tests with coverage
yarn test:ci

# Run all tests
yarn test
```

Or simply run the following commands to run the containers:

```bash
# Run the mongo and api containers with docker-compose.yml configuration
yarn up
```
