'use strict'

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const getLareplan = require('./yff-get-lareplan')
const getKompetansemal = require('./yff-get-kompetansemal')
const baseUrl = 'https://www.udir.no/kl06'
const basePath = 'lib/data/yff'
const omrader = require('../lib/data/yff/utdanningsprogrammer.json')

async function getPage (url) {
  const { data } = await axios.get(url)
  return data
}

async function getData (options) {
  const lareplan = await getLareplan(options.programUrl)
  const kompetansemaal = lareplan.url ? await getKompetansemal(lareplan.url) : false
  console.log(options.programUrl)
  console.log(lareplan)
  return {
    id: options.programId,
    name: lareplan.name,
    programUrl: options.programUrl,
    lareplanUrl: lareplan.url,
    kompetansemaal: kompetansemaal
  }
}

async function parsePage (url) {
  const data = await getPage(url)
  const $ = cheerio.load(data)
  const omrader = $('.fromThirdYear')
  let omradeIds = []

  omrader.each((i, element) => {
    const programId = element.attribs['data-programid']
    const programUrl = `${baseUrl}/${programId}`
    omradeIds.push({programId: programId, programUrl: programUrl})
  })

  const jobs = omradeIds.map(getData)

  const results = await Promise.all(jobs)

  return JSON.stringify(results, null, 2)
}

async function generateOmrade (options) {
  const data = await parsePage(options.url)
  const fileName = `${basePath}/${options.id.toLocaleLowerCase()}.json`
  fs.writeFileSync(fileName, data, 'utf-8')
  console.log(`written ${fileName}`)
}

async function generateOmrader () {
  const jobs = omrader.map(generateOmrade)
  await Promise.all(jobs)
  console.log('finished')
  process.exit(0)
}

generateOmrader()
