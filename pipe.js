const obfuscator = require('./obfuscator.js');
const chunk = require('./chunk.js');

module.exports = (to, shouldObfuscate, key) => {
    let i = 0;
    if (shouldObfuscate) {
        return message => {
            if (i > 3) {

                console.log(`to remote: ${message}`);

                to.write(message);

                return;
            }

            const obfuscated = obfuscator.obfuscate(message, key);
            const joined = chunk.join([obfuscated]);

            console.log(`to remote: ${joined}`);

            to.write(joined);
            ++i;
        };
    }

    return message => {
        chunk.split(message).forEach(element => {

            console.log(`from remote: ${element}`);

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
