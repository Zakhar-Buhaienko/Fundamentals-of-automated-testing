const puppeteer = require('puppeteer');

describe('UI тестування MelFamDent', () => {
    let browser;
    let page;

    jest.setTimeout(40000);

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('https://melfamdent.com', { waitUntil: 'networkidle2' });
    });

    afterAll(async () => {
        await browser.close();
    });

    test('TC-001: Відкриття головної сторінки', async () => {
        const title = await page.title();
        expect(title).toMatch(/Сімейна стоматологія/i);
    });

    test('TC-002: Перевірка наявності головного меню', async () => {
        const nav = await page.$('nav, .navbar');
        expect(nav).not.toBeNull();
    });

    test('TC-003: Перехід на сторінку "Послуги"', async () => {
        const links = await page.$$('a');
        let found = false;

        for (const link of links) {
            const text = await page.evaluate(el => el.innerText, link);
            if (text.includes('Послуги')) {
                await link.click();
                found = true;
                break;
            }
        }

        expect(found).toBe(true);
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        const content = await page.content();
        expect(content).toMatch(/Послуги/i);
    });

    test('TC-004: Перевірка наявності розділу “Контакти” та Google Maps', async () => {
        // Шукаємо посилання або iframe на карту
        const pageContent = await page.content();

        // Перевіряємо, чи є слова "Контакти" на сторінці
        expect(pageContent).toMatch(/Контакт/i);

        // Перевіряємо наявність Google Maps iframe або посилання
        const hasMap = await page.$('iframe[src*="google.com/maps"]') || await page.$('a[href*="google.com/maps"]');
        expect(hasMap).not.toBeNull();
    });

    test('TC-005: Перевірка наявності клікабельного номеру телефону', async () => {
        const telLinks = await page.$$eval('a[href^="tel:"]', els => els.map(el => el.getAttribute('href')));
        
        // Очікуємо наявність номера з пробілами в href
        const phoneFound = telLinks.some(href => /tel:\+?380\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/.test(href));
        expect(phoneFound).toBe(true);
    });

});
