const puppeteer = require("puppeteer")
const { call } = require("./twilio")

const sleep = (secs) => new Promise((res, rej) => {
  setTimeout(() => res(), secs * 1000)
})

const doAttempt = async () => {
  console.log("launching")
  const browser = await puppeteer.launch({ headless:false, timeout: 60000 });
  const page = await browser.newPage();

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
  await page.type("#txtDesCitado", "Joaquim de Souza")
  await sleep(1)
  await page.select("#txtPaisNac", "112")
  await sleep(1)
  await page.click("#btnEnviar")
  console.log("entering citas management")
  await sleep(1)

  await page.click('#btnEnviar')
  console.log("entering citas select")
  await sleep(1)

  try {
    // .mf-msg__info
    const element = await page.waitForSelector("sdfsafdsaf", { timeout: 5000 })
    await sleep(1)
    const text = await element.evaluate(el => el.textContent)
    if (!text.includes("no hay citas disponibles")) {
      throw new Error("'no hay citas' mensaje no existe")
    }
  } catch (e) {
    console.log(e)
    await call()
  }

  await browser.close();
  await sleep(15 * 60)
}

const run = async () => {
  while (true) {
    try {
      await doAttempt()
    } catch (e) {
      console.log(e)
    }
  }
}

run()