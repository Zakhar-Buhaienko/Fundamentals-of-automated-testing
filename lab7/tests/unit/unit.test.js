import { setupBrowser, getText, getTextArray, fillForm } from '../../utils/utils';

describe("Unit Tests - Utility Functions", () => {
    let browser, page;

    jest.setTimeout(20000);

    beforeAll(async () => {
        ({ browser, page } = await setupBrowser("https://example.com"));
    });

    afterAll(async () => {
        await browser.close();
    });

    test("setupBrowser initializes browser and page", async () => {
        expect(browser).toBeDefined();
        expect(page).toBeDefined();
        const title = await page.title();
        expect(title).toBeTruthy();
    });

    test("getText retrieves correct text", async () => {
        await page.setContent('<div id="test">Hello, World!</div>');
        const text = await getText(page, "#test");
        expect(text).toBe("Hello, World!");
    });

    test("getTextArray retrieves correct array of texts", async () => {
        await page.setContent(`
            <ul>
                <li class="item">Item 1</li>
                <li class="item">Item 2</li>
                <li class="item">Item 3</li>
            </ul>
        `);
        const texts = await getTextArray(page, ".item");
        expect(texts).toEqual(["Item 1", "Item 2", "Item 3"]);
    });

    test("fillForm fills input fields correctly", async () => {
        await page.setContent(`
            <form>
                <input id="name" type="text">
                <input id="email" type="email">
            </form>
        `);
        await fillForm(page, { "#name": "John Doe", "#email": "john@example.com" });

        const nameValue = await page.$eval("#name", el => el.value);
        const emailValue = await page.$eval("#email", el => el.value);

        expect(nameValue).toBe("John Doe");
        expect(emailValue).toBe("john@example.com");
    });

    test("getText returns null when selector not found", async () => {
        await page.setContent('<div id="test">Hello, World!</div>');
        const text = await getText(page, "#non-existent");
        expect(text).toBeNull();
    });

    test("getTextArray returns empty array when no matching elements", async () => {
        await page.setContent('<ul></ul>');
        const texts = await getTextArray(page, ".non-existent");
        expect(texts).toEqual([]);
    });

});
