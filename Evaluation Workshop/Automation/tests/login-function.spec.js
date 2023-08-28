import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

let validUserInformation = {
    email: 'elona.malakauskiene@sft.com', 
    password: 'tester166', 
    name: 'Elona'
}

let invalidUserInformation = {
    email: JSON.stringify(Date.now()), 
    password: 'password', 
    name: null
}

let loginPageURL = 'https://lunch.devbstaging.com/login-password'

let loginPage

test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page)
    await loginPage.navigateToLoginPage(loginPageURL)
    await expect(page.locator('.headline')).toHaveText('Sign in')
})

test('Login as a normal user', async ({page}) => {
    await loginPage.login(validUserInformation)

    await expect(page.locator('div.v-subheader:nth-child(2)')).toContainText(validUserInformation.name)
})

test('Login as an invalid user', async ({page}) => {
    await loginPage.login(invalidUserInformation)
    
    await expect(page.locator('.headline')).toHaveText('Sign in')
})
