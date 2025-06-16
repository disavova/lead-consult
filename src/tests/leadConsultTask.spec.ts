import { test, expect } from "@playwright/test";
import { NavigationPage } from "../helpers/utils/navigationPage";
import { BASE_URL } from "../helpers/utils/constants";

test.describe("Lead Consult task tests", () => {
  let navigationPage: NavigationPage;
  let page: any;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    navigationPage = new NavigationPage(page);
    await navigationPage.goTo();
  });
  test.afterEach(async () => {
    await page.context().close();
  });

  test("Navigate to Services page", async () => {
    await navigationPage.openServicesPage();

    // Verify page title
    await page.waitForSelector("h1");
    const heading = await page.locator("h1.heading_title");
    await expect(heading).toHaveText("Our Services");
  });

  test("Navigate to Customers page", async () => {
    await navigationPage.openCustomersPage();

    // Verify page title
    await page.waitForSelector("h1");
    const heading = await page.locator("h1.heading_title");
    await expect(heading).toHaveText("Our Customers");
  });

  test("Navigate to About Us page", async () => {
    await navigationPage.openAboutUsPage();

    // Verify page title
    await page.waitForSelector("h1");
    const heading = await page.locator("h1.heading_title");
    await expect(heading).toHaveText("About us");
  });

  test("Navigate back to Home page", async () => {
    await navigationPage.openServicesPage();
    await page.goBack();

    // Verify we are back on the home page
    await expect(page).toHaveURL(/\/$/);
    const homeHeading = await page.locator("h1.heading_title");
    await expect(homeHeading).toHaveText("LEAD BY EXAMPLE");
  });

  test("Extract Quality Assurance description and footer email", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/services`);

    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 200) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
    });
    const qaTitle = page.locator("h6.service-title", {
      hasText: "QUALITY ASSURANCE",
    });
    await expect(qaTitle).toHaveCount(1, { timeout: 10000 });
    await expect(qaTitle).toBeVisible({ timeout: 10000 });

    // Extract text
    const qaContainer = qaTitle.locator("xpath=..");
    const qaText = await qaContainer.textContent();

    // Scroll to bottom and get email
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const emailLocator = page.locator("#eeb-807137-295641");
    await expect(emailLocator).toBeVisible({ timeout: 5000 });
    const email = await emailLocator.textContent();

    // Output
    console.log("Text:\n", qaText?.trim());
    console.log("Email:", email?.trim());
  });

  test("Click Contact Us → Submit Empty Form → Validate Required Error", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/contact-us/`);

    // Wait for the contact form to appear
    await page.waitForSelector('input[name="your-name"]', { timeout: 5000 });

    // Click SEND without filling form
    const sendButton = page.locator('input[type="submit"][value="Send"]');
    await sendButton.scrollIntoViewIfNeeded();
    await sendButton.click();

    // Validate both "Your Name" and "Your Email" inputs have error state
    const nameInput = page.locator(
      '#wpcf7-f5661-p6126-o1 input[name="your-name"]'
    );
    const emailInput = page.locator(
      '#wpcf7-f5661-p6126-o1 input[name="your-email"]'
    );

    await expect(nameInput).toHaveAttribute("aria-invalid", "true");
    await expect(emailInput).toHaveAttribute("aria-invalid", "true");

    // Assert visible error message below each field
    const nameError = page.locator(
      'span.wpcf7-form-control-wrap[data-name="your-name"] span.wpcf7-not-valid-tip'
    );
    const emailError = page.locator(
      'span.wpcf7-form-control-wrap[data-name="your-email"] span.wpcf7-not-valid-tip'
    );

    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();

    await expect(nameError).toContainText("The field is required.");
    await expect(emailError).toContainText("The field is required.");
  });
});
