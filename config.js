'use strict'

module.exports = {
  WEB_SERVER_PORT: process.env.WEB_SERVER_PORT || 8000,
  ORIGIN_URL: process.env.ORIGIN_URL || 'http://localhost:8000/signin',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  ENCRYPTOR_SECRET: process.env.ENCRYPTOR_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  YAR_SECRET: process.env.YAR_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'https://feide-mock.service.t-fk.no',
  BUDDY_SERVICE_URL: process.env.BUDDY_SERVICE_URL || 'https://buddy.minelev.win',
  LOGS_SERVICE_URL: process.env.LOGS_SERVICE_URL || 'https://logs.minelev.win',
  PDF_SERVICE_URL: process.env.PDF_SERVICE_URL || 'https://pdf.minelev.win',
  QUEUE_SERVICE_URL: process.env.QUEUE_SERVICE_URL || 'https://logs.minelev.win/logs',
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || 'minelev-dev',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || 12345
}
