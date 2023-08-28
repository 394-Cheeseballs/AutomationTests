import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

let validUserInformation = {
    email: 'laura.tauraite@sft.com', 
    password: 'tester170', 
    name: 'Laura Tauraite'
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

    await expect(page.locator('div.v-subheader:nth-child(2)')).toHaveText(validUserInformation.name)
})

test('Login as an invalid user', async ({page}) => {
    await loginPage.login(invalidUserInformation)
    
    await expect(page.locator('.headline')).toHaveText('Sign in')
})
