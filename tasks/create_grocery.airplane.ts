import airplane from "airplane";
import * as playwright from 'playwright';
import { LandingOperations } from "../operations/Landing.operations";
import { SearchOperations } from "../operations/Search.operations";

export default airplane.task(
    {
        slug: "weggies",
        name: "Weggies",
        description: "Wegmans Scraper",
        parameters: {
            list: {
                name: "List of groceries",
                type: "longtext"
            },
            location: {
                name: "Wegmans Location",
                type: "shorttext"
            }
        }
    },
    async (params) => {
        let groceryList = new Set();
        let toSearch = params.list.split(',');
        let location = params.location;

        const browser = await playwright.chromium.launch({
            headless: true
        });

        const page = await browser.newPage();
        const landingOperations = LandingOperations(page);
        const searchOperations = SearchOperations(page);

        await page.goto('https://www.wegmans.com/');
        await page.setViewportSize({ width: 1920, height: 1080 });

        await landingOperations.waitForPage();
        await landingOperations.updateLocation(location);
        for (let i = 0; i < toSearch.length; i++) {
            await landingOperations.searchForSomething(toSearch[i]);
            await searchOperations.waitForPage();
            const aisle = await searchOperations.getProductAisle(toSearch[i]);
            const price = await searchOperations.getProductPrice(toSearch[i]);
            const productTitle = await searchOperations.getProductTitle(toSearch[i]);
            airplane.appendOutput({ productTitle, aisle, price });
        }

        await browser.close();
    }
);
