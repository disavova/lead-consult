import { expect } from "@playwright/test";
import { BASE_URL } from "./constants";

export class NavigationPage {
  private page: any;
  private servicesLink: any;
  private customersLink: any;
  private aboutUsButton: any;
  private ourCompanyLink: any;

  constructor(page: any) {
    this.page = page;
    this.aboutUsButton = page.locator("#menu-item-5815").getByText("About us");
    this.servicesLink = page.getByRole("link", { name: "Services" });
    this.customersLink = page.getByRole("link", { name: "Customers" });
    this.ourCompanyLink = page.getByRole("link", { name: "Our Company" });
  }

  async goTo() {
    await this.page.goto(BASE_URL);
  }

  async openServicesPage() {
    await this.servicesLink.first().click();
    await expect(this.page).toHaveURL(`${BASE_URL}/services/`);
  }

  async openCustomersPage() {
    await this.customersLink.first().click();
    await expect(this.page).toHaveURL(`${BASE_URL}/customers/`);
  }

  async openAboutUsPage() {
    await this.aboutUsButton.first().hover();
    await this.page.getByRole("link", { name: "Our Company" }).click();
    await expect(this.page).toHaveURL(`${BASE_URL}/about-us/`);
  }
}
