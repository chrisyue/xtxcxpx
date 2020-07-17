const crypto = require('crypto');

const method = 'aes-128-cbc';
const ivLength = 16;

const obfuscate = (data, key) => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(method, Buffer.from(key), iv);

    return  Buffer.concat([iv, cipher.update(data), cipher.final()]);
};

const recover = (data, key, callback) => {
    const iv = data.subarray(0, ivLength);
    const decipher = crypto.createDecipheriv(method, Buffer.from(key), iv);

    const obfuscated = data.subarray(ivLength);

    try {
        return Buffer.concat([decipher.update(obfuscated), decipher.final()]);
    } catch (e) {
        callback(e);
    }
};

module.exports = { obfuscate, recover };
