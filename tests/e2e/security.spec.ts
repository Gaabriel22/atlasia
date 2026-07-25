import { expect, test } from "@playwright/test"

test("publishes restrictive security headers without breaking the catalog", async ({
  page,
  request,
}) => {
  const cspViolations: string[] = []
  page.on("console", (message) => {
    if (message.text().includes("Content Security Policy")) {
      cspViolations.push(message.text())
    }
  })

  const response = await request.get("/pt-BR")
  const headers = response.headers()

  expect(headers["content-security-policy"]).toContain(
    "img-src 'self' https://flags.restcountries.com",
  )
  expect(headers["content-security-policy"]).toContain("frame-src 'none'")
  expect(headers["content-security-policy"]).not.toContain("blob:")
  expect(headers["content-security-policy"]).not.toContain("data:")
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin")
  expect(headers["x-content-type-options"]).toBe("nosniff")
  expect(headers["x-frame-options"]).toBe("DENY")
  expect(headers["x-powered-by"]).toBeUndefined()

  await page.goto("/pt-BR")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.locator("main img").first()).toBeVisible()
  expect(cspViolations).toEqual([])
})
