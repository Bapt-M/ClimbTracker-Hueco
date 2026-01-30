const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'ui-audit-screenshots');

// Test credentials (Admin user)
const ADMIN_USER = {
  email: 'admin@climbtracker.com',
  password: 'password123',
  id: '57f59f9a-432e-46e2-a4fd-1df817b5b52f'
};

// Clean and create screenshots directory
if (fs.existsSync(SCREENSHOTS_DIR)) {
  fs.rmSync(SCREENSHOTS_DIR, { recursive: true });
}
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let screenshotCounter = 0;

async function takeScreenshot(page, name, fullPage = true) {
  screenshotCounter++;
  const prefix = String(screenshotCounter).padStart(2, '0');
  const filename = `${prefix}-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage });
  console.log(`  📸 ${filename}`);
  return filepath;
}

async function waitForLoad(page, timeout = 3000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
  await page.waitForTimeout(500);
}

async function runAudit() {
  console.log('🚀 ClimbTracker UI Audit - Complete\n');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    deviceScaleFactor: 1, // Reduced for smaller file sizes
  });
  const page = await context.newPage();
  const screenshots = [];

  try {
    // =========================================================
    // SECTION 1: PUBLIC PAGES (Before Login)
    // =========================================================
    console.log('\n📂 SECTION 1: Pages Publiques\n');

    // 1.1 Login Page - Empty
    console.log('📄 Login Page');
    await page.goto(`${BASE_URL}/login`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'login-page-empty'));

    // 1.2 Login Page - With Error
    console.log('📄 Login Page - Error State');
    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    screenshots.push(await takeScreenshot(page, 'login-page-error'));

    // 1.3 Register Page - Empty
    console.log('📄 Register Page');
    await page.goto(`${BASE_URL}/register`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'register-page-empty'));

    // 1.4 Register Page - Form Validation
    console.log('📄 Register Page - Validation');
    await page.fill('input[name="name"]', 'T'); // Too short
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123'); // Too short
    await page.fill('input[name="confirmPassword"]', '456'); // Mismatch
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    screenshots.push(await takeScreenshot(page, 'register-page-validation'));

    // =========================================================
    // SECTION 2: LOGIN AS ADMIN
    // =========================================================
    console.log('\n🔐 Connexion Admin...');
    await page.goto(`${BASE_URL}/login`);
    await waitForLoad(page);
    await page.fill('input[name="email"]', ADMIN_USER.email);
    await page.fill('input[name="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/', { timeout: 10000 }).catch(() => {});
    await waitForLoad(page);
    console.log('✅ Connecté en tant qu\'Admin\n');

    // =========================================================
    // SECTION 3: MAIN PAGES
    // =========================================================
    console.log('📂 SECTION 2: Pages Principales\n');

    // 3.1 Dashboard / Home
    console.log('📄 Dashboard (Home)');
    await page.goto(`${BASE_URL}/`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'dashboard-home'));

    // 3.2 Routes Hub
    console.log('📄 Routes Hub (/routes)');
    await page.goto(`${BASE_URL}/routes`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'routes-hub'));

    // 3.3 Routes Hub - Filter Panel Open
    console.log('📄 Routes Hub - Filtres ouverts');
    const filterButton = page.locator('button').filter({ has: page.locator('text=tune') }).first();
    if (await filterButton.isVisible().catch(() => false)) {
      await filterButton.click();
      await waitForLoad(page);
      screenshots.push(await takeScreenshot(page, 'routes-hub-filters-open'));

      // Expand all filter sections
      const filterSections = page.locator('[data-state="closed"]');
      const count = await filterSections.count();
      for (let i = 0; i < count; i++) {
        await filterSections.nth(i).click().catch(() => {});
        await page.waitForTimeout(200);
      }
      await waitForLoad(page);
      screenshots.push(await takeScreenshot(page, 'routes-hub-all-filters-expanded'));

      // Close filters
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // 3.4 Route Detail Page
    console.log('📄 Route Detail');
    const routeCard = page.locator('[class*="group"]').first();
    if (await routeCard.isVisible().catch(() => false)) {
      await routeCard.click();
      await waitForLoad(page, 5000);
      screenshots.push(await takeScreenshot(page, 'route-detail'));

      // Scroll to see comments section if exists
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      screenshots.push(await takeScreenshot(page, 'route-detail-scrolled'));
    }

    // 3.5 Leaderboard
    console.log('📄 Leaderboard');
    await page.goto(`${BASE_URL}/leaderboard`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'leaderboard'));

    // 3.6 Friends Page
    console.log('📄 Friends');
    await page.goto(`${BASE_URL}/friends`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'friends-page'));

    // 3.7 User Profile (current user)
    console.log('📄 User Profile');
    await page.goto(`${BASE_URL}/users/${ADMIN_USER.id}`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'user-profile'));

    // Scroll profile to see stats
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    screenshots.push(await takeScreenshot(page, 'user-profile-scrolled'));

    // =========================================================
    // SECTION 4: FORMS
    // =========================================================
    console.log('\n📂 SECTION 3: Formulaires\n');

    // 4.1 Create Route Form - Empty
    console.log('📄 Create Route - Empty Form');
    await page.goto(`${BASE_URL}/routes/create`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'create-route-empty'));

    // 4.2 Create Route Form - Filled
    console.log('📄 Create Route - Form Filled');
    await page.fill('input[name="name"]', 'Test Boulder');

    // Select difficulty
    const difficultySelect = page.locator('select[name="difficulty"], [data-testid="difficulty-select"]').first();
    if (await difficultySelect.isVisible().catch(() => false)) {
      await difficultySelect.selectOption({ index: 3 });
    }

    // Select sector
    const sectorSelect = page.locator('select[name="sector"], [data-testid="sector-select"]').first();
    if (await sectorSelect.isVisible().catch(() => false)) {
      await sectorSelect.selectOption({ index: 1 });
    }

    await page.fill('textarea[name="description"]', 'Bloc technique avec des mouvements précis');
    await page.fill('textarea[name="tips"]', 'Attention au premier mouvement');
    screenshots.push(await takeScreenshot(page, 'create-route-filled'));

    // Scroll to see more of the form
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    screenshots.push(await takeScreenshot(page, 'create-route-form-bottom'));

    // =========================================================
    // SECTION 5: MODALS & INTERACTIVE ELEMENTS
    // =========================================================
    console.log('\n📂 SECTION 4: Modals & Éléments Interactifs\n');

    // 5.1 Quick Status Menu (Long press on route card)
    console.log('📄 Quick Status Menu');
    await page.goto(`${BASE_URL}/`);
    await waitForLoad(page);

    const cardForLongPress = page.locator('[class*="group"]').first();
    if (await cardForLongPress.isVisible().catch(() => false)) {
      const box = await cardForLongPress.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(600);
        await page.mouse.up();
        await page.waitForTimeout(500);

        const modal = page.locator('.fixed.inset-0, [role="dialog"]').first();
        if (await modal.isVisible().catch(() => false)) {
          screenshots.push(await takeScreenshot(page, 'quick-status-menu'));

          // Try to expand the "Validé" section
          const valideBtn = page.locator('button:has-text("Validé")').first();
          if (await valideBtn.isVisible().catch(() => false)) {
            await valideBtn.click();
            await page.waitForTimeout(300);
            screenshots.push(await takeScreenshot(page, 'quick-status-attempts-selector'));
          }

          // Close modal
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);
        }
      }
    }

    // 5.2 Edit Route Modal (if available on route detail)
    console.log('📄 Edit Route Modal');
    await page.goto(`${BASE_URL}/`);
    await waitForLoad(page);

    // Click on route card to go to detail
    const routeForEdit = page.locator('[class*="group"]').first();
    if (await routeForEdit.isVisible().catch(() => false)) {
      await routeForEdit.click();
      await waitForLoad(page, 3000);

      // Look for edit button
      const editButton = page.locator('button:has-text("Modifier"), button:has-text("Edit"), [aria-label*="edit"]').first();
      if (await editButton.isVisible().catch(() => false)) {
        await editButton.click();
        await page.waitForTimeout(500);
        screenshots.push(await takeScreenshot(page, 'edit-route-modal'));

        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    }

    // =========================================================
    // SECTION 6: ADMIN PAGES
    // =========================================================
    console.log('\n📂 SECTION 5: Pages Admin\n');

    // 6.1 Admin Dashboard
    console.log('📄 Admin Dashboard');
    await page.goto(`${BASE_URL}/admin`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'admin-dashboard'));

    // 6.2 Admin Users Management
    console.log('📄 Admin - Users Management');
    await page.goto(`${BASE_URL}/admin/users`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'admin-users'));

    // 6.3 Admin Gym Layout
    console.log('📄 Admin - Gym Layout Editor');
    await page.goto(`${BASE_URL}/admin/gym-layout`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'admin-gym-layout'));

    // 6.4 Admin Routes
    console.log('📄 Admin - Routes Management');
    await page.goto(`${BASE_URL}/admin/routes`);
    await waitForLoad(page);
    screenshots.push(await takeScreenshot(page, 'admin-routes'));

    // =========================================================
    // SECTION 7: DARK MODE (if supported)
    // =========================================================
    console.log('\n📂 SECTION 6: Dark Mode\n');

    // Toggle dark mode if there's a button for it
    const darkModeToggle = page.locator('button[aria-label*="dark"], button[aria-label*="theme"], [data-testid="dark-mode"]').first();
    if (await darkModeToggle.isVisible().catch(() => false)) {
      console.log('📄 Testing Dark Mode');
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      // Take some screenshots in dark mode
      await page.goto(`${BASE_URL}/`);
      await waitForLoad(page);
      screenshots.push(await takeScreenshot(page, 'dashboard-dark-mode'));

      await page.goto(`${BASE_URL}/leaderboard`);
      await waitForLoad(page);
      screenshots.push(await takeScreenshot(page, 'leaderboard-dark-mode'));
    }

    // =========================================================
    // SECTION 8: NAVIGATION & BOTTOM BAR
    // =========================================================
    console.log('\n📂 SECTION 7: Navigation\n');

    // Focus on bottom navigation bar
    console.log('📄 Bottom Navigation Bar');
    await page.goto(`${BASE_URL}/`);
    await waitForLoad(page);

    // Take a partial screenshot of just the bottom area
    const bottomNav = page.locator('nav, [class*="bottom"], [class*="navigation"]').last();
    if (await bottomNav.isVisible().catch(() => false)) {
      await bottomNav.scrollIntoViewIfNeeded();
      screenshots.push(await takeScreenshot(page, 'bottom-navigation', false));
    }

    // =========================================================
    // SUMMARY
    // =========================================================
    console.log('\n' + '='.repeat(60));
    console.log('✅ UI Audit Complete!');
    console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
    console.log(`📊 Total screenshots: ${screenshots.length}`);
    console.log('='.repeat(60));

    // Generate index file
    const indexContent = `# UI Audit Screenshots - ClimbTracker
Generated: ${new Date().toISOString()}
Total: ${screenshots.length} screenshots

## Screenshots List
${screenshots.map((s, i) => `${i + 1}. ${path.basename(s)}`).join('\n')}
`;
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'INDEX.md'), indexContent);
    console.log('\n📝 Index file generated: INDEX.md');

  } catch (error) {
    console.error('\n❌ Error during audit:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }

  return screenshots;
}

// Run the audit
runAudit().catch(console.error);
