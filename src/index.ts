import * as api from "./core";
import { resolve } from "path";
import { readFile as readFileCb, writeFile as writeFileCb } from "fs";
import { promisify } from "util";
import { homedir } from "os";

const readFile = promisify(readFileCb);
const writeFile = promisify(writeFileCb);

const configFile = resolve(
  process.env.XDG_CACHE_HOME || resolve(homedir(), ".cache"),
  "etecsa.json"
);

export async function login() {
  const { user, pass } = await readConfig();
  const uuid = await api.login(user, pass);
  console.log(`Logged in`);
  await writeConfig({ user, pass, uuid });
}

export async function logout() {
  const { user, pass, uuid } = await readConfig();
  await api.logout(uuid);
  console.log("Logged out");
  await writeConfig({ user, pass });
}

export async function set(user: string, pass: string) {
  await writeConfig({ user, pass });
}

export async function status() {
  if (await api.status()) {
    console.log("Connected");
  } else {
    console.log("Not Connected");
  }
}

export async function time() {
  const { user } = await readConfig();
  console.log(await api.getTime(user));
}

async function readConfig() {
  const file = await readFile(configFile);
  return JSON.parse(file.toString());
}

async function writeConfig(config: any) {
  await writeFile(configFile, JSON.stringify(config));
}
