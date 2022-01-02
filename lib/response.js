'use strict';
const fs = require('fs');

const contentTypeJson = { 'Content-Type': 'application/json' };
const contentTypeText = { 'Content-Type': 'text/plain' };
const contentTypeHtml = { 'Content-Type': 'text/html' };
const characterSet = 'utf8';
const publicPath = './public';

const Response = res => {
    const send = (data, status) => {
        const isObject = typeof data === 'object';
        res.writeHead(status || res.statusCode, isObject ? contentTypeJson : contentTypeText);
        res.end(data, characterSet);
    };

    const sendByContentType = (data, status, contentType) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.writeHead(status || res.statusCode, contentType);
        res.end(data, characterSet);
    };

    const render = function (fileName) {
        const self = this;
        const filePath = `${publicPath}/${fileName}.html`;
        fs.readFile(filePath, function (error, content) {
            if (error) {
                if (error.code == 'ENOENT') {
                    self.sendByContentType(content, 404, contentTypeHtml);
                } else {
                    self.sendByContentType('', 500, contentTypeHtml);
                }
            } else {
                self.sendByContentType(content, 200, contentTypeHtml);
            }
        });
    };

    return { ...res, send, sendByContentType, render };
};

module.exports = { Response };
