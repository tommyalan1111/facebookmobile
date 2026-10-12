import { ChainablePromiseElement } from 'webdriverio';

class LoginPage {
  get emailInput(): ChainablePromiseElement {
    return $('android=new UiSelector().className("android.widget.EditText").instance(0)');
  }

  get passwordInput(): ChainablePromiseElement {
    return $('android=new UiSelector().className("android.widget.EditText").instance(1)');
  }

  get loginButton(): ChainablePromiseElement {
    return $('android=new UiSelector().text("Log in")');
  }

  get popupOkButton(): ChainablePromiseElement {
    return $('android=new UiSelector().text("OK")');
  }

  // Nút Cancel trên Google Password Manager popup
  get cancelGooglePopup(): ChainablePromiseElement {
    return $('android=new UiSelector().text("Cancel")');
  }

  async closeGooglePasswordManager(): Promise<void> {
    try {
      if (await this.cancelGooglePopup.isDisplayed()) {
        await this.cancelGooglePopup.click();
        await browser.pause(1000);
      }
    } catch (e) {
      // Bỏ qua nếu không có popup
    }
  }

  popupMessage(keyword: string): ChainablePromiseElement {
    return $(`android=new UiSelector().textContains("${keyword}")`);
  }

  // >>> ĐẶT HÀM NÀY VÀO ĐÂY <<<
  loginErrorMessage(errorText: string): ChainablePromiseElement {
    return $(`android=new UiSelector().textContains("${errorText}")`);
  }

  async clickLogin(): Promise<void> {
    await this.closeGooglePasswordManager();
    await this.loginButton.click();
  }

  async dismissPopup(): Promise<void> {
    try {
      if (await this.popupOkButton.isDisplayed()) {
        await this.popupOkButton.click();
      }
    } catch (e) {}
  }
}

export default new LoginPage();