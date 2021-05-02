export const __prod__ = process.env.NODE_ENV === "production";

// app secret
export const __secret__ = "cGFyY2VsdHJhY2tpbmc=";

// message
export const NOT_AUTHORIZED = "You are not authorized";
export const ORDER_NOT_FOUND = "We couldn't find your order, please try agian!";
export const RESPONSE_TO_USER =
  "Your order is recorded. We will notify you when there is an update!";

// redis
export const FORGET_PASSWORD_PREFIX = "forget-password:";
export const EXTERNAL_TOKEN_PREFIX = "token:";
export const COOKIE_NAME = "qid";

// postgres
export const __dbname__ = "parceltrackingdb";
export const __dbusername__ = "";
export const __dbpassword__ = "";
