# xtxcxpx

不可描述的用途

X a TCP service.

# Usage

For example, on the server-side:

```
node index.js --xHost=chrisyue.com \
    --xPort=3333 --serverHost=localhost \
    --serverPort=22 \
    --key=xxx...(16 characters) \
    --serverSide
    --xCount = 3
```

on the client-side, keep the `serverHost`/`serverPort`/`key`/`xCount` the same as server's `xHost`/`xPort`/`key`/`xCount`

```
node index.js --xHost=localhost \
    --xPort=4444 \
    --serverHost=chrisyue.com \
    --serverPort=3333 \
    --key=xxx...
    --xCount = 3
```
