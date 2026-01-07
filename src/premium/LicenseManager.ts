// src/premium/LicenseManager.ts

class LicenseManager {
  private static instance: LicenseManager;
  private activeLicense: boolean = false;
  private checking: boolean = false;
  private API_ENDPOINT = 'https://easyeditor-premium.web.app/api/check-license';
  private STORAGE_KEY_EMAIL = 'easyeditor-user-email';
  private STORAGE_KEY_DATE = 'easyeditor-user-purchase-date';

  private constructor() { }

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

  public async setLicenseData(email: string, purchaseDate: string): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY_EMAIL, email);
    localStorage.setItem(this.STORAGE_KEY_DATE, purchaseDate);
    await this.checkLicenseStatus();
  }

  public getStoredEmail(): string | null {
    return localStorage.getItem(this.STORAGE_KEY_EMAIL);
  }

  public getStoredPurchaseDate(): string | null {
    return localStorage.getItem(this.STORAGE_KEY_DATE);
  }

  private async checkLicenseStatus(): Promise<void> {
    const email = this.getStoredEmail();
    const purchaseDate = this.getStoredPurchaseDate();

    if (!email || !purchaseDate) {
      this.activeLicense = false;
      return;
    }

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purchaseDate }),
      });

      if (response.ok) {
        const data = await response.json();
        // Check for "True" string or true boolean, based on the PowerShell output "True"
        // The user example showed "True", usually JSON returns boolean true/false but PowerShell might format it. 
        // Assuming standard JSON boolean from web API, but being safe.
        this.activeLicense = data.hasActiveLicense === true || data.hasActiveLicense === 'True';
      } else {
        this.activeLicense = false;
      }
    } catch (error) {
      console.error('Error checking license status:', error);
      this.activeLicense = false;
    }
  }
}

export default LicenseManager.getInstance();
