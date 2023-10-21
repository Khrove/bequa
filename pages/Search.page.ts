import {Locator, Page} from "@playwright/test";

export const SearchPage = (page: Page) => {
    const _page: Page = page;
    const _closeModalBtn: Locator = _page.getByLabel('Modal close');
    const _reloadPageBtn: Locator = _page.getByRole('button', { name: 'Reload' });

    const _waitForSearchPage = async () => {
        await _page.waitForURL('**/search?**');
        await _page.waitForLoadState('domcontentloaded');
    }

    const _getFirstSearchResult = () => {
        return _page.locator('[data-test="product-grid-item"] [data-test="item-tile-name-button"] div').first();
    }

    return {
        closeModalBtn: () => { return _closeModalBtn; },
        reloadPageBtn: () => { return _reloadPageBtn; },
        waitForSearchPage: () => { return _waitForSearchPage(); },
        searchResults: (result: string) => {
            return _page.locator('[data-test="product-grid-item"]')
                .filter({ hasText: result });
        },
        getNthResult: (nth: number) => {
            return _page.locator('[data-test="product-grid-item"]')
                .nth(nth);
        },
        getFirstResult: () => { return _getFirstSearchResult(); }
    }
}