import { ChainablePromiseElement } from 'webdriverio';
import { execSync } from 'child_process';

class LoginPage {
  get emailInput(): ChainablePromiseElement {
    return $('android=new UiSelector().className("android.widget.EditText").instance(0)');
  }

  get passwordInput(): ChainablePromiseElement {
    return $('android=new UiSelector().className("android.widget.EditText").instance(1)');
  }

  get loginButton(): ChainablePromiseElement {
    return $('~Log in');
  }

  get forgotPasswordButton(): ChainablePromiseElement {
    return $('~Forgot password?');
  }

  get createNewAccountButton(): ChainablePromiseElement {
    return $('~Create new account');
  }

  get languageDropdown(): ChainablePromiseElement {
    return $('android=new UiSelector().className("android.widget.Spinner")');
  }

  languageOption(language: string): ChainablePromiseElement {
    return $(`android=new UiSelector().text("${language}")`, { strict: false });
  }

  get backButton(): ChainablePromiseElement {
    return $('~Back');
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
      // Kiểm tra xem có popup CredentialChooserActivity hoặc autofill của Google che không
      const dump = execSync('adb shell dumpsys window').toString();
      if (
        dump.includes('CredentialChooserActivity') ||
        dump.includes('com.google.android.gms.identitycredentials') ||
        dump.includes('autofill_dialog_picker') ||
        dump.includes('Use your saved password')
      ) {
        execSync('adb shell input keyevent 4');
        await browser.pause(1000);
        return;
      }
    } catch (e) {}

    try {
      const closeBtn = $('~Close');
      if (await closeBtn.isExisting()) {
        await closeBtn.click();
        await browser.pause(1000);
      }
    } catch (e) {}
  }

  popupMessage(keyword: string): ChainablePromiseElement {
    return $(`android=new UiSelector().textContains("${keyword}")`, { strict: false });
  }

  loginErrorMessage(errorText: string): ChainablePromiseElement {
    return $(`android=new UiSelector().textContains("${errorText}")`, { strict: false });
  }

  async clickLogin(): Promise<void> {
    await this.closeGooglePasswordManager();
    try {
      if (await browser.isKeyboardShown()) {
        await browser.hideKeyboard();
        await browser.pause(500);
      }
    } catch (e) {}

    try {
      if (await this.loginButton.isExisting()) {
        await this.loginButton.click();
        return;
      }
    } catch (e) {}

    const textBtn = $('android=new UiSelector().text("Log in")');
    await textBtn.click();
  }

  async dismissPopup(): Promise<void> {
    try {
      if (await this.popupOkButton.isDisplayed()) {
        await this.popupOkButton.click();
        await browser.pause(500);
        return;
      }
    } catch (e) {}

    try {
      const okIdBtn = $('android=new UiSelector().resourceId("android:id/button1")');
      if (await okIdBtn.isDisplayed()) {
        await okIdBtn.click();
        await browser.pause(500);
      }
    } catch (e) {}
  }

  async clearInputs(): Promise<void> {
    await this.closeGooglePasswordManager();
    try {
      const clearEmailBtn = $('~Clear Mobile number or email text');
      if (await clearEmailBtn.isExisting()) {
        await clearEmailBtn.click();
      } else if (await this.emailInput.isExisting()) {
        await this.emailInput.clearValue();
      }
    } catch (e) {}

    try {
      if (await this.passwordInput.isExisting()) {
        await this.passwordInput.clearValue();
      }
    } catch (e) {}
  }
}

export default new LoginPage();