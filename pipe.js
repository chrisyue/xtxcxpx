const obfuscator = require('./obfuscator.js');
const chunk = require('./chunk.js');
const fs = require('fs');

module.exports = (to, shouldObfuscate, key) => {
    if (shouldObfuscate) {
        return message => {
            const obfuscated = obfuscator.obfuscate(message, key);
            const joined = chunk.join([obfuscated]);

            fs.writeFile('to.log', joined.toString('hex') + '\n', { flag: 'a' }, e => {});

            to.write(joined);
        };
    }

    return message => {
        fs.writeFile('from.log', message.toString('hex') + '\n', { flag: 'a' }, e => {});

        chunk.split(message).forEach(element => {
            try {
                const cleared = obfuscator.recover(element, key);
            } catch (e) {
                fs.writeFile('err.log', element.toString('hex') + '\n', { flag: 'a' }, e => {});
                fs.writeFile('err.log', element.toString('hex') + '\n', { flag: 'a' }, e => {});

                throw e;
            }

            to.write(cleared);
        });
    };
};
