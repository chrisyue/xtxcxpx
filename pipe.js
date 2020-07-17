const obfuscator = require('./obfuscator.js');
const chunk = require('./chunk.js');
const fs = require('fs');

module.exports = (to, shouldObfuscate, key) => {
    let i = 0;
    if (shouldObfuscate) {
        return message => {
            if (i > 3) {
                fs.writeFile('to.log', message, 'a', () => {});

                to.write(message);

                return;
            }

            const obfuscated = obfuscator.obfuscate(message, key);
            const joined = chunk.join([obfuscated]);

            fs.writeFile('to.log', joined, 'a', () => {});

            to.write(joined);
            ++i;
        };
    }

    return message => {
        chunk.split(message).forEach(element => {

            fs.writeFile('from.log', element, 'a', () => {});

            if (i > 3) {
                to.write(message);

                return;
            }

            const cleared = obfuscator.recover(element, key);
            to.write(cleared);
            ++i;
        });
    };
};
