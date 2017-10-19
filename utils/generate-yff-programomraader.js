'use strict'

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const baseUrl = 'https://www.udir.no/kl06'
const basePath = 'lib/data/yff'
const omrader = require('../lib/data/yff/utdanningsprogrammer.json')

async function getPage (url) {
  const { data } = await axios.get(url)
  return data
}

async function parsePage (url) {
  const data = await getPage(url)
  const $ = cheerio.load(data)
  const omrader = $('.fromThirdYear')
  let results = []

  omrader.each((i, element) => {
    const links = $(element).find('a.desktop')
    const txt = $($(links).find('span')['0']).text().trim()
    const programId = element.attribs['data-programid']
    results.push({
      id: programId,
      name: txt,
      url: `${baseUrl}/${programId}`
    })
  })

  return JSON.stringify(results, null, 2)
}

omrader.forEach(async omrade => {
  const data = await parsePage(omrade.url)
  const fileName = `${basePath}/${omrade.id.toLocaleLowerCase()}.json`
  fs.writeFileSync(fileName, data, 'utf-8')
  console.log(`written ${fileName}`)
})
