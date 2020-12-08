const log = (status, message, payload) => {
  const formattedPayload = () => {
    if (payload != null) {
      if (typeof payload === 'object') {
        if (payload.body != null) {
          return JSON.stringify(payload.body, null, 2);
        }
        return payload;
      }
      return payload;
    }
    return '';
  };
  console.log(`${status} \x1b[0m [${new Date().toISOString()}]  ${message}`, formattedPayload());
};

module.exports = {
  q_logger: {
    apiIn: (message, payload) => log('\x1b[36mIN   ', message), // cyan
    apiOut: (message, payload) => log('\x1b[35mOUT  ', message, payload), // magenta
    info: (message, payload) => log('\x1b[32mINFO ', message, payload), // green
    warn: (message, payload) => log('\x1b[33mWARN ', message, payload), // yellow
    error: (message, payload) => log('\x1b[31mERROR', message, payload), // red
  },
};
