const obfuscator = require('./obfuscator.js');
const chunk = require('./chunk.js');

module.exports = (to, shouldObfuscate, key) => {
    let i = 0;
    if (shouldObfuscate) {
        return message => {
            if (i > 5) {
                to.write(message);

                return;
            }

            const obfuscated = obfuscator.obfuscate(message, key);
            const joined = chunk.join([obfuscated]);
            to.write(joined);
            ++i;
        };
    }

    let j = 0;
    return message => {
        chunk.split(message).forEach(element => {
            if (j > 5) {
                to.write(message);

                return;
            }

            const cleared = obfuscator.recover(element, key);
            to.write(cleared);
            ++j;
        });
    };
};
