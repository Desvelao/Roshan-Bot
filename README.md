# Development

Using Docker

```sh
docker run -itd --rm --name roshan -v "$(pwd):/home/node/app" -v "$(pwd)/../aghanim:/home/node/aghanim" -w "/home/node/app" -u node node:10.16.3-stretch-slim
```

Link aghanim package

```sh
docker exec -it -u root roshan bash -c 'cd /home/node/aghanim && yarn link && cd ../app && yarn link aghanim'
docker exec -it roshan bash -c 'yarn dev'
```

docker run -itd --rm --name roshan --label 'logging=promtail' -v "$(pwd):/home/node/app" -v "$(pwd)/../aghanim:/home/node/aghanim" -w '/home/node/app' -u node node:10.16.3-stretch-slim sh -c 'cd /home/node/aghanim && yarn link && cd ../app && yarn link aghanim && yarn dev'
