[![Build Status](https://travis-ci.org/telemark/minelev-web.svg?branch=master)](https://travis-ci.org/telemark/minelev-web)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/telemark/minelev-web.svg)](https://greenkeeper.io/)

# minelev-web

web frontend for minelev

## Docker

For test legg til disse DNS-pekerne i hosts-filen:

```
127.0.0.1      minelev.no
127.0.0.1      auth.minelev.no
127.0.0.1      buddy.minelev.no
127.0.0.1      logs.minelev.no
127.0.0.1      buddy-api.minelev.no
127.0.0.1      mongodb.minelev.no
127.0.0.1      pdf.minelev.no
```

Se [examples](examples)

Gjør evt nødvendige endringer i env-filene

```bash
$ docker-compose up -d
```

Åpne http://minelev.no i nettleseren

Logg inn med brukernavn: gauss passord: password

# Flow

![MinElev flyt](http://bildr.no/image/Nks0MHNs.jpeg)

# Example DNS-pointers

![MinElev DNS](http://bildr.no/image/QURTR3lz.jpeg)

## License

[MIT](LICENSE)

![Robohash image of minelev-web](https://robots.kebabstudios.party/minelev-buddy.png "Robohash image of minelev-web")
