import { test, expect, type Page } from "@playwright/test";

async function home(page: Page) {
  await page.getByRole("button", { name: "返回桌面", exact: true }).click();
  await expect(page.locator(".app-screen:not([inert])")).toHaveCount(0);
}

test("romance production caches the real story and embedded photo for offline reload", async ({
  browser,
}) => {
  const context = await browser.newContext({
    serviceWorkers: "allow",
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: "轻触解锁" }).waitFor();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await context.setOffline(true);
    await page.reload();
    await page.getByRole("button", { name: "轻触解锁" }).click();
    await open(page, "微信");
    await page.locator(".wx-chat-row").filter({ hasText: "许愿" }).click();
    await page
      .locator(".skin-bubble")
      .filter({ hasText: "嗯，1024。第一次一起排练那天。" })
      .click();
    await home(page);
    await open(page, "相册");
    await page
      .getByRole("button", { name: "查看两把椅子，一张照片", exact: true })
      .click();
    const image = page.getByRole("img", {
      name: "两把椅子，一张照片",
      exact: true,
    });
    await expect
      .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
  } finally {
    await context.close();
  }
});

async function open(page: Page, name: string) {
  await page.getByRole("button", { name: "打开" + name, exact: true }).click();
  await expect(page.locator(".app-screen:not([inert])")).toHaveCSS(
    "transform",
    "none",
  );
}

function smsThread(page: Page, name: string) {
  return page.locator(".catalog-chat").filter({
    has: page.locator("strong", { hasText: new RegExp("^" + name + "$") }),
  });
}

for (const answer of [true, false]) {
  for (const [choice, ending] of [
    ["交还林池鱼，让她亲自赴约", "这次不是顺路"],
    ["在值班台等两个人一起来取", "明天也一起走"],
  ]) {
    test(`romance: ${answer ? "answer" : "decline"}, ${ending}, persisted ending`, async ({
      page,
      request,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width: 390, height: 844 });
      const work = await (await request.get("/work.json")).json();
      expect(work.id).toBe("lin-chiyu-first-crush");
      expect(work.phone.owner).toBe("林池鱼");
      await page.goto("/");
      await page.getByRole("button", { name: "轻触解锁" }).click();
      await open(page, "信息");
      await expect(smsThread(page, "王橹杰")).toHaveCount(0);
      await smsThread(page, "许愿").click();
      await expect(page.locator(".sms-bubbles")).toContainText("它是林池鱼的");
      await home(page);
      await open(page, "备忘录");
      await expect(
        page.locator(".notes-list button").filter({ hasText: "先别告诉他" }),
      ).toHaveCount(0);
      await home(page);
      await open(page, "微信");
      await page.locator(".wx-chat-row").filter({ hasText: "王橹杰" }).click();
      await expect(page.locator(".skin-messages")).toContainText(
        "那你答不答应嘛",
      );
      await page
        .locator(".skin-bubble")
        .filter({ hasText: "那你答不答应嘛" })
        .scrollIntoViewIfNeeded();
      await page
        .locator(".phone-screen")
        .screenshot({ path: `outputs/romance/chat-${answer}-${ending}.png` });
      await home(page);
      await open(page, "微信");
      await page.locator(".wx-chat-row").filter({ hasText: "许愿" }).click();
      await page
        .locator(".skin-bubble")
        .filter({ hasText: "嗯，1024。第一次一起排练那天。" })
        .click();
      await home(page);

      async function photo() {
        await open(page, "相册");
        await page
          .getByRole("button", { name: "查看两把椅子，一张照片", exact: true })
          .click();
        const image = page.getByRole("img", {
          name: "两把椅子，一张照片",
          exact: true,
        });
        await expect(image).toBeVisible();
        await expect
          .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth))
          .toBeGreaterThan(0);
        await page.locator(".phone-screen").screenshot({
          path: `outputs/romance/photo-${answer}-${ending}.png`,
        });
      }

      async function diary() {
        await open(page, "备忘录");
        await page
          .locator(".notes-list button")
          .filter({ hasText: "先别告诉他" })
          .click();
        await page.getByPlaceholder("内容密码").fill("0000");
        await page
          .getByRole("button", { name: "解锁内容", exact: true })
          .click();
        await expect(
          page.getByText("密码不正确", { exact: true }),
        ).toBeVisible();
        await expect(page.locator(".incoming-call-screen")).toHaveCount(0);
        await page.getByPlaceholder("内容密码").fill("1024");
        await page
          .getByRole("button", { name: "解锁内容", exact: true })
          .click();
        await expect(page.locator(".native-note-paper")).toContainText(
          "我不是因为顺路才等你的",
        );
      }

      if (answer) await photo();
      else await diary();
      await expect(page.locator(".incoming-call-screen")).toHaveCount(0);
      // Refresh between clues: author data, unlocked content and runtime read state must survive.
      await page.reload();
      await page.getByRole("button", { name: "轻触解锁" }).click();
      if (answer) await diary();
      else await photo();
      await expect(page.locator(".incoming-call-screen")).toContainText(
        "王橹杰",
      );
      if (answer) {
        await page.getByRole("button", { name: "接听", exact: true }).click();
        await expect(page.locator(".incoming-call-screen")).toContainText(
          "通话中",
        );
        await page.getByRole("button", { name: "挂断", exact: true }).click();
      } else
        await page.getByRole("button", { name: "拒接", exact: true }).click();
      await home(page);
      await open(page, "信息");
      await smsThread(page, "王橹杰").click();
      await expect(page.locator(".sms-bubbles")).toContainText("可我就想找她");
      await page
        .locator(".catalog-message button")
        .filter({ hasText: "这句先别替我告诉她" })
        .click();
      await page.getByRole("button", { name: choice, exact: true }).click();
      await expect(page.locator(".story-overlay.ending")).toContainText(
        ending + "｜",
      );
      const endingBox = page.locator(".story-overlay.ending");
      expect(
        await endingBox.evaluate((el) => el.scrollHeight <= el.clientHeight),
      ).toBe(true);
      await page
        .locator(".phone-screen")
        .screenshot({ path: `outputs/romance/ending-${answer}-${ending}.png` });
      await page.reload();
      await page.getByRole("button", { name: "轻触解锁" }).click();
      await expect(endingBox).toContainText(ending + "｜");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.getByRole("button", { name: "重新开始", exact: true }).click();
      await page.getByRole("button", { name: "轻触解锁" }).click();
      await open(page, "信息");
      await expect(smsThread(page, "王橹杰")).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }
}
