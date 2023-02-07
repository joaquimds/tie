const path = require("path")
const puppeteer = require("puppeteer")
const { call } = require("./twilio")

const sleep = (secs) => new Promise((res, rej) => {
  setTimeout(() => res(), secs * 1000)
})

const doAttempt = async () => {
  console.log("launching")
  const browser = await puppeteer.launch({ headless: false, timeout: 60000 });
  let page
  try {
    page = await browser.newPage();
    page.setDefaultTimeout(60000)

    await page.goto('https://icp.administracionelectronica.gob.es/icpplustiem/index');
    await page.setViewport({width: 1080, height: 1024});
    console.log("loaded")

    await page.waitForSelector('#form');
    await sleep(1)
    await page.select("#form", "/icpplustiem/citar?p=28&locale=es");
    await sleep(1)
    await page.click("#btnAceptar")
    console.log("selected madrid")
    await sleep(1)

    await page.waitForSelector('#tramiteGrupo\\[1\\]')
    await sleep(1)
    await page.select("#tramiteGrupo\\[1\\]", "4010")
    await sleep(1)
    await page.waitForSelector("#btnAceptar")
    await sleep(1)
    await page.click("#btnAceptar")
    console.log("selected fingerprints")
    await sleep(1)

    await page.waitForSelector("#btnEntrar")
    await sleep(1)
    await page.click('#btnEntrar')
    console.log("entering form")
    await sleep(1)


    await page.waitForSelector("#txtIdCitado")
    await sleep(1)
    await page.type("#txtIdCitado", "Y9570390N")
    await sleep(1)
    await page.waitForSelector("#txtDesCitado")
    await sleep(1)
    await page.type("#txtDesCitado", "Joaquim de Souza")
    await sleep(1)
    await page.waitForSelector("#txtPaisNac")
    await sleep(1)
    await page.select("#txtPaisNac", "112")
    await sleep(1)
    await page.click("#btnEnviar")
    console.log("entering citas management")
    await sleep(1)

    await page.waitForSelector("#btnEnviar")
    await sleep(1)
    await page.click('#btnEnviar')
    console.log("entering citas select")
    await sleep(1)

    try {
      const element = await page.waitForSelector(".mf-msg__info", { timeout: 15000 })
      await sleep(1)
      const text = await element.evaluate(el => el.textContent)
      if (!text.includes("no hay citas disponibles")) {
        throw new Error("'no hay citas' mensaje no existe")
      }
      console.log("no hay citas")
    } catch (e) {
      console.log(e)
      await call()
    }
  } finally {
    if (page) {
      const date = new Date().toISOString().replace(/-/g, "").replace(/:/g, "").split(".")[0]
      await page.screenshot({
        path: path.resolve(__dirname, 'screenshot_' + date + '.jpg')
      })
    }
    await browser.close();
  }
}

const run = async () => {
  while (true) {
    try {
      await doAttempt()
    } catch (e) {
      console.log(e)
    }
    console.log("sleeping for 10 minutes...")
    await sleep(10 * 60)
  }
}

run()