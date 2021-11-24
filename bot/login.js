const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
      userDataDir: process.env.GOOGLE_CHROME_DIR,
      executablePath: process.env.GOOGLE_CHROME_BIN,
      defaultViewport: null,
      headless: false,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
          `--start-maximized`,
          '--disable-features=site-per-process',
      ],
  });
  const page = (await browser.pages())[0]
  console.log('Browser opened');

  await page.goto("https://www.instagram.com");
  try {
    {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Accept All");
        await element.click();
    }
    {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Phone number, username, or email");
        await element.click();
    }
    {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Phone number, username, or email");
        await element.type(process.env.INSTAGRAM_USERNAME);
    }
    {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Password");
        await element.type(process.env.INSTAGRAM_PASSWORD);
        page.keyboard.press('Enter');
    }
    {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Security Code");
        await element.type(process.env.TFA);
    }
    {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Confirm");
        await element.click();
    }
    {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const promise = targetPage.waitForNavigation();
        const element = await frame.waitForSelector("aria/Not Now");
        await element.click();
        await promise;
    }
    {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Not Now");
        await element.click();
        console.log('Loged!');
    }
  }
  catch (e) {
    console.log('Error: ', e);
  }
})();
