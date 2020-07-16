#!/usr/bin/env node
const Net = require('net');
const zlib = require('zlib');
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

const proxy = new Net.Server();

const method = 'aes-128-cbc';
const ivLength = 16;
const iv = crypto.randomBytes(ivLength);

const obfuscate = (data) => {
    const cipher = crypto.createCipheriv(method, Buffer.from(argv.key), iv);
    const obfuscated =  Buffer.concat([cipher.update(data), cipher.final()]);

    const length = Buffer.allocUnsafe(2);
    length.writeUInt16BE(obfuscated.byteLength);

    return Buffer.concat([length, iv, obfuscated]);
};

const clear = (data) => {
    const length = data.readUInt16BE();

    const obfuscatedStart = 2 + ivLength;
    const obfuscatedEnd = obfuscatedStart + length;

    const iv = data.subarray(2, obfuscatedStart);
    const obfuscated = data.subarray(obfuscatedStart, obfuscatedEnd);

    const decipher = crypto.createDecipheriv(method, Buffer.from(argv.key), iv);
    const cleared = Buffer.concat([decipher.update(obfuscated), decipher.final()]);

    const left = data.subarray(obfuscatedEnd);
    if (left.byteLength > 0) {
        return Buffer.concat([cleared, clear(left)]);
    }

    return cleared;
};

proxy.listen(argv.xPort, argv.xHost, () => {
    console.log(`X Proxy listening ...`);
});

proxy.on('connection', (client) => {
    const server = new Net.Socket();

    server.on('data', function (chunk) {
        if (argv.serverSide) {
            client.write(obfuscate(chunk));

            return;
        }

        client.write(clear(chunk));
    });

    server.on('error', (err) => {
        console.log(`Server error: ${err}`);
    });

    server.connect({ host: argv.serverHost, port: argv.serverPort }, () => {
        console.log('Server connected');
    });

    client.on('data', (chunk) => {
        if (argv.serverSide) {
            server.write(clear(chunk));

            return;
        }

        server.write(obfuscate(chunk));
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
