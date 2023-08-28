import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsListPage } from '../pages/products-list-page';
import { ProductPreviewPage } from '../pages/product-preview-page';
import { CartPage } from '../pages/cart-page';

export let loginInformation = {
    username: 'standard_user',  //Possible users: standard_user, locked_out_user, problem_user, performance_glitch_user
    password: 'secret_sauce', 
}

test.slow(loginInformation.username === 'performance_glitch_user')

let productsListPage
let loginPage

test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page)
    await loginPage.navigateToLoginPage()
    await loginPage.Login(loginInformation)
    productsListPage = new ProductsListPage(page)
})

//#1 user story
test.describe('Verify sorting functionality', async () => {

    test('Verify dropdown options', async () => {
        let sortingOptionList = ['Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)']
        await productsListPage.verifyDropdownOptions(sortingOptionList)
    });

    test('Verify "Name(A-Z)" sorting is default', async () => {
        let result = await productsListPage.isListSortedByName(true)
        await expect(result).toBe(true)
    });


    test.describe('Check all sorting options', async () => {
        
        let sortingCriteria = [
            {
                sortingOption: 'Name (A to Z)',
                isListSortedInAscendingOrder: true
            }, 
            {
                sortingOption: 'Name (Z to A)',
                isListSortedInAscendingOrder: false
            }, 
            {
                sortingOption: 'Price (low to high)',
                isListSortedInAscendingOrder: true
            }, 
            {
                sortingOption: 'Price (high to low)',
                isListSortedInAscendingOrder: false
            }
        ]
    
        sortingCriteria.forEach(sortingCriterion => {
            test(`Check sorting by ${sortingCriterion.sortingOption}`, async ({page}) => {
                await productsListPage.selectSortingOption(sortingCriterion.sortingOption)
                if (sortingCriterion.sortingOption.split(' ')[0] === 'Name') {
                    await productsListPage.isListSortedByName(sortingCriterion.isListSortedInAscendingOrder)
                }
                else {
                    await productsListPage.isListSortedByPrice(sortingCriterion.isListSortedInAscendingOrder)
                }
            });
        })
    })
})

