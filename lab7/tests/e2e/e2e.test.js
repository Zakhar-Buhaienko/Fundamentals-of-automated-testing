import { setupBrowser, getText, getTextArray, fillForm } from '../../utils/utils';

const BASE_URL = require('../../config/config').BASE_URL;

describe('Automation Exercise - E2E Tests', () => {
    let browser, page;

    jest.setTimeout(120000);

    beforeAll(async () => {
        // Ініціалізація браузера та відкриття сторінки продуктів
        ({ browser, page } = await setupBrowser(`${BASE_URL}/products`));
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Register, login, product to cart and checkout', async () => {
        // Відкриваємо сторінку логіна/реєстрації
        await page.click('a[href="/login"]');

        // Реєстрація нового користувача
        const email = 'testuser' + Date.now() + '@mail.com';
        await page.type('[data-qa="signup-name"]', 'TestUser');
        await page.type('[data-qa="signup-email"]', email);
        await page.click('[data-qa="signup-button"]');

        // Очікуємо появи форми реєстрації та заповнюємо її
        await page.waitForSelector('[data-qa="password"]', { visible: true });

        const authData = {
            '[data-qa="password"]': 'TestPass123',
            '[data-qa="first_name"]': 'Test',
            '[data-qa="last_name"]': 'User',
            '[data-qa="address"]': '123 Test Street',
            '[data-qa="city"]': 'TestCity',
            '[data-qa="state"]': 'TestState',
            '[data-qa="zipcode"]': '12345',
            '[data-qa="mobile_number"]': '1234567890',
        }

        await fillForm(page, authData);

        // Вибираємо країну зі списку
        await page.select('[data-qa="country"]', 'United States');

        await page.click('[data-qa="create-account"]');

        // Переконуємося, що акаунт створено
        await page.waitForSelector('.title', { visible: true });
        const accountTitle = await getText(page, '.title');
        expect(accountTitle).toContain('Account Created!');

        await page.click('a[href="/products"]');
        await page.waitForSelector('.features_items');

        // Додаємо перший товар у кошик
        await page.click('.productinfo.text-center .add-to-cart');
        await page.waitForSelector('.modal-content', { visible: true });
        await page.click('.btn.btn-success.close-modal');

        // Переходимо в кошик
        await page.click('a[href="/view_cart"]');
        await page.waitForSelector('.cart_info');

        // Переконуємося, що товар додано до кошика
        const cartItems = await page.$$('.cart_description');
        expect(cartItems.length).toBeGreaterThan(0);

        // Оформляємо замовлення
        await page.click('.check_out');


        await page.waitForSelector('[name="message"]');

        // Заповнюємо інформацію
        await page.type('[name="message"]', 'Please deliver fast!');
        await page.click('.check_out');

        await page.waitForSelector('[data-qa="name-on-card"]');

        // Заповнення форми оплати
        const paymentData = {
            '[data-qa="name-on-card"]': 'TestUser',
            '[data-qa="card-number"]': '4111111111111111',
            '[data-qa="cvc"]': '123',
            '[data-qa="expiry-month"]': '12',
            '[data-qa="expiry-year"]': '2025',
        }

        await fillForm(page, paymentData)

        // Натискання на кнопку "Pay and Confirm Order"
        await page.click('[data-qa="pay-button"]');

        // Очікуємо на успішне повідомлення про оформлення замовлення
        await page.waitForSelector('[data-qa="order-placed"]', { visible: true });

        // Переконуємося, що замовлення було успішно оформлено
        const successMessage = await getText(page, '[data-qa="order-placed"]');
        expect(successMessage).toBe('Order Placed!');


    });


    test('Submit a review and contact form', async () => {
        await page.click('a[href="/products"]');
        await page.waitForSelector('.features_items');

        // Переходимо до першого товару
        await page.click('.choose a');
        await page.waitForSelector('#review-form');

        // Заповнюємо відгук
        await fillForm(page, {
            '#name': 'Test User',
            '#email': 'testuser@mail.com',
            '#review': 'Great product, highly recommend!',
        });

        await page.click('#button-review');

        // Перевіряємо, що відгук надіслано
        await page.waitForSelector('.alert-success', { visible: true });
        const reviewAlert = await getText(page, '.alert-success');
        expect(reviewAlert).toContain('Thank you for your review.');

        // Тестуємо форму зворотного зв’язку
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        await page.click('a[href="/contact_us"]');
        await page.waitForSelector('#contact-page');

        const feedbackData = {
            '[data-qa="name"]': 'John Doe',
            '[data-qa="email"]': 'johndoe@mail.com',
            '[data-qa="subject"]': 'Website Feedback',
            '[data-qa="message"]': 'This website is amazing!',
        }

        await fillForm(page, feedbackData);

        await page.click('[data-qa="submit-button"]');



        // Переконуємося, що повідомлення відправлено
        await page.waitForSelector('.alert-success', { visible: true });
        const contactAlert = await getText(page, '.alert-success');
        expect(contactAlert).toContain('Success! Your details have been submitted successfully.');
    });

    test('Add products from multiple categories, search for an item, and clear the cart', async () => {

        await page.waitForSelector('a[href="/products"]', { visible: true });
        await page.click('a[href="/products"]');
        await page.waitForSelector('.features_items', { visible: true });

        // Додаємо в кошик по товару з кожної категорії
        const categoryMap = {
            "#Women": [1, 2, 7],
            "#Men": [3, 6],
            "#Kids": [4, 5]
        };

        for (const [menu, subcategories] of Object.entries(categoryMap)) {
            const parentMenuSelector = `a[data-toggle="collapse"][href="${menu}"]`;


            for (const subcategory of subcategories) {

                await page.waitForSelector(parentMenuSelector);
                await page.click(parentMenuSelector);

                const categorySelector = `a[href="/category_products/${subcategory}"]`;

                await page.waitForSelector(categorySelector, { visible: true });
                await page.click(categorySelector);
                await page.waitForSelector('.features_items', { visible: true });

                await page.waitForSelector('.productinfo.text-center .add-to-cart', { visible: true });
                await page.click('.productinfo.text-center .add-to-cart');
                await page.waitForSelector('.modal-content', { visible: true });
                await page.click('.btn.btn-success.close-modal');
            }
        }

        await page.waitForSelector('a[href="/products"]', { visible: true });
        await page.click('a[href="/products"]');


        // Шукаємо ще один товар через пошук
        await page.type('#search_product', 'Shirt');
        await page.click('#submit_search');
        await page.waitForSelector('.features_items');

        // Додаємо знайдений товар у кошик
        await page.click('.productinfo.text-center .add-to-cart');
        await page.waitForSelector('.modal-content', { visible: true });
        await page.click('.btn.btn-success.close-modal');

        // Переходимо до кошика
        await page.click('a[href="/view_cart"]');
        await page.waitForSelector('.cart_info');

        // Перевіряємо, що всі товари є у кошику
        const cartItems = await getTextArray(page, '.cart_quantity');
        const totalQuantity = cartItems.reduce((a, b) => a + parseInt(b.replace(/\D/g, ''), 10), 0);
        expect(totalQuantity).toBe(8);

        // Видаляємо всі товари з кошика
        let deleteButtons = await page.$$('a.cart_quantity_delete');
        for (const deleteButton of deleteButtons) {
            await deleteButton.click();
            await page.waitForSelector('.cart_quantity_delete', { visible: false });
            deleteButtons = await page.$$('a.cart_quantity_delete');
        }

        // Перевіряємо, що кошик порожній
        await page.waitForSelector('#empty_cart');
        const emptyCartMessage = await getText(page, '#empty_cart .text-center');
        expect(emptyCartMessage).toContain('Cart is empty');
    });


});
