# etecsa-cli

[![npm version](https://img.shields.io/npm/v/etecsa-cli.svg)](https://www.npmjs.com/package/etecsa-cli)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

ETECSA login manager

## Requirements

- npm
- node

## Install

```sh
npm i -g etecsa-cli
```

## Usage

```sh
$ etecsa command

Usage

  Command one of

  - set user pass
  - login
  - logout
  - status
  - time

Example

  $ etecsa set myuser mypass
  $ etecsa login
  $ etecsa status
  Connected
  $ etecsa time
  00:34:48
```

Config is stored in ~/.cache/.etecsa.json

## Contributing

```sh
git clone https://github.com/danielpza/etecsa-cli.git
cd etecsa-cli
npm link
```

## Gnome Integration

[Etecsa Login Gnome Shell Extension](https://github.com/danielpza/etecsa-login-gnome-shell-extension)
