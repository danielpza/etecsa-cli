import got from "got";
import cheerio from "cheerio";

import { CookieJar } from "tough-cookie";

const cookieJar = new CookieJar();

const GOOGLE = "http://www.google.com";
const ETECSA_LOGIN = "https://secure.etecsa.net:8443";
const ETECSA_LOGIN_POST = "https://secure.etecsa.net:8443//LoginServlet";
const ETECSA_LOGOUT = "https://secure.etecsa.net:8443/LogoutServlet";
const ETECSA_TIME = "https://secure.etecsa.net:8443/EtecsaQueryServlet";

export async function login(username: string, password: string) {
  const params = await getLoginParameters();
  const loginParams = { ...params, username, password };
  const loginResponse = await postLogin(loginParams);
  const uuid = await getUuid(loginResponse);
  return uuid;
}

export async function logout(ATTRIBUTE_UUID: string) {
  const { body } = await got.get(ETECSA_LOGOUT, {
    cookieJar,
    query: {
      ATTRIBUTE_UUID,
      remove: "1"
    }
  });
  if (!body.match(/success/i)) {
    throw new Error("Error disconnecting");
  }
}

export async function status() {
  const { body } = await got.get(GOOGLE);
  return !body.match(ETECSA_LOGIN);
}

interface LoginParameters {
  wlanuserip: string;
  wlanacname: string;
  wlanmac: string;
  firsturl: string;
  ssid: string;
  usertype: string;
  gotopage: string;
  successpage: string;
  loggerId: string;
  lang: string;
  username: string;
  password: string;
  CSRFHW: string;
}

async function getLoginParameters(): Promise<LoginParameters> {
  const loginResult = await got.get(ETECSA_LOGIN, { cookieJar });

  const $ = cheerio.load(loginResult.body);
  const result = $("form#formulario")
    .find("input")
    .filter((_, el) => ["button", "reset"].indexOf($(el).attr("type")) === -1)
    .map((_, el) => ({ name: $(el).attr("name"), value: $(el).val() }))
    .get() as { name: string; value: string }[];
  const map = {} as any;
  for (const { name, value } of result) {
    map[name] = value;
  }
  return map;
}

async function postLogin(parameters: object) {
  const { body, statusCode, statusMessage, headers } = await got.post(
    ETECSA_LOGIN_POST,
    {
      form: true,
      followRedirect: true,
      throwHttpErrors: false,
      cookieJar,
      body: parameters
    }
  );
  const alertMatch = body.match(
    /<script type="text\/javascript">\s*alert\("([\w ().\p{L}]+)"\);/u
  );
  if (alertMatch) {
    throw new Error(alertMatch[1]);
  }
  if (statusCode !== 302) {
    throw new Error(`Server responded with ${statusCode}: ${statusMessage}`);
  }
  return headers.location!; // TODO check for location to be undefined
}

async function getUuid(url: string) {
  const { body } = await got.get(url, { cookieJar });
  const uuidMatch = body.match(/ATTRIBUTE_UUID=(\w*)&/);
  if (!uuidMatch) {
    throw new Error("No uuid in page");
  }
  return uuidMatch[1];
}

export async function getTime(username: string) {
  const { body } = await got.post(ETECSA_TIME, {
    cookieJar,
    query: { op: "getLeftTime", op1: username }
  });
  return body;
}
