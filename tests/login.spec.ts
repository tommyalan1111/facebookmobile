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

  it('TC4: Click nút Forgot password? -> Open Find your account screen', async () => {
    console.log('Chạy TC4...');
    await loginPage.closeGooglePasswordManager();
    await loginPage.clearInputs();
    await loginPage.forgotPasswordButton.click();

    const forgotPasswordScreen = await $('~Find your account');
    await expect(forgotPasswordScreen).toBeDisplayed();

    await loginPage.backButton.click();
    await browser.pause(1500);
  });

  it('TC5: Click nút Create new account -> Open Sign up screen', async () => {
    console.log('Chạy TC5...');
    await loginPage.closeGooglePasswordManager();
    await loginPage.clearInputs();
    await loginPage.createNewAccountButton.click();

    // Check if Sign up screen is displayed by finding title text or "Get started" button
    const getStartedButton = $('android=new UiSelector().text("Get started")');
    await getStartedButton.waitForDisplayed({ timeout: 10000 });
    await expect(getStartedButton).toBeDisplayed();

    // Click on back button to go back to Login screen
    await browser.back();

    // Chờ popup xác nhận "Do you want to stop creating your account" hiện lên
    const popupMessage = loginPage.popupMessage('Do you want to stop creating your account');
    await popupMessage.waitForDisplayed({ timeout: 10000 });
    await expect(popupMessage).toBeDisplayed();

    // Bấm nút "Stop creating account" trên popup
    const stopCreatingButton = $('android=new UiSelector().text("Stop creating account")');
    await stopCreatingButton.click();

    // SỬA LẠI ĐOẠN NÀY (Bỏ chữ const thừa)
    await loginPage.loginButton.waitForDisplayed({ timeout: 10000 });
    await expect(loginPage.loginButton).toBeDisplayed();
  });

  it('TC6: Đổi ngôn ngữ từ tiếng Anh sang Tiếng Việt thành công', async () => {
    console.log('Chạy TC6...');
    await loginPage.closeGooglePasswordManager();
    await loginPage.clearInputs();

    // 1. Click vào dropdown ngôn ngữ ở đầu màn hình
    const langDropdown = $('android=new UiSelector().textContains("English")');
    await langDropdown.waitForDisplayed({ timeout: 10000 });
    await langDropdown.click();

    // 2. Chờ popup "Select your language" hiện lên và chọn "Tiếng Việt"
    const selectLanguageTitle = $('android=new UiSelector().text("Select your language")');
    await selectLanguageTitle.waitForDisplayed({ timeout: 10000 });
    await expect(selectLanguageTitle).toBeDisplayed();

    const vietnameseOption = $('android=new UiSelector().text("Tiếng Việt")');
    await vietnameseOption.click();

    // 3. Kiểm tra xem giao diện đã chuyển về tiếng Việt chưa (ví dụ: nút "Log in" đổi thành "Đăng nhập")
    const loginButtonVi = $('android=new UiSelector().text("Đăng nhập")');
    await loginButtonVi.waitForDisplayed({ timeout: 10000 });
    await expect(loginButtonVi).toBeDisplayed();

    // (Tùy chọn) Đổi lại tiếng Anh để dọn dẹp trạng thái nếu cần, hoặc giữ nguyên
    const langDropdownVi = $('android=new UiSelector().text("Tiếng Việt")');
    await langDropdownVi.waitForDisplayed({ timeout: 10000 });
    await langDropdownVi.click();

    const englishOption = $('android=new UiSelector().text("English (US)")');
    await englishOption.waitForDisplayed({ timeout: 10000 });
    await englishOption.click();

    const loginButtonEnglish = $('android=new UiSelector().text("Log in")');
    await loginButtonEnglish.waitForDisplayed({ timeout: 10000 });
    await expect(loginButtonEnglish).toBeDisplayed();
    
  });
});