import loginPage from '../pages/loginPage';

describe('Facebook Login - Authentication & Validation Suite', () => {

  before(async () => {
    await browser.pause(2000);
    await loginPage.closeGooglePasswordManager();
  });

  beforeEach(async () => {
    await loginPage.closeGooglePasswordManager();
    await loginPage.dismissPopup();
  });

  it('TC1: Để trống cả Username và Password -> Click Log in', async () => {
    console.log('Chạy TC1...');
    await loginPage.closeGooglePasswordManager();
    await loginPage.clearInputs();
    await loginPage.clickLogin();

    const errorMsg = loginPage.popupMessage('email');
    await errorMsg.waitForDisplayed({ timeout: 10000 });
    await expect(errorMsg).toBeDisplayed();

    await loginPage.dismissPopup();
    await browser.pause(1500);
  });

  it('TC2: Để trống Username, chỉ nhập Password -> Click Log in', async () => {
    console.log('Chạy TC2...');
    await loginPage.closeGooglePasswordManager();
    await loginPage.clearInputs();
    
    await loginPage.passwordInput.click();
    await loginPage.closeGooglePasswordManager();
    await loginPage.passwordInput.setValue('dai_gia_mat_khau');
    await loginPage.clickLogin();

    const errorMsg = loginPage.popupMessage('email');
    await errorMsg.waitForDisplayed({ timeout: 10000 });
    await expect(errorMsg).toBeDisplayed();
    
    await loginPage.dismissPopup();
    await browser.pause(1500);
  });

  it('TC3: Nhập Username bậy bạ, để trống Password -> Click Log in', async () => {
    console.log('Chạy TC3...');
    await loginPage.closeGooglePasswordManager();
    await loginPage.clearInputs();

    // Nhập một email giả lập bất kỳ để tránh kích hoạt Google Password Manager thật
    await loginPage.emailInput.click();
    await loginPage.closeGooglePasswordManager();
    await loginPage.emailInput.setValue('random_user_999@test.com');
    
    await loginPage.closeGooglePasswordManager();
    await loginPage.clickLogin();

    // Dùng hàm loginErrorMessage hoặc bắt chính xác thông báo lỗi nhập password của app
    const errorMsg = loginPage.loginErrorMessage('password');
    await errorMsg.waitForDisplayed({ timeout: 10000 });
    await expect(errorMsg).toBeDisplayed();

    await loginPage.dismissPopup();
    await browser.pause(1500);
  });

});