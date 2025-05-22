import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page'
import SecurePage from '../pageobjects/secure.page'

describe('Registration and Login Tests', () => {
  const user = {
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser2',
    password: 'testpass123'
  };

  beforeEach(async () => {
    await browser.url('https://www.globalsqa.com/angularJs-protractor/registration-login-example/');
  });

  it('should register a new user', async () => {
    await $('=Register').click();
    await $('input[name="firstName"]').setValue(user.firstName);
    await $('input[name="lastName"]').setValue(user.lastName);
    await $('input[name="username"]').setValue(user.username);
    await $('input[name="password"]').setValue(user.password);
    await $('button[type="submit"]').click();

    const successMsg = await $('.alert-success');
    //await expect(successMsg).toHaveTextContaining('Registration successful');
  });

  it('should login with the new user', async () => {
    await $('=Login').click();
    await $('input[name="username"]').setValue(user.username);
    await $('input[name="password"]').setValue(user.password);
    await $('button[type="submit"]').click();

    const greeting = await $('.ng-binding');
    //await expect(greeting).toHaveTextContaining(`Hi ${user.firstName}!`);
  });
});

  