'use strict'

module.exports = {
  WEB_SERVER_PORT: process.env.WEB_SERVER_PORT || 8000,
  ORIGIN_URL: process.env.ORIGIN_URL || 'http://localhost:8000/signin',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  ENCRYPTOR_SECRET: process.env.ENCRYPTOR_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  YAR_SECRET: process.env.YAR_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'https://auth.demo.t-fk.win/login',
  BUDDY_SERVICE_URL: process.env.BUDDY_SERVICE_URL || 'https://buddy.demo.minelev.t-fk.win',
  LOGS_SERVICE_URL: process.env.LOGS_SERVICE_URL || 'https://logs.demo.minelev.t-fk.win',
  PDF_SERVICE_URL: process.env.PDF_SERVICE_URL || 'https://pdf.minelev.t-fk.win',
  QUEUE_SERVICE_URL: process.env.QUEUE_SERVICE_URL || 'https://logs.demo.minelev.t-fk.win/logs'
}
