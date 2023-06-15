# Development

Using Docker

```sh
docker run -itd --rm --name roshan -v "$(pwd):/home/node/app" -v "$(pwd)/../aghanim:/home/node/aghanim" -u node node:10.16.3-stretch-slim
```