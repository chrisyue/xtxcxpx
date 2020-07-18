const xator = require('./xator.js');
const chunk = require('./chunk.js');

module.exports = (to, shouldXate, xKey, xCount, isServerSide) => {
    if (shouldXate) {
        return message => {
            if (xCount > 0) {
                message = xator.xate(message, xKey, isServerSide);
                --xCount;
            }

            message = chunk.join([message]);
            to.write(message);
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
