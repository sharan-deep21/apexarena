import { test, expect } from '@playwright/test';

test.describe('ApexArena Smart Stadium Operations E2E Tests', () => {
  
  test('should load the landing page and navigate to dashboard', async ({ page }) => {
    // Navigate to local port
    await page.goto('/');
    
    // Page Title
    await expect(page).toHaveTitle(/ApexArena/i);
    
    // Click on ENTER OPERATIONS CENTER button
    const enterBtn = page.locator('text=ENTER OPERATIONS CENTER');
    await expect(enterBtn).toBeVisible();
    await enterBtn.click();

    // Check that we are redirected to dashboard
    await page.waitForURL('**/dashboard');
    
    // Check that header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check main operational statistics cards
    const statsGrid = page.locator('.stats-grid');
    await expect(statsGrid).toBeVisible();
  });

  test('should navigate between layout sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click on Smart Navigation link
    await page.click('a[href="/navigation"]');
    await page.waitForURL('**/navigation');
    await expect(page.locator('h1.header-page-title')).toContainText(/Smart Navigation/i);

    // Click on Sustainability link
    await page.click('a[href="/sustainability"]');
    await page.waitForURL('**/sustainability');
    await expect(page.locator('h1.header-page-title')).toContainText(/Sustainability/i);
  });

  test('should open chat window and interact with AI assistant', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find and click the chat bubble toggle button
    const chatToggle = page.locator('button[aria-label="Open AI assistant"]');
    await expect(chatToggle).toBeVisible();
    await chatToggle.click();
    
    // Chat body container should be visible
    const chatContainer = page.locator('.chat-panel');
    await expect(chatContainer).toBeVisible();
    
    // Type a question in the chat input
    const chatInput = page.locator('input[aria-label="Chat message input"]');
    await chatInput.fill('Where is the nearest restroom?');
    
    // Hit send button
    const sendBtn = page.locator('button[aria-label="Send message"]');
    await sendBtn.click();
    
    // Wait for the bot response bubble to appear
    const lastBubble = page.locator('.chat-bubble.received').last();
    await expect(lastBubble).toBeVisible();
    await expect(lastBubble).toContainText(/(restroom|toilet|section|concourse|nearest)/i);
  });

});
