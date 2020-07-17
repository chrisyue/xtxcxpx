const obfuscator = require('./obfuscator.js');
const chunk = require('./chunk.js');
const fs = require('fs');

module.exports = (to, shouldObfuscate, key) => {
    if (shouldObfuscate) {
        return message => {
            const obfuscated = obfuscator.obfuscate(message, key);
            const joined = chunk.join([obfuscated]);

            fs.writeFile('to.log', joined.toString('hex'), { flag: 'a' }, e => {});

            to.write(joined);
        };
    }

    return message => {
        chunk.split(message).forEach(element => {
            const cleared = obfuscator.recover(element, key, e => {
                fs.writeFile('from.log', message.toString('hex'), { flag: 'a' }, e => {});

                throw e;
            });

            to.write(cleared);
        });
    };
};
