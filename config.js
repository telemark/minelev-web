'use strict'

module.exports = {
  WEB_SERVER_PORT: process.env.WEB_SERVER_PORT || 8000,
  ORIGIN_URL: process.env.ORIGIN_URL || 'https://web.minelev.t-fk.win',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  ENCRYPTOR_SECRET: process.env.ENCRYPTOR_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  YAR_SECRET: process.env.YAR_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'https://api.auth.com',
  BUDDY_SERVICE_URL: process.env.BUDDY_SERVICE_URL || 'https://api.buddy.com',
  LOGS_SERVICE_URL: process.env.LOGS_SERVICE_URL || 'https://api.logs.com',
  PDF_SERVICE_URL: process.env.PDF_SERVICE_URL || 'https://pdftemplater-webservice-docker-jpwnkqxujr.now.sh',
  QUEUE_SERVICE_URL: process.env.QUEUE_SERVICE_URL || 'https://api.queue.com'
}