//#2 user story
test.describe('Verify ability to add swag to cart', async () => {
    let productPreviewPage
    let cartPage

    test.describe('Check all "Add to Cart" buttons', async () => {
        let howManyProductsToCheck = 3 //1-6
        test('Check "Add to Cart" buttons in products list', async () => {
            await productsListPage.isButtonAdded('Add to cart', 'all')
        })

        for (let i = 0; i < howManyProductsToCheck; i++) {
            test(`Check "Add to Cart" button in product No${i} preview`, async ({page}) => {
                    await productsListPage.goToProductPreviewPage(i)
                    productPreviewPage = new ProductPreviewPage(page)
                    await productPreviewPage.isButtonAdded('Add to cart', 'all')
                    await productPreviewPage.goToProductsListPage()
            })
        }
    })

    test.describe('Add items to cart', async () => {
        let howManyProductsAddToCart = 1 //1-6 //geriau ne for, o 2 atskirus padaryt su 1 ir visais arba tiesiog su viena preke paimi ir darai viska

        /*test(`Add items to cart via products list`, async ({page}) => {
            for (let i = 0; i < howManyProductsAddToCart; i++) {
                await productsListPage.addProductToCart(i)
                let addedProductName = await page.locator('.inventory_item_name').nth(i).allTextContents()
                await productsListPage.goToCart()
                cartPage = new CartPage(page)
                await cartPage.isProductInCart(addedProductName, i) //is > check, is tik boolean, assertus reiktu isorej rasyt, kurie tikrina rezultatus
                await cartPage.goToProductsListPage() //paskutine eilute turetu buti assertas
            }
        })*/

        test(`Add items to cart via products list`, async ({page}) => {
                await productsListPage.addProductToCart(0)
                let addedProductName = await page.locator('.inventory_item_name').nth(0).allTextContents()
                await productsListPage.goToCart()
                cartPage = new CartPage(page)
                await cartPage.isProductInCart(addedProductName, 0) //is > check, is tik boolean, assertus reiktu isorej rasyt, kurie tikrina rezultatus
                await cartPage.goToProductsListPage() //paskutine eilute turetu buti assertas
        })
        test(`Add all items to cart via products list`, async ({page}) => {
            const count = await page.locator('.inventory_item_name').count()
            for (let i = 0; i < count; i++) {
            await productsListPage.addProductToCart(i)
            }
            let addedProductNames = await page.locator('.inventory_item_name').allTextContents()
            await productsListPage.goToCart()
            cartPage = new CartPage(page)
            await cartPage.checkProductsInCart(addedProductNames) 
    })

        test(`Add items to cart via product preview`, async ({page}) => {
            for (let i = 0; i < howManyProductsAddToCart; i++) {
                await productsListPage.goToProductPreviewPage(i)
                productPreviewPage = new ProductPreviewPage(page)
                await productPreviewPage.addProductToCart()
                let addedProductName = await page.locator('.inventory_details_name').allTextContents()
                await productPreviewPage.goToCart()
                cartPage = new CartPage(page)
                await cartPage.isProductInCart(addedProductName, i)
                await cartPage.goToProductsListPage()
            }
        })
    })

    test.describe('Check all "Remove" buttons', async () => {
        let howManyProductsAddedToCart = 4 //1-6

        test('Check "Remove" buttons in products list', async () => {
            for (let i = 0; i < howManyProductsAddedToCart; i++) {
                await productsListPage.addProductToCart(i)
                await productsListPage.isButtonAdded('Remove', i)
            }
        })

        test('Check "Remove" buttons in product preview', async ({page}) => {
            for (let i = 0; i < howManyProductsAddedToCart; i++) {
                await productsListPage.goToProductPreviewPage(i)
                productPreviewPage = new ProductPreviewPage(page)
                await productPreviewPage.addProductToCart()
                await productPreviewPage.isButtonAdded('Remove', 'all')
                await productPreviewPage.goToProductsListPage()
            }
        })

        test('Check "Remove" buttons in cart', async ({page}) => {
            for (let i = 0; i < howManyProductsAddedToCart; i++) {
                await productsListPage.addProductToCart(i)
            }
            await productsListPage.goToCart()
            cartPage = new CartPage(page)
            await productsListPage.isButtonAdded('Remove', 'all')
        })
    })

    test.describe('Remove items from cart', async () => {
        let howManyProductsAddedToCart = 4 //1-6

        test('Remove an item from cart via products list', async ({page}) => {
            for (let i = 0; i < howManyProductsAddedToCart; i++) {
                await productsListPage.addProductToCart(i)
            }
            let firstAddedProductName = await page.locator('.inventory_item_name').nth(0).allTextContents()
            await productsListPage.removeProductFromCart(0)
            await productsListPage.goToCart()
            cartPage = new CartPage(page)
            await cartPage.isProductRemoved(firstAddedProductName, 0)
        })

        test('Remove an item from cart via product preview', async ({page}) => {
            for (let i = 0; i < howManyProductsAddedToCart; i++) {
                await productsListPage.goToProductPreviewPage(i)
                productPreviewPage = new ProductPreviewPage(page)
                await productPreviewPage.addProductToCart()
                await productPreviewPage.goToProductsListPage()
            }
            await productsListPage.goToProductPreviewPage(0)
            let firstAddedProductName = await page.locator('.inventory_details_name').allTextContents()
            await productPreviewPage.removeProductFromCart()
            await productsListPage.goToCart()
            cartPage = new CartPage(page)
            await cartPage.isProductRemoved(firstAddedProductName, 0)
        })

        test('Remove an item from cart via cart', async ({page}) => {
            for (let i = 0; i < howManyProductsAddedToCart; i++) {
                await productsListPage.addProductToCart(i)
            }
            let firstAddedProductName = await page.locator('.inventory_item_name').nth(0).allTextContents()
            await productsListPage.goToCart()
            cartPage = new CartPage(page)
            await cartPage.removeProductFromCart(0)
            await cartPage.isProductRemoved(firstAddedProductName, 0)
        });
    })
})

