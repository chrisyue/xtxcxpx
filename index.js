#!/usr/bin/env node
const Net = require('net');
const zlib = require('zlib');
const crypto = require('crypto');

const argv = require('yargs')
    .default({
        'H': 'localhost',
        'h': 'localhost',
        'c': 2,
    })
    .demandOption(['P', 'p'])
    .boolean(['s'])
    .alias('H', 'xHost')
    .alias('h', 'serverHost')
    .alias('P', 'xPort')
    .alias('p', 'serverPort')
    .alias('s', 'serverSide')
    .alias('k', 'key')
    .alias('c', 'xCount')
    .argv;

const proxy = new Net.Server();

const obfuscate = (data) => {
    const cipher = crypto.createCipher('aes-128-cbc', argv.key);

    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

const clear = (data) => {
    const cipher = crypto.createDecipher('aes-128-cbc', argv.key);

    return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
}

proxy.listen(argv.xPort, argv.xHost, () => {
    console.log(`X Proxy listening ...`);
});

proxy.on('connection', (client) => {
    const server = new Net.Socket();

    let count = 0;
    server.on('data', function (chunk) {
        if (count > argv.xCount) {
            client.write(chunk);

            return;
        }

        let handle = argv.serverSide ? obfuscate : clear;
        client.write(handle(chunk));

        ++count;
    });

    server.on('error', (err) => {
        console.log(`Server error: ${err}`);
    });

    server.connect({ host: argv.serverHost, port: argv.serverPort }, () => {
        console.log('Server connected');
    });

    let count2 = 0;
    client.on('data', (chunk) => {
        if (count2 > argv.xCount) {
            server.write(chunk);

            return;
        }

        let handle = argv.serverSide ? clear : obfuscate;
        server.write(handle(chunk));

        ++count2;
    });

    client.on('end', () => {
        server.end();
        delete server;
    });

    client.on('error', (err) => {
        server.end();
        delete server;
    });
});
