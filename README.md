[![Build Status](https://travis-ci.org/telemark/minelev-web.svg?branch=master)](https://travis-ci.org/telemark/minelev-web)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/telemark/minelev-web.svg)](https://greenkeeper.io/)

# minelev-web

web frontend for minelev

See [examples](docs/examples)

## Settings

production.env

```bash
NODE_ENV=production #Node environment
WEB_SERVER_PORT=8000 #Port for web server
ORIGIN_URL=https://www.minelev.no/signin #url for instance
COOKIE_SECRET=@minelev-cookie-secret #secret for cookie
ENCRYPTOR_SECRET=@minelev-encryptor-secret #secret for data encryption
JWT_SECRET=@minelev-jwt-secret #Secret for jwt
YAR_SECRET=@minelev-session-secret #Secret for local session
AUTH_SERVICE_URL=@tfk-auth-service-feide #Url for auth service
BUDDY_SERVICE_URL=@minelev-buddy-service-url #Url for buddy service (https://github.com/telemark/minelev-buddy)
LOGS_SERVICE_URL=@minelev-logs-service-url #Url for logs service (https://github.com/telemark/minelev-logs)
STATS_SERVICE_URL=@minelev-logs-service-url #Url for stats service (https://github.com/telemark/minelev-logs-stats)
PDF_SERVICE_URL=https://pdf.minelev.no #Url for pdf service (https://github.com/telemark/pdftemplater-webservice-docker)
QUEUE_SERVICE_URL=@minelev-queue-service-url #Url for queue service (https://github.com/telemark/minelev-logs)
#FEATURE_USE_YFF=on #Enable yff
#FEATURE_USE_PICTURES=on #Enable pictures. Requires pictureservice
#YFF_SERVICE_URL=https://yff.service.minelev.no #Url for yff-service (if enabled) (https://github.com/telemark/micro-yff-programomrader)
#PICTURES_SERVICE_URL=https://micro-user-photo-wslyfbstcy.now.sh #Url for picture-service (if enabled) (https://github.com/telemark/micro-user-photo)
PAPERTRAIL_HOSTNAME=minelev #Hostname for papertrail
PAPERTRAIL_HOST=@tfk-papertrail-host #Url for papertrail
PAPERTRAIL_PORT=@tfk-papertrail-port #Port for papertrail
```

## Docker

Be sure to get the time on the server right!

`ntpdate no.pool.ntp.org`

### 1. with-docker-datacenter

See [this example](docs/examples/with-docker-datacenter)

Set DNS for the minelev_micro_auth_ldap and the minelev_webserver services.
These are the only services that needs to be exposed to the internet.

### 2. with-nginx-proxy

See [this example](docs/examples/with-nginx-proxy)

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

### 3. with-links (ready to go, if you just want to try)

See [this example](docs/examples/with-links)

```bash
$ docker-compose up -d
```

Open http://localhost in the browser

Login with username: `gauss` password: `password`

# Flow

![MinElev flyt](http://bildr.no/image/Nks0MHNs.jpeg)

# Example DNS-pointers

![MinElev DNS](http://bildr.no/image/QURTR3lz.jpeg)

## Related

- [minelev-buddy](https://github.com/telemark/minelev-buddy) buddy service for MinElev
- [minelev-logs](https://github.com/telemark/minelev-logs) logs service for MinElev
- [minelev-logs-stats](https://github.com/telemark/minelev-logs-stats) statistics service for MinElev logs
- [minelev-notifications](https://github.com/telemark/minelev-notifications) notifications service for MinElev
- [minelev-leder](https://github.com/telemark/minelev-leder) web frontend for MinElev - school administration
- [minelev-dashboard](https://github.com/telemark/minelev-dashboard) dashboard for MinElev
- [micro-yff-programomrader](https://github.com/telemark/micro-yff-programomrader) yff services
- [pdf-service](https://github.com/telemark/pdftemplater-webservice-docker) convert templates and data to pdf

## License

[MIT](LICENSE)

![Robohash image of minelev-web](https://robots.kebabstudios.party/minelev-web.png "Robohash image of minelev-web")
