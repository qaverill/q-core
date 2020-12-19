/* eslint-disable no-console */
// ----------------------------------
// HELPERS
// ----------------------------------
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const TAB = '\x1b[0m';
const log = (status, message, payload) => {
  const timestamp = new Date().toISOString();
  const possibleColon = payload ? ':' : '';
  console.log(`${status} ${TAB} [${timestamp}]  ${message}${possibleColon}`);
  if (payload) console.log(payload);
};
// ----------------------------------
// LOGGERS
// ----------------------------------
module.exports = {
  apiIn: (message, payload) => log(`${CYAN}IN   `, message, payload),
  apiOut: (message, payload) => log(`${MAGENTA}OUT  `, message, payload),
  info: (message, payload) => log(`${GREEN}INFO `, message, payload),
  warn: (message, payload) => log(`${YELLOW}WARN `, message, payload),
  error: (message, payload) => log(`${RED}ERROR  `, message, payload),
};
