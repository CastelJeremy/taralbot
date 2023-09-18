# Taralbot

![License DBAD](https://img.shields.io/badge/license-DBAD-brightgreen) ![Version v0.6.0](https://img.shields.io/badge/version-v0.6.0-blue)

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

-   `TOKEN`: Set your Discord API security token

```
TOKEN='XXXXXXXXXXXXXXXXXXXXXXXX.YYYYYY.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ' npm run start
```

-   `TRACKED_CHANNELS`: JSON encoded string containing the channels ids and their destination folder if you want automatic image backup.

```
TRACKED_CHANNELS='{"XXXXXXXXXXXXXXXXXXX":"/tmp/backup/channel1"}'
```

-   `TRACKED_USERS`: JSON encoded string containing the users ids and the username you want to configure for the image backup.

```
TRACKED_USERS='{"XXXXXXXXXXXXXX":"JohnSmith"}'
```

-   `CHECK_ATTACHMENT_ONSTART` (default=FALSE): Boolean value wich enable or disable parsing old missing attachments from tracked channels.

```
CHECK_ATTACHMENT_ONSTART=false
```

## Running

Start the bot with npm :

```
npm run start > latest.log
```

_Logs are currently written to stdout_

## Image Backup

You can set both `TRACKED_CHANNELS` and `TRACKED_USERS` environment variables to configure automatic image backup. This feature will download every attachments from the configured tracked channels and users and store them wherever you want. Great if you don't want to lose any images you share.

Attachments are renamed with the following format: `yyyyLLdd_HHmmss_xyzuqpli_username.png`

Currently the following image types are supported:

-   gif
-   jpg
-   png
-   svg
-   webp
