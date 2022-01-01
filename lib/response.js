const contentTypeJson = { 'Content-Type': 'application/json' };
const contentTypeText = { 'Content-Type': 'text/plain' };
const characterSet = 'utf8';

const Response = res => {
    const send = (data, status) => {
        const isObject = typeof data === 'object';
        res.writeHead(status || res.statusCode, isObject ? contentTypeJson : contentTypeText);
        res.end(data, characterSet);
    };
    return { ...res, send };
};

module.exports = { Response };
