const join = data => {
    let result = Buffer.alloc(0);
    data.forEach(element => {
        const length = Buffer.allocUnsafe(4);
        length.writeUInt32BE(element.byteLength);

        result = Buffer.concat([result, length, element]);
    });

    return result;
};

const split = data => {
    let result = [];

    const length = data.readUInt32BE();
    result.push(data.subarray(4, 4 + length));

    const left = data.subarray(4 + length);
    if (left.byteLength > 0) {
        console.log('has left');
        result = result.concat(split(left));
    }

    return result;
};

module.exports = { join, split };
