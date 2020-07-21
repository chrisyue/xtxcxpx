const join = data => {
    let result = Buffer.alloc(0);
    data.forEach(element => {
        const length = Buffer.allocUnsafe(4);
        length.writeUInt32BE(element.byteLength);

        result = Buffer.concat([result, length, element]);
    });

    return result;
};

const split = (data, handleLeft) => {
    if (5 > data.byteLength) {
        handleLeft(data);

        return [];
    }

    const length = data.readUInt32BE();
    const end = 4 + length;
    if (end > data.byteLength) {
        handleLeft(data);

        return [];
    }

    let result = [];
    result.push(data.subarray(4, end));

    handleLeft(Buffer.alloc(0));

    const left = data.subarray(end);
    if (left.byteLength > 0) {
        result = result.concat(split(left, handleLeft));
    }

    return result;
};

module.exports = { join, split };
