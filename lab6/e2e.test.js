const puppeteer = require('puppeteer');

describe('Automation Exercise - Оновлені UI тести', () => {
  let browser, page;

  jest.setTimeout(100000);

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    page = await browser.newPage();
    await page.goto('https://www.automationexercise.com/');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('TC-001: Реєстрація, логін, покупка товару', async () => {
    await page.click('a[href="/login"]');
    const email = `test${Date.now()}@mail.com`;

    await page.type('[data-qa="signup-name"]', 'TestUser');
    await page.type('[data-qa="signup-email"]', email);
    await page.click('[data-qa="signup-button"]');

    await page.waitForSelector('[data-qa="password"]');
    await page.type('[data-qa="password"]', 'Password123');
    await page.type('[data-qa="first_name"]', 'Test');
    await page.type('[data-qa="last_name"]', 'User');
    await page.type('[data-qa="address"]', '123 Main St');
    await page.type('[data-qa="city"]', 'Kyiv');
    await page.type('[data-qa="state"]', 'Kyivska');
    await page.type('[data-qa="zipcode"]', '01001');
    await page.type('[data-qa="mobile_number"]', '+380123456789');
    await page.select('[data-qa="country"]', 'India');
    await page.click('[data-qa="create-account"]');

    await page.waitForSelector('.title');
    const successTitle = await page.$eval('.title', el => el.textContent);
    expect(successTitle).toContain('Account Created!');

    await page.click('a[href="/products"]');
    await page.waitForSelector('.features_items');
    await page.click('.productinfo.text-center .add-to-cart');
    await page.waitForSelector('.modal-content');
    await page.click('.btn.btn-success.close-modal');

    await page.click('a[href="/view_cart"]');
    await page.waitForSelector('.cart_info');
    const cartItems = await page.$$('.cart_description');
    expect(cartItems.length).toBeGreaterThan(0);
  });

  test('TC-002: Відгук + форма контактів', async () => {
    await page.click('a[href="/products"]');
    await page.waitForSelector('.choose a');
    await page.click('.choose a');

    await page.waitForSelector('#review-form');
    await page.type('#name', 'Test User');
    await page.type('#email', 'test@mail.com');
    await page.type('#review', 'Все чудово!');
    await page.click('#button-review');

    await page.waitForSelector('.alert-success');
    const reviewMsg = await page.$eval('.alert-success', el => el.textContent);
    expect(reviewMsg).toContain('Thank you for your review');

    page.on('dialog', async dialog => await dialog.accept());
    await page.click('a[href="/contact_us"]');

    await page.waitForSelector('#contact-page');
    await page.type('[data-qa="name"]', 'Ivan');
    await page.type('[data-qa="email"]', 'ivan@mail.com');
    await page.type('[data-qa="subject"]', 'Тест');
    await page.type('[data-qa="message"]', 'Тестове повідомлення');
    await page.click('[data-qa="submit-button"]');

    await page.waitForSelector('.alert-success');
    const contactMsg = await page.$eval('.alert-success', el => el.textContent);
    expect(contactMsg).toContain('Success');
  });

  test('TC-003: Перевірка email-адреси на сторінці контактів', async () => {
    await page.goto('https://www.automationexercise.com/contact_us');
    await page.waitForSelector('#contact-page', { visible: true });

    const emailHref = await page.evaluate(() => {
      const link = document.querySelector('a[href^="mailto:"]');
      return link ? link.getAttribute('href') : null;
    });

    expect(emailHref).toBeTruthy();                     // Перевірка, що посилання існує
    expect(emailHref).toMatch(/^mailto:.+@.+\..+$/);    // Перевірка формату mailto:email@domain
  });


});
