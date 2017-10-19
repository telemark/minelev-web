'use strict'

const axios = require('axios')
const cheerio = require('cheerio')
const baseUrl = 'https://data.udir.no'

module.exports = async url => {
  console.log(`retreiving lareplan form ${url}`)
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  const title = $('h1').text().trim()
  const article = $('.article-content')
  const link = $(article).find('a')['0']
  return {
    name: title,
    url: link !== undefined ? `${baseUrl}${link.attribs.href}` : false
  }
}
