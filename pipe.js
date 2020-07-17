const obfuscator = require('./obfuscator.js');
const chunk = require('./chunk.js');
const fs = require('fs');

module.exports = (to, shouldObfuscate, key) => {
    if (shouldObfuscate) {
        return message => {
            const obfuscated = obfuscator.obfuscate(message, key);
            const joined = chunk.join([obfuscated]);

            fs.writeFileSync('to.log', joined.toString('hex') + '\n', { flag: 'a' });

            to.write(joined);
        };
    }

    return message => {
        fs.writeFileSync('from.log', message.toString('hex') + '\n', { flag: 'a' });

        chunk.split(message).forEach(element => {
            try {
                const cleared = obfuscator.recover(element, key);
                to.write(cleared);
            } catch (ex) {
                fs.writeFileSync('err.log', message.toString('hex') + '\n', { flag: 'a' });
                fs.writeFileSync('err.log', element.toString('hex') + '\n', { flag: 'a' });

                throw ex;
            }
        });
    };
};
