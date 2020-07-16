#!/usr/bin/env node
const Net = require('net');
const crypto = require('crypto');

const argv = require('yargs')
    .default({
        'H': 'localhost',
        'h': 'localhost',
    })
    .demandOption(['P', 'p', 'k'])
    .boolean(['s'])
    .alias('H', 'xHost')
    .alias('h', 'serverHost')
    .alias('P', 'xPort')
    .alias('p', 'serverPort')
    .alias('s', 'serverSide')
    .alias('k', 'key')
    .argv;

const pipe = require('./pipe.js');

const proxy = new Net.Server();

proxy.listen(argv.xPort, argv.xHost, () => {
    console.log(`X Proxy listening ...`);
});

proxy.on('connection', (client) => {
    const server = new Net.Socket();

    server.on('data', pipe(client, argv.serverSide, argv.key));

    server.on('error', (err) => {
        console.log(`Server error: ${err}`);
    });

    server.connect({ host: argv.serverHost, port: argv.serverPort }, () => {
        console.log('Server connected');
    });

    client.on('data', pipe(server, !argv.serverSide, argv.key));

    client.on('end', () => {
        server.end();
        delete server;
    });

    client.on('error', (err) => {
        server.end();
        delete server;
    });
});
