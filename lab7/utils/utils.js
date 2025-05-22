const puppeteer = require('puppeteer');

export async function setupBrowser(url) {
    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
        const page = await browser.newPage();
        await page.goto(url);
        return { browser, page };
    } catch (error) {
        console.error("Error in setupBrowser:", error);
        throw error;
    }
}

export async function getText(page, selector) {
    try {
        return await page.$eval(selector, el => el.textContent.trim());
    } catch (error) {
        console.error(`Error in getText for selector ${selector}:`, error);
        return null; // Повертаємо null, якщо елемент не знайдено
    }
}

export async function getTextArray(page, selector) {
    try {
        return await page.$$eval(selector, items => items.map(item => item.textContent.trim()));
    } catch (error) {
        console.error(`Error in getTextArray for selector ${selector}:`, error);
        return []; // Повертаємо порожній масив у разі помилки
    }
}

export async function fillForm(page, selectorsValues) {
    try {
        for (const [selector, value] of Object.entries(selectorsValues)) {
            if (await page.$(selector)) {
                await page.type(selector, value);
            } else {
                console.warn(`Warning: Selector ${selector} not found.`);
            }
        }
    } catch (error) {
        console.error("Error in fillForm:", error);
        throw error;
    }
}
