# Taralbot

![License DBAD](https://img.shields.io/badge/license-DBAD-brightgreen) ![Version v0.4.2](https://img.shields.io/badge/version-v0.4.2-blue)

_Taralbok's finest Discord bot._

Taralbot is a Discord bot that implements some interesting features. It does not aim to become a globally used service but rather just a simple reference.

## Requirements

This project requires [NodeJS](https://nodejs.org/en/) and [npm](https://www.npmjs.com/). To connect to the Discord API, the bot also needs a security token which must be generated on [Discord's Developer Portal](https://discord.com/developers).

## Installation

Install all the dependencies with npm :

```
npm install
```

## Configuration

Configuration is done via Environment variables.

- `TOKEN`: Set your Discord API security token

```
TOKEN='XXXXXXXXXXXXXXXXXXXXXXXX.YYYYYY.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ' npm run start
```

## Running

Start the bot with npm :

```
npm run start > latest.log
```

_Logs are currently written to stdout_
