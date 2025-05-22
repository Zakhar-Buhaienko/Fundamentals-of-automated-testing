import { setupBrowser, getText, getTextArray } from '../../utils/utils';

const BASE_URL = require('../../config/config').BASE_URL;

describe("UI Tests - Products Page", () => {
    let browser, page;

    jest.setTimeout(60000);

    beforeAll(async () => {
        // Ініціалізація браузера та відкриття сторінки продуктів
        ({ browser, page } = await setupBrowser(`${BASE_URL}/products`));
    });

    afterAll(async () => {
        // Закриття браузера після завершення тестів
        await browser.close();
    });

    test("Products page loads correctly", async () => {
        // Перевіряємо, що сторінка має правильний заголовок
        const title = await page.title();
        expect(title).toContain("Products");

        // Переконуємось, що список продуктів присутній на сторінці
        const productList = await page.$(".features_items");
        expect(productList).not.toBeNull();
    });

    test("Search bar returns correct results", async () => {
        // Очікуємо появи поля пошуку та вводимо запит "T-shirt"
        await page.waitForSelector("#search_product", { visible: true });
        await page.type("#search_product", "T-shirt");
        await page.click("#submit_search");

        // Переконуємося, що відображаються результати пошуку
        await page.waitForSelector(".productinfo", { visible: true });

        // Перевіряємо, що знайдено хоча б один продукт
        const searchResults = await page.$$eval(".productinfo", items => items.length);
        expect(searchResults).toBeGreaterThan(0);

        // Переконуємося, що всі результати містять слово "T-shirt"
        const productNames = await getTextArray(page, ".productinfo p");
        productNames.forEach(name => {
            expect(name.toLowerCase()).toContain("t-shirt");
        });
    });

    test("Each product has an 'Add to Cart' button", async () => {
        // Отримуємо всі кнопки "Add to Cart"
        const addToCartButtons = await page.$$(".productinfo .add-to-cart");
        const products = await page.$$(".productinfo");

        // Переконуємося, що кожен продукт має відповідну кнопку
        expect(addToCartButtons.length).toBe(products.length);
    });

    test("Clicking 'View Product' opens the correct product details page", async () => {
        // Отримуємо назву першого продукту
        const productName = await getText(page, ".productinfo p");

        // Натискаємо кнопку "View Product"
        await page.click(".product-image-wrapper .choose a");
        await page.waitForSelector('.product-information');

        // Перевіряємо, що URL містить "product_details"
        const url = page.url();
        expect(url).toContain("/product_details/");

        // Переконуємося, що назва продукту на сторінці збігається з обраним
        const productTitleOnPage = await getText(page, ".product-information h2");
        expect(productTitleOnPage).toBe(productName);
    });

    test("Cart updates correctly when adding a product", async () => {
        // Повертаємося на сторінку продуктів
        await page.goto(`${BASE_URL}/products`);
        await page.waitForSelector(".productinfo");

        // Отримуємо назву першого продукту
        const productName = await getText(page, ".productinfo p");

        // Додаємо продукт у кошик
        await page.click(".add-to-cart");
        await page.waitForSelector(".modal-content", { visible: true });

        // Відкриваємо кошик
        await page.goto(`${BASE_URL}/view_cart`);
        await page.waitForSelector(".cart_product");

        // Перевіряємо, що доданий товар є у кошику
        const cartItems = await getTextArray(page, ".cart_description h4");
        expect(cartItems.length).toBeGreaterThan(0);
        expect(cartItems).toContain(productName);
    });
});
