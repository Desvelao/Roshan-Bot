# Development

Using Docker

```sh
docker run -itd --rm --name roshan -v "$(pwd):/home/node/app" -v "$(pwd)/../aghanim:/home/node/aghanim" -u node node:10.16.3-stretch-slim
```

Link aghanim package

```sh
docker run -it -u root roshan sh
cd /home/node/aghanim
yarn link
cd ../app
yarn link aghanim
```
