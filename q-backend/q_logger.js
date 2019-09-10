const log = (type, message) => {
    console.log(`${type}\t[${new Date()}]\t${message}`)
};

export const info = (message) => log("INFO", message);
export const warn = (message) => log("WARN", message);
export const error = (message) => log("ERROR", message);