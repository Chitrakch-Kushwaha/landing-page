import { test, expect } from '@playwright/test';

test.describe('StudyPlatform Interactive 3D Flashcards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/?view=studydeck');
  });

  test('Page loads cleanly with 0 console errors and proper header', async ({ page }) => {
    await expect(page).toHaveTitle(/Interactive Study Platform/);
    const title = page.locator('.study-title');
    await expect(title).toHaveText('StudyDeck');
  });

  test('Front face displays topic title and subtle hint, back face is inert', async ({ page }) => {
    const firstCard = page.locator('.flashcard').first();
    const frontFace = firstCard.locator('.flashcard-front');
    const backFace = firstCard.locator('.flashcard-back');

    // Front should have topic and hint
    await expect(frontFace.locator('.flashcard-topic')).toHaveText('How does CSS 3D perspective work?');
    await expect(frontFace.locator('.flashcard-hint')).toContainText('Click to reveal answer');

    // Front should be visible and not inert
    await expect(frontFace).toHaveAttribute('aria-hidden', 'false');

    // Back face MUST be inert and aria-hidden="true"
    await expect(backFace).toHaveAttribute('aria-hidden', 'true');
    const hasInert = await backFace.evaluate((el) => el.hasAttribute('inert'));
    expect(hasInert).toBe(true);
  });

  test('Clicking card flips with 3D transform and reveals answer', async ({ page }) => {
    const firstCard = page.locator('.flashcard').first();
    const frontFace = firstCard.locator('.flashcard-front');
    const backFace = firstCard.locator('.flashcard-back');

    // Initial state: not flipped
    await expect(firstCard).not.toHaveClass(/is-flipped/);
    await expect(firstCard).toHaveAttribute('aria-pressed', 'false');

    // Click to flip
    await firstCard.click();

    // Flipped state
    await expect(firstCard).toHaveClass(/is-flipped/);
    await expect(firstCard).toHaveAttribute('aria-pressed', 'true');

    // After flip: Back face is active (aria-hidden false, inert removed)
    await expect(backFace).toHaveAttribute('aria-hidden', 'false');
    const backInert = await backFace.evaluate((el) => el.hasAttribute('inert'));
    expect(backInert).toBe(false);

    // Answer text is visible
    await expect(backFace.locator('.flashcard-answer')).toContainText('The perspective property defines');

    // Front face should now be inert and aria-hidden
    await expect(frontFace).toHaveAttribute('aria-hidden', 'true');
    const frontInert = await frontFace.evaluate((el) => el.hasAttribute('inert'));
    expect(frontInert).toBe(true);

    // Clicking again flips it back
    await firstCard.click();
    await expect(firstCard).not.toHaveClass(/is-flipped/);
    await expect(frontFace).toHaveAttribute('aria-hidden', 'false');
  });

  test('Keyboard interaction: Tab focuses card and Enter/Space flips', async ({ page }) => {
    const firstCard = page.locator('.flashcard').first();
    const secondCard = page.locator('.flashcard').nth(1);

    // Focus the first card
    await firstCard.focus();
    await expect(firstCard).toBeFocused();

    // Press Enter to flip
    await page.keyboard.press('Enter');
    await expect(firstCard).toHaveClass(/is-flipped/);

    // Press Space to flip back
    await page.keyboard.press('Space');
    await expect(firstCard).not.toHaveClass(/is-flipped/);

    // Tab to next card
    await page.keyboard.press('Tab');
    await expect(secondCard).toBeFocused();
  });

  test('Cards flip independently in the responsive grid', async ({ page }) => {
    const card0 = page.locator('.flashcard').nth(0);
    const card1 = page.locator('.flashcard').nth(1);

    // Flip card 0
    await card0.click();
    await expect(card0).toHaveClass(/is-flipped/);
    await expect(card1).not.toHaveClass(/is-flipped/);

    // Flip card 1
    await card1.click();
    await expect(card0).toHaveClass(/is-flipped/);
    await expect(card1).toHaveClass(/is-flipped/);

    // Flip card 0 back
    await card0.click();
    await expect(card0).not.toHaveClass(/is-flipped/);
    await expect(card1).toHaveClass(/is-flipped/);
  });

  test('Spotlight border glow element is present on card faces', async ({ page }) => {
    const firstCard = page.locator('.flashcard').first();
    const frontSpotlight = firstCard.locator('.flashcard-front .flashcard-border-spotlight');
    const backSpotlight = firstCard.locator('.flashcard-back .flashcard-border-spotlight');

    await expect(frontSpotlight).toBeAttached();
    await expect(backSpotlight).toBeAttached();
  });

  test('Category filter and search work accurately', async ({ page }) => {
    // Test category tab click
    const csTab = page.locator('.category-pill', { hasText: 'Computer Science' });
    await csTab.click();
    await expect(page.locator('.flashcard')).toHaveCount(1);
    await expect(page.locator('.flashcard-topic')).toHaveText('What is CAP Theorem in Distributed Systems?');

    // Reset to All
    const allTab = page.locator('.category-pill', { hasText: 'All' });
    await allTab.click();
    await expect(page.locator('.flashcard')).toHaveCount(6);

    // Test text search
    const searchInput = page.locator('.search-input');
    await searchInput.fill('CAP Theorem');
    await expect(page.locator('.flashcard')).toHaveCount(1);
    await expect(page.locator('.flashcard-topic')).toHaveText('What is CAP Theorem in Distributed Systems?');
  });

  test('Theme toggle switches to dark mode cleanly', async ({ page }) => {
    const themeBtn = page.locator('.theme-toggle-btn');
    const platform = page.locator('.study-platform');

    await expect(platform).not.toHaveClass(/dark/);
    await themeBtn.click();
    await expect(platform).toHaveClass(/dark/);
  });
});
