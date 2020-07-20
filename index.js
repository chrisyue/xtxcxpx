#!/usr/bin/env node
const Net = require('net');
const crypto = require('crypto');

const argv = require('yargs')
    .default({
        'H': 'localhost',
        'h': 'localhost',
        'b': 300,
    })
    .demandOption(['P', 'p', 'K'])
    .boolean(['s'])
    .alias('H', 'xHost')
    .alias('P', 'xPort')
    .alias('K', 'xKey')
    .alias('h', 'serverHost')
    .alias('p', 'serverPort')
    .alias('s', 'serverSide')
    .alias('b', 'bufferDuration')
    .argv;

const pipe = require('./pipe.js');

const proxy = new Net.Server();

proxy.listen(argv.xPort, argv.xHost, () => {
    console.log(`X Proxy listening ...`);
});

proxy.on('connection', client => {
    const server = new Net.Socket();

    server.on('data', pipe(client, argv.serverSide, argv.xKey, argv.serverSide, argv.bufferDuration));

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

    client.on('data', pipe(server, !argv.serverSide, argv.xKey, argv.serverSide, argv.bufferDuration));

    client.on('end', () => {
        console.log('Client disconnected.');
        server.end();
    });

    client.on('error', err => {
        console.log(`Client error: ${err}.`);
    });
});
