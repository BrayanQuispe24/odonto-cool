const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(`
    <html>
      <head>
        <style>
          :root { --text-sm: 0.875rem; }
          .text-sm { font-size: var(--text-sm); }
          html[data-font-size="sm"] { font-size: 10px; }
          html[data-font-size="lg"] { font-size: 20px; }
        </style>
      </head>
      <body class="text-sm">
        <div id="test">Hello</div>
      </body>
    </html>
  `);
  
  await page.evaluate(() => document.documentElement.setAttribute('data-font-size', 'sm'));
  let sizeSm = await page.evaluate(() => window.getComputedStyle(document.getElementById('test')).fontSize);
  
  await page.evaluate(() => document.documentElement.setAttribute('data-font-size', 'lg'));
  let sizeLg = await page.evaluate(() => window.getComputedStyle(document.getElementById('test')).fontSize);
  
  console.log({ sm: sizeSm, lg: sizeLg });
  await browser.close();
})();
