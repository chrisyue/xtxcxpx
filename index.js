#!/usr/bin/env node
const Net = require('net');
const zlib = require('zlib');

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
    .alias('c', 'xCount')
    .argv;

const proxy = new Net.Server();

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

        let handle = argv.serverSide ? zlib.deflate : zlib.inflate;
        handle(chunk, (err, origin) => {
            client.write(origin);
        });
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

        let handle = argv.serverSide ? zlib.inflate : zlib.deflate;
        handle(chunk, (err, zipped) => {
            server.write(zipped);
        });
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
