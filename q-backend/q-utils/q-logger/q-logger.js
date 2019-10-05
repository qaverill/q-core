const log = (status, message, payload) => {
    console.log(`${status} \x1b[0m [${new Date().toISOString()}]  ${message} ${payload == null ? "" : JSON.stringify(payload, null, 2)}`)
};

module.exports = {
    info: (message, payload) => log("\x1b[32mINFO", message, payload),
    warn: (message, payload) => log("\x1b[33mWARN", message, payload),
    error: (message, payload) => log("\x1b[31mERROR", message, payload),
    request_error: (message, response) => log("\x1b[31mERROR", message, JSON.parse(response.body))
};