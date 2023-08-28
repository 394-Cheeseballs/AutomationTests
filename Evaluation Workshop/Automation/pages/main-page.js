export class MainPage{

    constructor(page) {
      this.page = page;
    }
  
    async addFoodToCart(foodLocator) {
        await this.page.locator(foodLocator).click()
    }

    async removeFoodFromCart() {
      await this.page.locator('i.v-icon--link').click()
    }
}