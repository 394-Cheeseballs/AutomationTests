import { test, expect } from '@playwright/test';

export class ProductsListPage{

  constructor(page) {
    this.page = page;
    this.itemNameDiv = page.locator('div[class="inventory_item_name"]')
    this.itemPriceDiv = page.locator('div[class="inventory_item_price"]')
  }


  async verifyDropdownOptions(sortingOptionList) {
    let list = await this.page.locator('.product_sort_container option').allTextContents();
    await expect(list).toStrictEqual(sortingOptionList)
  }


  async selectSortingOption(optionName) {
    await this.page.locator('.product_sort_container').selectOption(optionName);
  }


  // Below there are functions that can be used to verify if items are sorted as expected
  // It is just an example, any other solution is welcome as well 
  // (you can use what is provided or write your own)

  /**
   * Checks if products are sorted properly by name
   * @param {boolean} asc true if list should be sorted in ascending order, else false
   * @returns {boolean} true if list is sorted in correct order
   */
    async isListSortedByName(asc) {
      let list = await this.itemNameDiv.allTextContents();
      
      return await this.isListSorted(list, asc);
    }

  /**
   * Checks if products are sorted properly by price
   * @param {boolean} asc true if list should be sorted in ascending order, else false
   * @returns {boolean} true if list is sorted in correct order
   */
  async isListSortedByPrice(asc) {
    let list = await this.itemPriceDiv.allTextContents();
    list.forEach((element, index) => {
      list[index] = parseFloat(element.slice(1));
    });

    return await this.isListSorted(list, asc);
  }

  /**
   * 
   * @param {Array} list list of elements to check 
   * @param {boolean} asc condition to check. True if should be sorted in ascending order, else false
   * @returns True if list sorted as expected, else false
   */
  async isListSorted(list, asc){
    return list.every(function(num, idx, arr) {
      if(asc === true){
        return (num <= arr[idx + 1]) || (idx === arr.length - 1) ? true : false;
      }
      return (num >= arr[idx + 1]) || (idx === arr.length - 1) ? true : false;
    });
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

  async goToProductPreviewPage(nthProduct) {
    await this.page.locator('.inventory_item_label > a').nth(nthProduct).click()
    await expect(this.page.locator('#back-to-products')).toHaveText('Back to products')  
  }

  async addProductToCart(nthProduct) {
    await expect(this.page.locator('button.btn_small').nth(nthProduct)).toHaveText('Add to cart')
    await this.page.locator('button.btn_small').nth(nthProduct).click()
  }

  async goToCart() {
    await this.page.locator('.shopping_cart_link').click()
    await expect(this.page.locator('.title')).toHaveText('Your Cart')    
  }

  async removeProductFromCart(nthProduct) {
    await expect(this.page.locator('button.btn_small').nth(nthProduct)).toHaveText('Remove')
    await this.page.locator('button.btn_small').nth(nthProduct).click()
  }
}