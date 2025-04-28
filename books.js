import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://books.toscrape.com/')
    await page.waitForNetworkIdle()

    const result = await page.evaluate( async () => {
        await new Promise(resolve => {
            const distance = 1000
            let scrolledAmount = 0

            const interval = setInterval(() => {
                window.scrollBy(0, distance)
                scrolledAmount += distance

                
                if (scrolledAmount >= document.body.scrollHeight) {
                    clearInterval(interval)
                    resolve()
                }

            }, 100)
        })



        const books = []
        const booksQuery = document.querySelectorAll("h3 > a")
        const pricesQuery = document.querySelectorAll(".price_color")
        const availbeQuery = document.querySelectorAll(".instock")
        
        for (let i = 0; i < booksQuery.length; i++) {
            books.push({
                src: booksQuery[i].href,
                title: booksQuery[i].title,
                price: pricesQuery[i].textContent,
                status: availbeQuery[i]?.textContent.trim()
            })
        }
        

        return books
    })

    
    console.log(result)

    browser.close()
})()