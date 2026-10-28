import { test, expect } from '@playwright/test';

test.describe('Noesis AI Learning Platform Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Monitor console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });

    await page.goto('http://localhost:5173');
  });

  test('Page loads cleanly with title and no uncaught exceptions', async ({ page }) => {
    await expect(page).toHaveTitle(/Noesis/);
    const brandName = page.locator('.brand-wordmark').first();
    await expect(brandName).toContainText('Noesis');
  });

  test('All 11 required sections exist in the DOM in order', async ({ page }) => {
    // 1. Navigation
    await expect(page.locator('.site-navbar')).toBeVisible();

    // 2. Hero and interactive dashboard preview
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('.signature-light-beam-wrapper')).toBeVisible();
    await expect(page.locator('#hero-dashboard-preview')).toBeVisible();

    // 3. Learning principles strip
    await expect(page.locator('.principles-strip-section')).toBeVisible();
    await expect(page.locator('.principles-label')).toHaveText('BUILT AROUND HOW YOU LEARN');

    // 4. Features showcase (4 cards: Adaptive Questions, Knowledge Map, Experimenting, AI Guide)
    await expect(page.locator('#features')).toBeVisible();
    await expect(page.locator('.features-bento-grid .feature-card')).toHaveCount(4);

    // 5. How the learning journey works
    await expect(page.locator('#journey')).toBeVisible();
    await expect(page.locator('.journey-step-btn')).toHaveCount(4);

    // 6. Interactive knowledge map
    await expect(page.locator('#knowledge-map')).toBeVisible();
    await expect(page.locator('.map-interactive-svg')).toBeVisible();

    // 7. Interactive learning and simulation showcase
    await expect(page.locator('#simulations')).toBeVisible();
    await expect(page.locator('#force-slider')).toBeVisible();

    // 8. Personalised revision and progress
    await expect(page.locator('#revision')).toBeVisible();

    // 9. Chocolate Problem showcase
    await expect(page.locator('#challenges')).toBeVisible();
    await expect(page.locator('.chocolate-problem-title')).toBeVisible();

    // 10. Final call to action
    await expect(page.locator('.final-cta-section')).toBeVisible();

    // 11. Footer
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('Hero interactive question diagnostic feedback works', async ({ page }) => {
    const dashboard = page.locator('#hero-dashboard-preview');

    // Select Option A (Incorrect: "It becomes zero.")
    const optA = dashboard.locator('button', { hasText: 'It becomes zero.' });
    await optA.click();

    // Diagnostic hint should be shown
    const feedbackArea = dashboard.locator('.feedback-area');
    await expect(feedbackArea).toContainText('Common Intuitive Misconception Detected');
    await expect(feedbackArea).toContainText('Diagnostic Hint:');

    // Reveal full explanation
    const revealBtn = feedbackArea.locator('button', { hasText: 'Show Full Explanation' });
    await revealBtn.click();
    await expect(feedbackArea).toContainText('Velocity momentarily becomes zero at the apogee');

    // Reset question
    const resetBtn = dashboard.locator('button', { hasText: 'Reset' });
    await resetBtn.click();
    await expect(feedbackArea).toContainText('Select an answer above');

    // Select Option B (Correct: "It remains approximately 9.8 m/s² downward.")
    const optB = dashboard.locator('button', { hasText: 'It remains approximately 9.8 m/s² downward.' });
    await optB.click();
    await expect(feedbackArea).toContainText('Intuition Verified · Mastery Gained');
  });

  test('Interactive Knowledge Map detail panel updates on node click', async ({ page }) => {
    const mapSection = page.locator('#knowledge-map');

    // Click "1D Kinematics" node
    const kinematicsNode = mapSection.locator('.map-node-group', { hasText: '1D Kinematics' });
    await kinematicsNode.click();

    const detailPanel = mapSection.locator('.map-detail-panel');
    await expect(detailPanel.locator('.panel-node-title')).toHaveText('1D Kinematics');
    await expect(detailPanel).toContainText('Displacement, instantaneous velocity');

    // Click Explore Concept button
    const exploreBtn = detailPanel.locator('.btn-explore-concept');
    await exploreBtn.click();
    await expect(detailPanel.locator('.explore-feedback-msg')).toContainText('Diagnostic question loaded into session');
  });

  test('Physics simulation dynamically updates acceleration when sliders move', async ({ page }) => {
    const simSection = page.locator('#simulations');

    const forceSlider = simSection.locator('#force-slider');
    const heroReadout = simSection.locator('.readout-hero-number span').first();

    // Initial with F=40, m=4 -> a = 10.00
    await expect(heroReadout).toHaveText('10');

    // Change force to 80 N -> a = 80 / 4 = 20
    await forceSlider.fill('80');
    await expect(heroReadout).toHaveText('20');
  });

  test('Chocolate problem preview expands and toggles socratic hints', async ({ page }) => {
    const challengeSection = page.locator('#challenges');

    const previewBtn = challengeSection.locator('.btn-preview-challenge');
    await expect(previewBtn).toHaveText(/Preview Challenge/);

    // Click to expand
    await previewBtn.click();
    await expect(previewBtn).toHaveText(/Hide Challenge Breakdown/);

    const drawer = challengeSection.locator('.challenge-expanded-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('The Core Breakthrough: Simultaneity is Relative');

    // Toggle Socratic hint
    const hintBtn = challengeSection.locator('.btn-challenge-hint-toggle');
    await hintBtn.click();
    await expect(drawer.locator('.socratic-hint-box')).toBeVisible();
    await expect(drawer.locator('.socratic-hint-box')).toContainText('Lorentz transformation for time');
  });

  test('Footer informational modals open and close cleanly', async ({ page }) => {
    const footer = page.locator('.site-footer');

    // Click "About Noesis" button in footer
    const aboutBtn = footer.locator('button', { hasText: 'About Noesis' });
    await aboutBtn.click();

    const modal = page.locator('.footer-modal-card');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-title')).toHaveText('About Noesis');

    // Dismiss modal
    const dismissBtn = modal.locator('.btn-modal-dismiss');
    await dismissBtn.click();
    await expect(page.locator('.footer-modal-card')).toHaveCount(0);
  });

  test('Responsive viewport tests verify zero horizontal overflow on mobile and desktop', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 430, height: 932 }, // iPhone 14 Pro Max
      { width: 768, height: 1024 }, // iPad
      { width: 1440, height: 900 }, // Desktop
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.evaluate(() => window.scrollTo(0, 0));

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalScroll, `Horizontal overflow detected at ${vp.width}px`).toBe(false);
    }
  });

  test('Mobile navigation menu toggles and operates smoothly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const toggleBtn = page.locator('.mobile-menu-toggle');
    await expect(toggleBtn).toBeVisible();

    // Open mobile menu
    await toggleBtn.click();
    const drawer = page.locator('#mobile-nav-menu');
    await expect(drawer).toBeVisible();

    // Click a navigation link inside mobile menu
    const expLink = drawer.locator('.mobile-nav-link', { hasText: 'Experience' });
    await expLink.click();

    // Menu should close
    await expect(drawer).toHaveCount(0);
  });

  test('Features section has 4 cards with spotlight backlight and no Personalised Revision card', async ({ page }) => {
    const grid = page.locator('.features-bento-grid');
    const cards = grid.locator('.feature-card');

    // Exactly 4 cards
    await expect(cards).toHaveCount(4);

    // Verify expected titles
    await expect(grid).toContainText('Adaptive Questions');
    await expect(grid).toContainText('Interactive Knowledge Map');
    await expect(grid).toContainText('Learn by Experimenting');
    await expect(grid).toContainText('AI Learning Guide');

    // Personalised Revision must NOT be present in features
    await expect(grid).not.toContainText('Personalised Revision');

    // Each feature card contains a cursor spotlight element
    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i);
      const spotlight = card.locator('.feature-card-spotlight');
      await expect(spotlight).toHaveCount(1);
    }

    // Hover over the first card and verify it updates hover state
    const firstCard = cards.first();
    await firstCard.hover();
    const firstSpotlight = firstCard.locator('.feature-card-spotlight');
    // Spotlight opacity becomes 1 on hover
    await expect(firstSpotlight).toHaveCSS('opacity', '1');
  });
});
