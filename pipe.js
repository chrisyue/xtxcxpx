const xator = require('./xator.js');
const chunk = require('./chunk.js');

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = (to, shouldXate, xKey, isServerSide) => {
    if (shouldXate) {
        return async message => {
            message = xator.xate(message, xKey, isServerSide);
            message = chunk.join([message]);
            to.write(message);

            await sleep(Math.random() * 100 + 80);
        };
    }

    return message => {
        chunk.split(message).forEach(segment => {
            segment = xator.recover(segment, xKey, isServerSide);
            to.write(segment);
        });
    };
};
