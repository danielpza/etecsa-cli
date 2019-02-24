#!/usr/bin/env node
import { login, logout, set, status } from "./index";

const option = process.argv[2];

if (!option) {
  console.error("Must select option");
  showHelp();
  process.exit(1);
}

if (option === "set") {
  const [user, pass] = process.argv.slice(3);
  set(user, pass).catch(handleError);
}
if (option === "login") {
  login().catch(handleError);
}
if (option === "logout") {
  logout().catch(handleError);
}
if (option === "status") {
  status().catch(handleError);
}

function handleError(err: Error) {
  console.error(err);
  process.exit(1);
}

function showHelp() {
  console.log(`\
$ etecsa command

Usage

  Command one of

  - set user pass
  - login
  - logout
  - status

Example

  $ etecsa set myuser mypass
  $ etecsa login
  $ etecsa status
  Connected
`);
}
