'use strict';

const http = require('http');
const nodeUrl = require('url');
const debug = require('debug')('watersupply:server');
const { Response } = require('./response');

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
            console.error(err);
            res = Response(res);
            res.send('', 400);
            return;
        });

        res.on('error', err => {
            console.error(err);
            res = Response(res);
            res.send('', 500);
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

const getMethodHandler = (req, res) => {
    const { baseUrl, params } = parseUrl(req);
    const isExistRoute = getRoutes.has(baseUrl);
    if (isExistRoute) {
        const fn = getRoutes.get(baseUrl);
        fn.call(this, { ...req, params }, res);
    } else {
        res.send('404', 404);
    }
};

const postMethodHandler = (req, res, body) => {
    try {
        let { baseUrl, params } = parseUrl(req);
        params = body;

        const isExistRoute = postRoutes.has(baseUrl);
        if (isExistRoute) {
            const fn = postRoutes.get(baseUrl);
            fn.call(this, { ...req, params }, res);
        } else {
            res.send('404', 404);
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
