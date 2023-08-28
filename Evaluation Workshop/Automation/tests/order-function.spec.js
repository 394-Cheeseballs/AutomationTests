import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main-page';
import { LoginPage } from '../pages/login-page';

let FirstUserInformation = {
    email: 'laura.tauraite@sft.com', 
    password: 'tester170', 
}

let SecondUserInformation = {
    email: 'karolis.lipinskas@sft.com', 
    password: 'tester169', 
}

let loginPageURL = 'https://lunch.devbstaging.com/login-password'
let loginPage
let mainPage
let foodLocator = 'div.layout:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)'


test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page)
    await loginPage.navigateToLoginPage(loginPageURL)
})

test('Put food into cart', async ({page}) => {
    await loginPage.login(FirstUserInformation)
    mainPage = new MainPage(page)
    await mainPage.addFoodToCart(foodLocator)
    let addedFoodName = await page.locator(foodLocator).allTextContents()

    await expect(page.locator('span.v-chip__content')).toContainText(addedFoodName)
})

test('Remove food from cart', async ({page}) => {
    await loginPage.login(SecondUserInformation)
    mainPage = new MainPage(page)
    await mainPage.addFoodToCart(foodLocator)
    let addedFoodName = await page.locator(foodLocator).allTextContents()
    
    await mainPage.removeFoodFromCart()

    await expect(page.locator('span.v-chip__content')).not.toHaveText(addedFoodName)
})

