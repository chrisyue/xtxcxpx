const obfuscator = require('./obfuscator.js');
const chunk = require('./chunk.js');

module.exports = (to, shouldObfuscate, key) => {
    if (shouldObfuscate) {
        return message => {
            const obfuscated = obfuscator.obfuscate(message, key);
            const joined = chunk.join([obfuscated]);

            to.write(joined);
        };
    }

    return message => {
        chunk.split(message).forEach(element => {
            const cleared = obfuscator.recover(element, key);
            to.write(cleared);
        });
    };
};
