import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://books.toscrape.com/");
  await page.waitForNetworkIdle();

  const result = await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 100;
      let scrolledAmount = 0;

      const interval = setInterval(() => {
        window.scrollBy(0, distance);
        scrolledAmount += distance;

        if (scrolledAmount >= document.body.scrollHeight) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    const books = [];
    const booksQuery = document.querySelectorAll("h3 > a");
    const pricesQuery = document.querySelectorAll(".price_color");
    const imageSrcQuery = document.querySelectorAll(".thumbnail")

    for (let i = 0; i < booksQuery.length; i++) {
      books.push({
        href: booksQuery[i].href,
        title: booksQuery[i].title,
        price: pricesQuery[i].textContent,
        imgSrc: imageSrcQuery[i].src
      });
    }

    return books;
  });

  fs.writeFileSync("book.json", JSON.stringify(result, null, 2));
  console.log(result);

  browser.close();
})();
