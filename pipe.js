const xator = require('./xator.js');
const chunk = require('./chunk.js');

let sleep = ms => new Promise(resolve => setTimout(resolve, ms));

module.exports = (to, shouldXate, xKey, xCount, isServerSide) => {
    if (shouldXate) {
        return async message => {
            if (xCount > 0) {
                message = xator.xate(message, xKey, isServerSide);
                --xCount;
            }

            message = chunk.join([message]);
            to.write(message);

            await sleep(100);
        };
    }

    return message => {
        chunk.split(message).forEach(segment => {
            if (xCount > 0) {
                segment = xator.recover(segment, xKey, isServerSide);
                --xCount;
            }

            to.write(segment);
        });
    };
};
