const join = data => {
    let result = Buffer.alloc(0);
    data.forEach(element => {
        const length = Buffer.allocUnsafe(4);
        length.writeUInt32BE(element.byteLength);

        result = Buffer.concat([result, length, element]);
    });

    return result;
};

let fragment = Buffer.alloc(0);
const split = data => {
    data = Buffer.concat([fragment, data]);
    if (5 > data.byteLength) {
        fragment = data;

        return [];
    }

    const length = data.readUInt32BE();
    const end = 4 + length;
    if (end > data.byteLength) {
        fragment = data;

        return [];
    }

    let result = [];
    result.push(data.subarray(4, end));

    fragment = Buffer.alloc(0);

    const left = data.subarray(end);
    if (left.byteLength > 0) {
        result = result.concat(split(left));
    }

    return result;
};

module.exports = { join, split };
