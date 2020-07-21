# xtxcxpx

不可描述的用途

X a TCP service. X can mean obfuscate, hide, cover, disguise, etc.

```
 +--------+   +                +
 |        |   |                |
 | server |   |                |
 |        |   |                |
 +-^---+--+   |                |
   |   |      |                |
Hello world   |                |
   |   |      |                |
+--+---v--+   |                |   +---------+
|         +-------!@#$%^&*&*------>+         |
| xtxcxpx |   |                |   | xtxcxpx |
|         +<------+_)(*&^%$#-------+         |
+---------+   |                |   +--+---^--+
              |                |      |   |
              |                |   Hello world
              |                |      |   |
              |                |   +--v---+-+
              |                |   |        |
              |                |   | client |
              |                |   |        |
              +                +   +--------+
```

# Usage

For example, on the server-side:

```
node index.js --xHost=chrisyue.com \
    --xPort=3333 --serverHost=localhost \
    --serverPort=22 \
    --key=xxx...(16 characters) \
    --serverSide
    --bufferDuration 200
```

on the client-side, keep the `serverHost`/`serverPort`/`key` the same as server's `xHost`/`xPort`/`key`

```
node index.js --xHost=localhost \
    --xPort=4444 \
    --serverHost=chrisyue.com \
    --serverPort=3333 \
    --key=xxx...
    --bufferDuration 100
```

Run `node index.js --help` for more.
