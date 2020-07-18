#!/usr/bin/env node
const Net = require('net');
const crypto = require('crypto');

const argv = require('yargs')
    .default({
        'H': 'localhost',
        'h': 'localhost',
        'C': 3,
    })
    .demandOption(['P', 'p', 'K'])
    .boolean(['s'])
    .alias('H', 'xHost')
    .alias('P', 'xPort')
    .alias('K', 'xKey')
    .alias('C', 'xCount')
    .alias('h', 'serverHost')
    .alias('p', 'serverPort')
    .alias('s', 'serverSide')
    .argv;

const pipe = require('./pipe.js');

const proxy = new Net.Server();

proxy.listen(argv.xPort, argv.xHost, () => {
    console.log(`X Proxy listening ...`);
});

proxy.on('connection', client => {
    const server = new Net.Socket();

    server.on('data', pipe(client, argv.serverSide, argv.xKey, argv.xCount, argv.serverSide));

    server.on('error', err => {
        console.log(`Server error: ${err}`);
    });

    server.on('end', () => {
        console.log('Server disconnected.');
        client.end();
    });

    server.connect(argv.serverPort, argv.serverHost, () => {
        console.log('Server connected.');
    });

    client.on('data', pipe(server, !argv.serverSide, argv.xKey, argv.xCount, argv.serverSide));

    client.on('end', () => {
        console.log('Client disconnected.');
        server.end();
    });

    client.on('error', err => {
        console.log(`Client error: ${err}.`);
    });
});
