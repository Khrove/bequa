import { test } from '@playwright/test';
import { LandingOperations } from "../operations/Landing.operations";
import { SearchOperations } from "../operations/Search.operations";

let groceryList = new Set();
let toSearch = [
    'Wegmans Hot Sausage',
    'Potato Salad'
];
const location = 'Hunt Valley';

test('Build a shopping list for Wegmans', async ({ page }) => {
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
    groceryList.add({ product: productTitle, aisle, price });
  }

  console.log(groceryList);
});
