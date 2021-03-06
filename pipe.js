const xator = require('./xator.js');
const chunk = require('./chunk.js');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = (to, shouldXate, xKey, isServerSide, bufferDuration) => {
    if (shouldXate) {
        let buffer = Buffer.alloc(0);
        let is1stXate = true;

        setInterval(() => {
            if (buffer.byteLength < 1) {
                return;
            }

            const buffer2 = buffer;
            buffer = Buffer.alloc(0);

            let xated = xator.xate(buffer2, xKey, isServerSide, is1stXate);
            is1stXate = false;
            xated = chunk.join([xated]);

            to.write(xated);
        }, bufferDuration);

        return message => {
            buffer = Buffer.concat([buffer, message]);
        };
    }

    let left = Buffer.alloc(0);
    let is1stRecover = true;

    return message => {
        message = Buffer.concat([left, message]);

        chunk.split(message, remain => left = remain).forEach(segment => {
            segment = xator.recover(segment, xKey, isServerSide, is1stRecover);
            is1stRecover = false;

            to.write(segment);
        });
    };
};
