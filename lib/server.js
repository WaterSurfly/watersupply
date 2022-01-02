'use strict';

const http = require('http');
const nodeUrl = require('url');
const debug = require('debug')('watersupply:server');
const { Response } = require('./response');
const fs = require('fs');
const path = require('path');

const defaultPort = 3000;
const getRoutes = new Map();
const postRoutes = new Map();

const onError = err => {
    console.error(err);
};
const onClose = () => debug(`server close.`);
const onConnection = () => debug(`client connect!`);
const onRequest = (req, res) => {
    try {
        debug('request');

        req.on('error', err => {
            console.error('request error', err.stack);
            debug('request error', err.stack);
            return;
        });

        res.on('error', err => {
            console.error('response error', err.stack);
            debug('response error', err.stack);
            return;
        });

        res = Response(res);
        methodHandler(req, res);
        debug('success!!');
    } catch (error) {
        debug(`#msg=onRequest catch error!!! : ${error.stack}`);
        res.send(error.message, 404);
    }
};

const methodHandler = (req, res) => {
    switch (req.method) {
        case 'GET':
            getMethodHandler(req, res);
            break;
        case 'POST':
            getBodyData(req, res, postMethodHandler);
            break;
        default:
            throw new Error(`#msg=not support method : ${req.method}`);
    }
};

const parseUrl = req => {
    const parsedUrl = nodeUrl.parse(req.url, true);
    const baseUrl = parsedUrl.pathname;
    let params = req.method === 'GET' ? Object.assign({}, parsedUrl.query) : {};
    return { baseUrl, params };
};

const resolve = function (baseUrl, ext, res) {
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(`./public${baseUrl}`, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                res.sendByContentType('', 404, contentType);
            } else {
                res.sendByContentType('', 500, contentType);
            }
        } else {
            debug(`load file=./public${baseUrl}`);
            res.sendByContentType(content, 200, contentType);
        }
    });
};

const getMethodHandler = (req, res) => {
    const { baseUrl, params } = parseUrl(req);
    const ext = String(path.extname(baseUrl)).toLowerCase();
    if (!ext) {
        const isExistRoute = getRoutes.has(baseUrl);
        if (isExistRoute) {
            const fn = getRoutes.get(baseUrl);
            fn.call(this, { ...req, params }, res);
        } else {
            res.send('404', 404);
        }
    } else {
        resolve(baseUrl, ext, res);
    }
};

const postMethodHandler = (req, res, body) => {
    try {
        let { baseUrl, params } = parseUrl(req);
        params = body;

        const ext = String(path.extname(baseUrl)).toLowerCase();
        if (!ext) {
            const isExistRoute = postRoutes.has(baseUrl);
            if (isExistRoute) {
                const fn = postRoutes.get(baseUrl);
                fn.call(this, { ...req, params }, res);
            } else {
                res.send('404', 404);
            }
        } else {
            resolve(baseUrl, ext, res);
        }
    } catch (error) {
        res.send(error.message, 500);
    }
};

const getBodyData = (req, res, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        callback(req, res, JSON.parse(body));
    });
};

const get = function (url, fn) {
    getRoutes.set(url, fn);
};

const post = function (url, fn) {
    postRoutes.set(url, fn);
};

const listen = port => {
    port = port || defaultPort;
    server.listen(port, () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log(`#msg=server listening... #host=${host} #port=${port}`);
    });
};

const server = http.createServer();
server.on('error', onError);
server.on('close', onClose);
server.on('connection', onConnection);
server.on('request', onRequest);

module.exports = {
    get,
    post,
    listen,
};
