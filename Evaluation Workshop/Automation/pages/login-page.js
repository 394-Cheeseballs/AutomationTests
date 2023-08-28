export class LoginPage{

    constructor(page) {
      this.page = page;
    }
  
    async navigateToLoginPage(loginPageURL) {
        await this.page.goto(loginPageURL)
    }

    async login(loginInformation) {
        await this.page.locator('div.v-input:nth-child(1) input:nth-child(2)').fill(loginInformation.email)
        await this.page.locator('div.v-input:nth-child(2) input:nth-child(2)').fill(loginInformation.password)
        await this.page.locator('div.v-btn__content').click()
    }

  }