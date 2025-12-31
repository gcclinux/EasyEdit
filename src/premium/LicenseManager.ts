// src/premium/LicenseManager.ts

class LicenseManager {
  private static instance: LicenseManager;
  private activeLicense: boolean = false;
  private checking: boolean = false;
  private API_ENDPOINT = 'https://easyeditoror-premium.web.app/api/check-license'; // Placeholder

  private constructor() {}

  public static getInstance(): LicenseManager {
    if (!LicenseManager.instance) {
      LicenseManager.instance = new LicenseManager();
    }
    return LicenseManager.instance;
  }

  public async initialize(): Promise<void> {
    // Avoid multiple checks at the same time
    if (this.checking) {
      return;
    }
    this.checking = true;
    await this.checkLicenseStatus();
    this.checking = false;
  }

  public hasActiveLicense(): boolean {
    return this.activeLicense;
  }

  private async checkLicenseStatus(): Promise<void> {
    try {
      // In a real application, you would get a unique user/device ID
      const userId = await this.getUniqueUserId();
      const response = await fetch(`${this.API_ENDPOINT}?userId=${userId}`);

      if (response.ok) {
        const data = await response.json();
        this.activeLicense = data.hasActiveLicense === true;
      } else {
        this.activeLicense = false;
      }
    } catch (error) {
      console.error('Error checking license status:', error);
      this.activeLicense = false;
    }
  }

  // This is a placeholder. In a real app, you would use a more robust
  // way to identify the user or device.
  private async getUniqueUserId(): Promise<string> {
    let userId = localStorage.getItem('easyeditor-user-id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('easyeditor-user-id', userId);
    }
    return userId;
  }
}

export default LicenseManager.getInstance();
