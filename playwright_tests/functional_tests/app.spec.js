/* eslint-disable */

// @playwright/test is imported to use Playwright testing utilities
const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');

// Define the base URL for the React app (frontend)
let serverProcess;
const baseUrl = 'http://localhost:3000';

// Example login test using Playwright
test.describe('Login Page Tests', () => {
  test.beforeAll(async () => {
    // Start the React development server
    serverProcess = spawn('npm', ['start'], {
      cwd: './', // Ensure this is the correct path to your React project
      shell: true,
      stdio: 'inherit' // This helps to see server output in the console
    });
  })
  
  test('should log in with valid credentials', async ({ page }) => {
    // Navigate to the login page of the React frontend
    await page.goto(`${baseUrl}/`);

    // Find and fill in the username and password input fields
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for the navigation to the dashboard (assuming successful login redirects here)
    await page.waitForURL(`${baseUrl}/dashboard`);

    // Validate that the user has been redirected correctly and the JWT token is saved
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).not.toBeNull();

    // Optionally, you can validate some element in the dashboard page to ensure successful login
    await expect(page.locator('h1')).toContainText('Welcome to your Dashboard');
  });
})