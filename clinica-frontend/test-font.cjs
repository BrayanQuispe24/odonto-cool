const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:5174');
  await page.waitForSelector('body');
  
  // Set sm
  await page.evaluate(() => document.documentElement.setAttribute('data-font-size', 'sm'));
  await new Promise(r => setTimeout(r, 200));
  const sizeSm = await page.evaluate(() => {
    const el = document.querySelector('p, h1, h2, h3, span, div.text-sm');
    return el ? window.getComputedStyle(el).fontSize : 'none';
  });
  
  // Set lg
  await page.evaluate(() => document.documentElement.setAttribute('data-font-size', 'lg'));
  await new Promise(r => setTimeout(r, 200));
  const sizeLg = await page.evaluate(() => {
    const el = document.querySelector('p, h1, h2, h3, span, div.text-sm');
    return el ? window.getComputedStyle(el).fontSize : 'none';
  });
  
  console.log('SM:', sizeSm);
  console.log('LG:', sizeLg);
  await browser.close();
})();
