import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import * as https from 'https'

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", async (interceptedRequest) => {
    if (
      //(interceptedRequest.url().endsWith(".png") || interceptedRequest.url().endsWith(".jpg")) && interceptedRequest.url().includes("/assets")

      //interceptedRequest.url().endsWith(".mp3") && interceptedRequest.url().includes("/assets")

      interceptedRequest.url().endsWith(".js") && interceptedRequest.url().includes("poki-gdn")
      
    ) {
        const imageUrl = interceptedRequest.url();
        let imageName = "";
        console.log(imageUrl);
        if (interceptedRequest.url().includes("/engine")){
          imageName = "C:/Programations/intercept-puppeteer/js" + interceptedRequest.url().substring(interceptedRequest.url().indexOf('/engine'));
        }
        if (interceptedRequest.url().includes("/source")){
          imageName = "C:/Programations/intercept-puppeteer/js" + interceptedRequest.url().substring(interceptedRequest.url().indexOf('/source'));
        }
        //imageName = "C:/Programations/intercept-puppeteer/js" + interceptedRequest.url().substring(interceptedRequest.url().indexOf('/source'));

        const file = fs.createWriteStream(imageName);
      console.log(interceptedRequest.url());
      https.get(imageUrl, (response: { pipe: (arg0: any) => void; }) => {
        response.pipe(file);
      
        file.on('finish', () => {
          file.close();
        });
      }).on('error', (err: { message: any; }) => {
        //fs.unlink(imageName);
      });
    }
    interceptedRequest.continue();
  });
  await page.goto("https://poki.com/br/g/jetpack-joyride");
  await browser.close();
})();