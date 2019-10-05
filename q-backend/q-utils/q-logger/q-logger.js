const log = (status, message, payload) => {
    const formattedPayload = () => {
        if (payload != null) {
            if (payload.body != null) {
                return JSON.parse(payload.body);
            } else {
                return JSON.stringify(payload, null, 2)
            }
        } else {
            return "";
        }
    };
    console.log(`${status} \x1b[0m [${new Date().toISOString()}]  ${message} ${formattedPayload()}`)
};

module.exports = {
    info: (message, payload) => log("\x1b[32mINFO", message, payload), // yellow
    warn: (message, payload) => log("\x1b[33mWARN", message, payload), // orange
    error: (message, payload) => log("\x1b[31mERROR", message, payload), // red
    debug: (message, payload) => log("\x1b[36mDEBUG", message, payload), // cyan
};