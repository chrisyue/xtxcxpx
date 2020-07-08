# xtxcxpx

不可描述的用途

X a TCP service.

# Usage

For example, on the server side:

```
node index.js --xHost=chrisyue.com --xPort=3333 --serverHost=localhost --serverPort=22 --xCount=3 --serverSide
```

on the client side, keep the `serverHost`/`serverPort`/`xCount` the same as server's `xHost`/`xPort`/`xCount`

```
node index.js --xHost=localhost --xPort=4444 --serverHost=chrisyue.com --serverPort= 3333 --xCount=3`
```
