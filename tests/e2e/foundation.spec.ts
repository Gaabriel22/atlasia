import { expect, test } from "@playwright/test"

test("renders the application shell @smoke", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("main")).toBeVisible()
})
