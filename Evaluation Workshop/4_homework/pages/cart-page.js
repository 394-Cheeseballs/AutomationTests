import { test, expect } from '@playwright/test';

export class CartPage{

    constructor(page) {
      this.page = page;
    }
  
    async goToProductsListPage() {
        await this.page.locator('#continue-shopping').click()
        await expect(this.page.locator('.title')).toHaveText('Products') 
    }

    /**
     * 
     * @param {string} buttonText 
     * @param {*} nthButton button number or 'all'
     */
    async isButtonAdded(buttonText, nthButton) {
        if (nthButton === 'all') {
        for (let i = 0; i < this.page.locator('button.btn_small').count; i++) {
            await expect(this.page.locator('button.btn_small').nth(i)).toBeVisible()
            await expect(this.page.locator('button.btn_small').nth(i)).toHaveText(buttonText)
        }
        }
        else {
        await expect(this.page.locator('button.btn_small').nth(nthButton)).toBeVisible()
        await expect(this.page.locator('button.btn_small').nth(nthButton)).toHaveText(buttonText)
        }
    }

    async isProductInCart(addedProductName, nthProduct) {
        await expect(this.page.locator('.cart_quantity').nth(nthProduct)).toHaveText('1')
        await expect(this.page.locator('.inventory_item_name').nth(nthProduct)).toHaveText(addedProductName)
    }

    async checkProductsInCart(addedProductName) {
        for (let i = 0; i < 6; i++) {
        await expect(this.page.locator('.cart_quantity').nth(i)).toHaveText('1')
        await expect(this.page.locator('.inventory_item_name').nth(i)).toHaveText(addedProductName[i])
        }
    }

    async removeProductFromCart(nthProduct) {
        await this.page.locator('button.btn_small').nth(nthProduct).click()
    }

    async isProductRemoved(removedProductName, nthProduct) {
        await expect(this.page.locator('.inventory_item_name').nth(nthProduct)).not.toHaveText(removedProductName)
    }
  }