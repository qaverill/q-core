
function log(type, message) {
    console.log(`${type} [${new Date().toDateString()}] ...${module.parent.filename}...  ${message}`)
};

module.exports = {
    info: message => log("INFO ", message),
    warn: message => log("WARN ", message),
    error: message => log("ERROR", message),
};