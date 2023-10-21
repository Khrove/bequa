import { Page } from "@playwright/test";
import { SearchPage } from "../pages/Search.page";

export const SearchOperations = (page: Page) => {
    const _page: Page = page;
    const _searchPage = SearchPage(_page);

    const _waitForPage = async () => {
        await _searchPage.waitForSearchPage();
    }

    const _isShoppingTypeModalPresent = async () => {
        return _searchPage.closeModalBtn().isVisible();
    }

    const _isReloadPageBtnPresent = async () => {
        await _page.waitForTimeout(1000);
        return _searchPage.reloadPageBtn().isVisible();
    }

    const _ensurePageIsInValidState = async () => {
        if (await _isShoppingTypeModalPresent()) await _searchPage.closeModalBtn().click();
        if (await _isReloadPageBtnPresent()) await _searchPage.reloadPageBtn().click();
    }

    const _doesFoundProductMatchWantedProduct = async (product: string) => {
        return (product !== await _searchPage.getFirstResult().textContent());
    }

    const _getProductTitle = async (product: string) => {
        let products = [];
        await _ensurePageIsInValidState();

        if (await _doesFoundProductMatchWantedProduct(product)) {
            for (let i = 0; i < 2; i++) {
                console.log('HERE!');
                console.log(await _searchPage.getNthResult(i).locator('h2 div[title]').textContent());
                products.push(await _searchPage.getNthResult(i).locator('h2 div[title]').textContent());
            }
        } else {
            products.push(await _searchPage.searchResults(product)
                .locator('h2 div').textContent())
        }
        return products;
    }

    const _getProductAisle = async (product: string) => {
        let aisles = [];
        await _ensurePageIsInValidState();

        // Check to see if the first product directly matches what you searched for
        if (await _doesFoundProductMatchWantedProduct(product)) {
            // If it doesn't match, then we'll just grab the first two products on the page
            for (let i = 0; i < 2; i++) {
                aisles.push(await _searchPage.getNthResult(i)
                    .locator('[aria-label*="Aisle"] span:nth-child(2)')
                    .textContent());
            }
        } else {
            aisles.push(await _searchPage.searchResults(product)
                .locator('[aria-label*="Aisle"] span:nth-child(2)')
                .textContent());
        }
        return aisles;
    }

    const _getProductPrice = async (product: string) => {
        let prices = [];
        await _ensurePageIsInValidState();

        // Check to see if the first product directly matches what you searched for
        if (await _doesFoundProductMatchWantedProduct(product)) {
            // If it doesn't match, then we'll just grab the first two products on the page
            for (let i = 0; i < 2; i++) {
                prices.push(await _searchPage.getNthResult(i)
                    .locator('[aria-label="Product"]  div:nth-child(2) > div > span')
                    .textContent());
            }
        } else {
            prices.push(await _searchPage.searchResults(product)
                .locator('[aria-label="Product"]  div:nth-child(2) > div > span')
                .textContent());
        }
        return prices;
    }

    return {
        waitForPage: () => { return _waitForPage(); },
        getProductAisle: (product: string) => { return _getProductAisle(product); },
        getProductPrice: (product: string) => { return _getProductPrice(product); },
        getProductTitle: (product: string) => { return _getProductTitle(product); }
    }
}