const puppeteer = require('puppeteer');
const fs = require('fs');

//Read first argument of the command line
if(process.argv[2] === undefined){
    console.log("ERROR: Specify follower list txt path");
    console.log("Usage: node sorteo-area-sur.js path/to/followers.txt");
    process.exit();
}

if(process.env.GOOGLE_CHROME_DATA_DIR === undefined ||
  process.env.GOOGLE_CHROME_BIN === undefined ||
  process.env.INSTAGRAM_POST_URL === undefined ||
  process.env.INSTAGRAM_COMMENT_URL === undefined){
    console.log("ERROR: Env variables are nor set properly check it before running again");
    console.log('GOOGLE_CHROME_DATA_DIR', process.env.GOOGLE_CHROME_DATA_DIR);
    console.log('GOOGLE_CHROME_BIN', process.env.GOOGLE_CHROME_BIN);
    console.log('INSTAGRAM_POST_URL', process.env.INSTAGRAM_POST_URL);
    console.log('INSTAGRAM_COMMENT_URL', process.env.INSTAGRAM_COMMENT_URL);
    process.exit();
  }

// Define waitFor promise function utility
const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

// Open a file and read its content line by line and save it into an array
const users = fs.readFileSync(process.argv[2], 'utf8').split('\n');

(async () => {
  const browser = await puppeteer.launch({
      userDataDir: process.env.GOOGLE_CHROME_DATA_DIR,
      executablePath: process.env.GOOGLE_CHROME_BIN,
      defaultViewport: null,
      headless: false,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
          `--start-maximized`,
          '--disable-features=site-per-process',
      ],
  });
  const page = await browser.newPage();
  {
      const targetPage = page;
      await targetPage.setViewport({"width":1226,"height":942})
      const promises = [];
      promises.push(targetPage.waitForNavigation());
      //https://www.instagram.com/p/CWnNF8sI11p/;
      await targetPage.goto(process.env.INSTAGRAM_POST_URL);
      await Promise.all(promises);
  }
  {
    for(let i = 0; i < users.length; i++){
      var timeToWait = 30000;
      // Click on comments input box
      {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Add a comment…");
        await element.click({ offset: { x: 196, y: 12} });
      }
      const targetPage = page;
      targetPage.setDefaultTimeout(timeToWait * 4 + 1000)
      const frame = targetPage.mainFrame();
      const element = await frame.waitForSelector("aria/Add a comment…");

      console.log("Writting a comment for", users[i]);
      await element.type(users[i]);

      // Click post comment
      {
        const element = await frame.waitForSelector("aria/Post");
        await element.click({ offset: { x: 8.34375, y: 11} });
      }
      
      // Error 419 Logic
      //"https://www.instagram.com/web/comments/2713194883881065833/add/"
      finalResponse = await targetPage.waitForResponse(response => response.url() === process.env.INSTAGRAM_COMMENT_URL || response.status() === 200);
      if(!finalResponse.ok()){
        timeToWait = timeToWait * 4;
        i--;
        const element = await frame.waitForSelector("aria/Add a comment…");
        await element.evaluate(el => {
          el.value = ""
          el.textContent = ""
        });
      }

      console.log("Waiting", timeToWait/1000, "seconds before doing another request");
      await waitFor(timeToWait);
    }
  }

  await browser.close().catch(err => {
      console.log(err);
  });

})().catch(console.error);
