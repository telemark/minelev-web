[![Build Status](https://travis-ci.org/telemark/minelev-web.svg?branch=master)](https://travis-ci.org/telemark/minelev-web)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/telemark/minelev-web.svg)](https://greenkeeper.io/)

# minelev-web

web frontend for minelev

See [examples](examples)

## Docker

### 1. with-nginx-proxy

See [this example](examples/with-nginx-proxy)

You need to set DNS pointers to use this example:

```
127.0.0.1      minelev.no
127.0.0.1      auth.minelev.no
127.0.0.1      buddy.minelev.no
127.0.0.1      logs.minelev.no
127.0.0.1      buddy-api.minelev.no
127.0.0.1      mongodb.minelev.no
127.0.0.1      pdf.minelev.no
```

Do changes in the env-files

```bash
$ docker-compose up -d
```

Open http://minelev.no in the browser

Login with username: `gauss` password: `password`

### 2. with-links

See [this example](examples/with-links)

```bash
$ docker-compose up -d
```

Open http://localhost in the browser

Login with username: `gauss` password: `password`

# Flow

![MinElev flyt](http://bildr.no/image/Nks0MHNs.jpeg)

# Example DNS-pointers

![MinElev DNS](http://bildr.no/image/QURTR3lz.jpeg)

## License

[MIT](LICENSE)

![Robohash image of minelev-web](https://robots.kebabstudios.party/minelev-buddy.png "Robohash image of minelev-web")
