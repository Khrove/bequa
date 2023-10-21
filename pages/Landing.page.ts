import type { Locator, Page } from "@playwright/test";
import { LocationModal } from "./modals/Location.modal";

export const LandingPage = (page: Page) => {
    const _page: Page = page;
    const _locationModal = LocationModal(_page);
    const _locationBtn: Locator = _page.locator('.context-info #nav-shopping-selector-store');
    const _searchInput: Locator = _page.locator('div[class*="desktop"] [aria-label="What can we help you find?"]');
    const _searchBtn: Locator = _page.locator('div[class*="desktop"] [aria-label="Submit Search"]');

    const _waitForPageToBeReady = async () => {
        await _page.waitForURL('**/');
        await _page.waitForLoadState('domcontentloaded');
    }

    return {
        locationModal: () => { return _locationModal; },
        locationBtn: () => { return _locationBtn; },
        searchInput: () => { return _searchInput; },
        searchBtn: () => { return _searchBtn; },
        waitForPageToBeReady: () => { return _waitForPageToBeReady(); },
    }
}