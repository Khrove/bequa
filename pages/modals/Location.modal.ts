import {Locator, Page} from "@playwright/test";

export const LocationModal = (page: Page) => {
    const _page: Page = page;
    const _selectYourLocationInput: Locator = _page.locator('input[id*="shopping-selector-search-cities"]');


    return {
        selectYourLocationInput: () => { return _selectYourLocationInput; },
        locationRows: (location: string) => {
            return _page.locator('li[class*="store"]')
                .filter({ hasText: location })
                .locator('button');
        }
    }
}