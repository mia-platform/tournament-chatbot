# tournament-chatbot

[![Build Status](https://travis-ci.org/nastassja90/tournament-chatbot.svg?branch=master)](https://travis-ci.org/nastassja90/tournament-chatbot)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/nastassja90/tournament-chatbot)

## Usage

```sh
$ set -a && source local.env
$ npm install
$ npm run dev
```

```sh
$ set -a && source local.env
$ yarn install
$ yarn dev
```

## Deployment

This bot can be deployed to [now](https://zeit.co/now) by Zeit.
Assuming you've got `now` installed and set up:

```sh
$ now -e BOT_TOKEN='123:......' nastassja90/tournament-chatbot
```

Alternative, deploy right now without even leaving the browser:

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/nastassja90/tournament-chatbot)
