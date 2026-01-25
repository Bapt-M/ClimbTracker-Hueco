const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'ui-audit-screenshots');

// Test credentials
const TEST_USER = {
  email: 'climber1@climbtracker.com',
  password: 'password123',
};

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function takeScreenshot(page, name, fullPage = true) {
  const filename = `${name.replace(/\s+/g, '-').toLowerCase()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage });
  console.log(`📸 Screenshot saved: ${filename}`);
  return filepath;
}

async function waitForLoad(page, timeout = 3000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
  await page.waitForTimeout(500);
}

async function runAudit() {
  console.log('🚀 Starting UI Audit...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro size
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const screenshots = [];

  try {
    // 1. LOGIN PAGE
    console.log('📄 Page: Login');
    await page.goto(`${BASE_URL}/login`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, '01-login-page'));

    // 2. REGISTER PAGE
    console.log('📄 Page: Register');
    await page.goto(`${BASE_URL}/register`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, '02-register-page'));

    // 3. LOGIN AND GO TO MAIN APP
    console.log('🔐 Logging in...');
    await page.goto(`${BASE_URL}/login`);
    await waitForLoad(page);

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await page.waitForURL('**/', { timeout: 10000 }).catch(() => {});
    await waitForLoad(page);

    // 4. ROUTES HUB (Main page)
    console.log('📄 Page: Routes Hub');
    screenshots.push(await takeScreenshot(page, '03-routes-hub'));

    // 5. ROUTES HUB WITH FILTERS OPEN
    console.log('📄 Page: Routes Hub - Filters Open');
    const filterButton = page.locator('button:has(.material-symbols-outlined:text("tune"))');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await waitForLoad(page);
      screenshots.push(await takeScreenshot(page, '04-routes-hub-filters'));

      // Open each filter section
      const filterHeaders = page.locator('.w-full.bg-white.rounded-2xl button');
      const filterCount = await filterHeaders.count();

      for (let i = 0; i < filterCount; i++) {
        await filterHeaders.nth(i).click().catch(() => {});
        await page.waitForTimeout(200);
      }
      await waitForLoad(page);
      screenshots.push(await takeScreenshot(page, '05-routes-hub-all-filters-open'));
    }

    // 6. ROUTE DETAIL PAGE
    console.log('📄 Page: Route Detail');
    await page.goto(`${BASE_URL}/`);
    await waitForLoad(page);

    const routeCard = page.locator('.group.relative').first();
    if (await routeCard.isVisible()) {
      await routeCard.click();
      await waitForLoad(page, 5000);
      screenshots.push(await takeScreenshot(page, '06-route-detail'));
    }

    // 7. LEADERBOARD PAGE
    console.log('📄 Page: Leaderboard');
    await page.goto(`${BASE_URL}/leaderboard`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, '07-leaderboard'));

    // 8. USER PROFILE PAGE
    console.log('📄 Page: User Profile');
    await page.goto(`${BASE_URL}/profile`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, '08-user-profile'));

    // 9. FRIENDS PAGE
    console.log('📄 Page: Friends');
    await page.goto(`${BASE_URL}/friends`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, '09-friends'));

    // 10. Quick Status Menu (long press simulation)
    console.log('📄 Component: Quick Status Menu');
    await page.goto(`${BASE_URL}/`);
    await waitForLoad(page);

    const firstRouteCard = page.locator('.group.relative').first();
    if (await firstRouteCard.isVisible()) {
      // Simulate long press
      const box = await firstRouteCard.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(600); // Long press duration
        await page.mouse.up();
        await waitForLoad(page);

        // Check if modal appeared
        const modal = page.locator('.fixed.inset-0.z-50');
        if (await modal.isVisible()) {
          screenshots.push(await takeScreenshot(page, '10-quick-status-menu'));

          // Click on "Validé" to expand attempts menu
          const valideButton = page.locator('button:has-text("Validé")').first();
          if (await valideButton.isVisible()) {
            await valideButton.click();
            await page.waitForTimeout(300);
            screenshots.push(await takeScreenshot(page, '11-quick-status-attempts'));
          }

          // Close modal
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);
        }
      }
    }

    // 11. Create Route Page (if opener)
    console.log('📄 Page: Create Route');
    await page.goto(`${BASE_URL}/routes/create`);
    await waitForLoad(page);
    const createPageVisible = await page.locator('text=Créer une voie').isVisible().catch(() => false);
    if (createPageVisible) {
      screenshots.push(await takeScreenshot(page, '12-create-route'));
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ UI Audit Complete!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    console.log(`📊 Total screenshots: ${screenshots.length}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error during audit:', error.message);
  } finally {
    await browser.close();
  }

  return screenshots;
}

// Run the audit
runAudit().catch(console.error);
