import { test, expect, type Page } from "@playwright/test";

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}
test("mobile shopping, persistent discount, checkout and OTP account", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/products/iphone-16-pro");
  await expect(
    page.getByRole("heading", { name: "آیفون ۱۶ پرو", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /مشکی.*ناموجود/ }).click();
  await expect(
    page.getByRole("button", { name: "ناموجود", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: /تیتانیوم صحرایی/ }).click();
  await page
    .getByRole("button", { name: "افزودن به علاقه‌مندی", exact: true })
    .click();
  await page.getByRole("button", { name: "مقایسه محصول", exact: true }).click();
  await page
    .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
    .click();
  await page.goto("/cart");
  await page.reload();
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await page.getByLabel("کد تخفیف", { exact: true }).fill("ABI10");
  await page.getByRole("button", { name: "اعمال", exact: true }).click();
  const discounted = await page.locator(".summary-total strong").innerText();
  await page.getByRole("link", { name: "ادامه و ثبت سفارش" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.reload();
  await expect(page.locator(".summary-total strong")).toHaveText(discounted);
  await expect(page.getByLabel("کد تخفیف", { exact: true })).toHaveValue(
    "ABI10",
  );
  await page.getByRole("button", { name: "پر کردن اطلاعات نمونه" }).click();
  await page.getByRole("checkbox", { name: /می‌دانم این سفارش/ }).check();
  await noOverflow(page);
  await page
    .getByRole("button", { name: "ثبت سفارش نمایشی", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "سفارش آزمایشی‌ات ثبت شد." }),
  ).toBeVisible();
  await expect(page.locator(".confirmation .panel")).toContainText(discounted);
  await page.getByRole("link", { name: "مشاهده سفارش", exact: true }).click();
  await page.getByRole("button", { name: "دریافت کد نمایشی" }).click();
  await page.getByLabel("کد یک‌بارمصرف (OTP) نمایشی").fill("۱۲۳۴۵۶");
  await page.getByRole("button", { name: "تأیید و ورود نمایشی" }).click();
  await expect(page.locator(".account-main")).toContainText(discounted);
  await page.goto("/account/wishlist");
  await expect(page.locator(".account-products .product-card")).toHaveCount(1);
  await page.goto("/compare");
  await page.getByLabel("انتخاب گوشی برای مقایسه").selectOption("galaxy-a55");
  await expect(page.locator(".comparison thead img")).toHaveCount(2);
  await page.getByRole("checkbox", { name: "فقط تفاوت‌ها" }).check();
  await noOverflow(page);
  await page.screenshot({
    path: "test-results/mobile-compare.png",
    fullPage: true,
  });
});

test("URL filters, Latin search, mobile drawer focus and assistant fallback", async ({
  page,
}) => {
  await page.goto("/products?q=iphone");
  await expect(page.locator(".listing-products .product-card")).toHaveCount(4);
  await page.goto("/products?brand=Samsung&max=40000000&stock=1&sort=low");
  await expect(page.locator(".listing-products .product-card")).toHaveCount(2);
  await expect(
    page.locator(".listing-products .product-card").first(),
  ).toContainText("A55");
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole("button", { name: "فیلترها", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "فیلتر محصولات" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "فیلترها", exact: true }),
  ).toBeFocused();
  await noOverflow(page);
  await page.goto("/assistant");
  await page.getByRole("button", { name: "پیشنهادهای من را پیدا کن" }).click();
  await expect(page.locator(".assistant-results .product-card")).toHaveCount(3);
  await page
    .getByRole("checkbox", { name: /مرتب‌سازی با هوش مصنوعی زنده/ })
    .check();
  await page.getByRole("button", { name: "پیشنهادهای من را پیدا کن" }).click();
  await expect(
    page.getByText("اتصال زنده تنظیم نشده؛ پیشنهاد نمایشی آماده است.", {
      exact: true,
    }),
  ).toBeVisible();
  await noOverflow(page);
});

test("admin product and article creation, previews, edit, confirmation and reset", async ({
  page,
}) => {
  await page.goto("/admin/products");
  await page.getByRole("button", { name: "ورود به پنل نمایشی" }).click();
  await page
    .getByRole("button", { name: "لوازم جانبی جدید", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("نام محصول *", { exact: true })
    .fill("کابل آزمایشی ارائه");
  await dialog
    .getByLabel("نامک انگلیسی *", { exact: true })
    .fill("presentation-cable");
  await dialog
    .getByLabel("متن جایگزین تصویر *", { exact: true })
    .fill("تصویر انتخاب نشده برای کابل نمونه");
  await dialog
    .getByLabel("توضیحات محصول *", { exact: true })
    .fill("کابل ساختگی برای بررسی گردش کار مدیریت و پیش‌نمایش.");
  await dialog
    .getByLabel("مشخصات فنی", { exact: true })
    .fill("نوع اتصال: USB-C\nسازگاری: دستگاه‌های نمونه");
  await dialog
    .getByLabel("عنوان سئو", { exact: true })
    .fill("کابل آزمایشی | آبی");
  await dialog
    .getByRole("button", { name: "ذخیره محصول", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.reload();
  await page
    .getByLabel("جست‌وجوی محصولات", { exact: true })
    .fill("کابل آزمایشی ارائه");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page
    .getByRole("link", { name: "پیش‌نمایش کابل آزمایشی ارائه" })
    .click();
  await expect(
    page.getByRole("heading", { name: "کابل آزمایشی ارائه", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "کابل آزمایشی ارائه", exact: true }),
  ).toBeVisible();
  await page.goto("/admin/products");
  await page.getByRole("button", { name: "ویرایش کابل آزمایشی ارائه" }).click();
  await page.getByLabel("قیمت (تومان) *", { exact: true }).fill("222000");
  await page.getByRole("button", { name: "ذخیره محصول", exact: true }).click();
  await page
    .getByRole("button", { name: "حذف کابل آزمایشی ارائه", exact: true })
    .click();
  await page.getByRole("button", { name: "انصراف", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "ویرایش کابل آزمایشی ارائه" }),
  ).toBeVisible();
  await page.goto("/admin/articles");
  await page.getByRole("button", { name: "مقاله جدید", exact: true }).click();
  await page
    .getByLabel("عنوان مقاله *", { exact: true })
    .fill("راهنمای آزمایشی ارائه");
  await page
    .getByLabel("نامک انگلیسی *", { exact: true })
    .fill("presentation-guide");
  await page
    .getByLabel("متن جایگزین تصویر *", { exact: true })
    .fill("تصویر راهنمای نمونه");
  await page
    .getByLabel("خلاصه مقاله *", { exact: true })
    .fill("خلاصه‌ای برای بررسی پیش‌نمایش محلی مجله.");
  await page
    .getByLabel("متن مقاله *", { exact: true })
    .fill(
      "برای انتخاب کابل، ابتدا نوع اتصال و توان دستگاه را بررسی کنید.\n\nمتن <script>alert(1)</script> باید به صورت متن نمایش داده شود.",
    );
  await page.getByRole("button", { name: "ذخیره مقاله", exact: true }).click();
  await page
    .getByRole("link", { name: "پیش‌نمایش راهنمای آزمایشی ارائه" })
    .click();
  await expect(
    page.getByRole("heading", { name: "راهنمای آزمایشی ارائه", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/متن <script>/)).toBeVisible();
  await page.goto("/admin/settings");
  await page
    .getByRole("button", { name: "بازنشانی داده‌ها", exact: true })
    .click();
  await page.getByRole("button", { name: "بله، بازنشانی همه داده‌ها" }).click();
  await expect(
    page.getByRole("button", { name: "ورود به پنل نمایشی" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "ورود به پنل نمایشی" }).click();
  await page.goto("/admin/products");
  await expect(page.locator("tbody tr")).toHaveCount(32);
  await page.setViewportSize({ width: 360, height: 800 });
  await noOverflow(page);
  await page.screenshot({
    path: "test-results/mobile-admin.png",
    fullPage: true,
  });
});

test("presentation screenshots, initial content, assets and reduced motion", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".hero")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator(".hero-product")
    .evaluate((img: HTMLImageElement) => img.decode());
  await expect(page.locator(".hero canvas")).toHaveCount(0);
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  await page.screenshot({
    path: "test-results/desktop-home.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 360, height: 800 });
  await noOverflow(page);
  await page.screenshot({ path: "test-results/mobile-hero.png" });
  await page.screenshot({
    path: "test-results/mobile-home.png",
    fullPage: true,
  });
  await page.goto("/products/iphone-16-pro");
  await page.screenshot({
    path: "test-results/mobile-product.png",
    fullPage: true,
  });
  await noOverflow(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({
    path: "test-results/desktop-product.png",
    fullPage: true,
  });
  const response = await request.get("/products/iphone-16-pro");
  expect(await response.text()).toContain("آیفون ۱۶ پرو");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  for (const route of [
    "/blog",
    "/account",
    "/admin",
    "/about",
    "/faq",
    "/delivery",
    "/returns",
    "/policy",
    "/contact",
    "/credits",
  ]) {
    await page.goto(route);
    await noOverflow(page);
  }
  expect(errors).toEqual([]);
});

test("Google simulation, profile, addresses and settings survive refresh", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/account");
  await page.getByRole("button", { name: "شبیه‌سازی ورود با گوگل" }).click();
  await page
    .getByLabel("نام نمایشی", { exact: true })
    .fill("کاربر نمونه ارائه");
  await page
    .getByRole("button", { name: "ذخیره اطلاعات", exact: true })
    .click();
  await page.reload();
  await expect(page.getByLabel("نام نمایشی", { exact: true })).toHaveValue(
    "کاربر نمونه ارائه",
  );
  await page.goto("/account/addresses");
  await page.getByRole("button", { name: "نشانی جدید", exact: true }).click();
  await page.getByLabel("عنوان", { exact: true }).fill("دفتر نمونه");
  await page
    .getByLabel("نشانی ساختگی", { exact: true })
    .fill("تهران، خیابان نمونه، پلاک آزمایشی ۱");
  await page.getByLabel("کد پستی", { exact: true }).fill("۱۱۱۱۱۱۱۱۱۱");
  await page.getByRole("button", { name: "ذخیره نشانی", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "دفتر نمونه" })).toBeVisible();
  await noOverflow(page);
  await page.getByRole("button", { name: "ویرایش دفتر نمونه" }).click();
  await page.getByLabel("عنوان", { exact: true }).fill("دفتر ویرایش‌شده");
  await page.getByRole("button", { name: "ذخیره نشانی", exact: true }).click();
  await page.getByRole("button", { name: "حذف دفتر ویرایش‌شده" }).click();
  await page
    .getByRole("dialog", { name: "حذف نشانی" })
    .getByRole("button", { name: "حذف نشانی", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "دفتر ویرایش‌شده" }),
  ).toHaveCount(0);
  await page.goto("/account/settings");
  await page.getByRole("checkbox").check();
  await page.reload();
  await expect(page.getByRole("checkbox")).toBeChecked();
});
