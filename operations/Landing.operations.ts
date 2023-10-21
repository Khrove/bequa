import { Page } from "@playwright/test";
import { LandingPage } from "../pages/Landing.page";

export const LandingOperations = (page: Page) => {
    const _page: Page = page;
    const _landingPage = LandingPage(_page);

    const _waitForPage = async () => {
        await _landingPage.waitForPageToBeReady();
    }
    const _updateLocation = async (location: string) => {
        await _landingPage.locationBtn().click();
        await _landingPage.locationModal().selectYourLocationInput().fill(location);
        await _landingPage.locationModal().locationRows(location).click();
    }

    const _searchForSomething = async (item: string) => {
        await _landingPage.searchInput().fill(item);
        await _page.keyboard.press('Enter');
    }

    return {
        waitForPage: () => { return _waitForPage(); },
        updateLocation: (location: string) => { return _updateLocation(location) },
        searchForSomething: (item: string) => { return _searchForSomething(item); }
    }
}