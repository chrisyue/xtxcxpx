const crypto = require('crypto');

const method = 'aes-128-cbc';
const ivLength = 16;

const requestHeader = 'GET /chat HTTP/1.1\r\nHost: my.chat.room\r\nUpgrade: websocket\r\n\r\n';
const responseHeader = 'HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\n\r\n';

let is1stXate = true;
const xate = (data, key, isServerSide) => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(method, Buffer.from(key), iv);

    let header = Buffer.alloc(0);
    if (is1stXate) {
        header = Buffer.from(isServerSide ? responseHeader : requestHeader);
        is1stXate = false;
    }

    return Buffer.concat([header, iv, cipher.update(data), cipher.final()]);
};

let is1stRecover = true;
const recover = (data, key, isServerSide) => {
    if (is1stRecover) {
        const header = isServerSide ? requestHeader : responseHeader;
        data = data.subarray(header.length);
        is1stRecover = false;
    }

    const iv = data.subarray(0, ivLength);
    const decipher = crypto.createDecipheriv(method, Buffer.from(key), iv);

    const xated = data.subarray(ivLength);

    return Buffer.concat([decipher.update(xated), decipher.final()]);
};

module.exports = { xate, recover };
