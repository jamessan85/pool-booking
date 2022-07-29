import puppeteer from "puppeteer";

const startPuppet = () => {
  return puppeteer.launch({ headless: true });
};

let browser;
const runPuppet = async ({ date, time } = {}) => {
  if (!browser) {
    browser = await startPuppet();
  }

  const page = await browser.newPage();

  await page.goto(
    `https://haytonpool.simplybook.it/v2/?widget-type=iframe&theme=default&theme=default&timeline=modern&datepicker=inline_datepicker#book/service/1/count/1/provider/1/date/${date}/`,
    { waitUntil: "networkidle2" }
  );

  const res = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      const elements = document.querySelectorAll(
        "#sb_time_slots_container > div"
      );
      resolve([...elements].map((elm) => elm.innerText));
    });
  });
  page.close();
  return res;
};

export default runPuppet;
