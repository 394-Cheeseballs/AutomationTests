import { test, expect } from '@playwright/test';
import { loginInformation } from '../tests/swag-labs.spec'

export class LoginPage{

    constructor(page) {
      this.page = page;
    }
  
    async navigateToLoginPage() {
        await this.page.goto('https://www.saucedemo.com/');
        await expect(this.page).toHaveTitle('Swag Labs');
    }

    async Login(loginInformation) {
        await this.page.locator('#user-name').fill(loginInformation.username)
        await this.page.locator('#password').fill(loginInformation.password)
        await this.page.locator('#login-button').click();
        await expect(this.page.locator('.title')).toHaveText('Products')
    }

  }