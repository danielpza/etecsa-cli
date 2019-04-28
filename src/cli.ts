#!/usr/bin/env node
import { login, logout, set, status, time } from "./index";

const option = process.argv[2];

if (!option) {
  console.error("Must select option");
  showHelp();
  process.exit(1);
}

if (option === "set") {
  const [user, pass] = process.argv.slice(3);
  set(user, pass).catch(handleError);
} else if (option === "login") {
  login().catch(handleError);
} else if (option === "logout") {
  logout().catch(handleError);
} else if (option === "status") {
  status().catch(handleError);
} else if (option === "time") {
  time().catch(handleError);
} else {
  console.error(`unknown command ${option}`);
  showHelp();
  process.exit(1);
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
  - time

Example

  $ etecsa set myuser mypass
  $ etecsa login
  $ etecsa status
  Connected
  $ etecsa time
  00:34:48
`);
}
