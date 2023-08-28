import { test, expect } from '@playwright/test';

export class ProductPreviewPage{

    constructor(page) {
      this.page = page;
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
    
    async goToProductsListPage() {
        await this.page.locator('#back-to-products').click()
        await expect(this.page.locator('.title')).toHaveText('Products') 
    }

    async goToCart() {
        await this.page.locator('.shopping_cart_link').click()
        await expect(this.page.locator('.title')).toHaveText('Your Cart')   
      }

    async addProductToCart() {
        await expect(this.page.locator('button.btn_small')).toHaveText('Add to cart')
        await this.page.locator('button.btn_small').click()
    }

    async removeProductFromCart() {
        await expect(this.page.locator('button.btn_small')).toHaveText('Remove')
        await this.page.locator('button.btn_small').click()
    }
  }