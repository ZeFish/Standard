# Standard Framework Test Suite

This directory contains the test suite for the Standard Framework, covering both Astro and 11ty implementations.

## Test Structure

### 1. Library Integrity Tests (`lib-integrity.test.js`)
**Framework:** Vitest  
**Purpose:** Verifies that the compiled JavaScript library files are up-to-date with source files.

**What it tests:**
- ✓ Builds the JS files
- ✓ Verifies `standard.min.js` exists
- ✓ Verifies `standard.lab.js` exists

**Run with:**
```bash
npm run test:lib
```

### 2. Build Verification Tests (`build-verification.test.ts`)
**Framework:** Playwright  
**Purpose:** Verifies that both Astro and 11ty builds complete successfully and include all required assets.

**What it tests:**

#### Astro Build
- ✓ Build completes without errors
- ✓ Standard CSS file (`style.css`) is included and not empty
- ✓ Standard JS files (`standard.js`, `standard.lab.js`) are included
- ✓ Font files are included in the build output
- ✓ Multiple font formats supported (.woff2, .woff, .ttf)

#### 11ty Build
- ✓ Build completes without errors
- ✓ Standard CSS file (`style.css`) is included and not empty
- ✓ Standard JS files (`standard.js`, `standard.lab.js`) are included
- ✓ Font files are included in the build output
- ✓ HTML includes proper CSS and JS references

#### Build Comparison
- ✓ Both builds have consistent asset structures
- ✓ Both have CSS, JS, and fonts directories

**Run with:**
```bash
npm run test:build
```

### 3. End-to-End Tests (`astro-e2e.test.ts`)
**Framework:** Playwright  
**Purpose:** Verifies that the Astro development server works correctly and assets load in the browser.

**What it tests:**
- ✓ Homepage loads successfully
- ✓ Standard CSS is loaded in the browser
- ✓ CSS is applied (font-family check)
- ✓ Standard JS scripts are loaded
- ✓ Fonts are loaded and available in the browser
- ✓ Font families are properly registered
- ✓ Menu navigation works correctly
- ✓ Assets are served with correct MIME types
  - CSS: `text/css`
  - JS: `application/javascript`
  - Fonts: `font/woff2`, `font/ttf`, etc.

**Run with:**
```bash
npm run test:e2e
```

## Running Tests

### Run All Tests
```bash
npm test
```

This runs tests in sequence:
1. Library integrity tests (Vitest)
2. Build verification tests (Playwright)
3. End-to-end tests (Playwright)

### Run Individual Test Suites
```bash
# Library tests only
npm run test:lib

# Build verification only
npm run test:build

# E2E tests only
npm run test:e2e
```

### Run Specific Test Files
```bash
# Run a specific Playwright test
npx playwright test tests/build-verification.test.ts

# Run a specific Vitest test
npx vitest run tests/lib-integrity.test.js
```

## Test Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Base URL:** `http://localhost:8083`
- **Test Directory:** `./tests`
- **Browser:** Chromium (Desktop Chrome)
- **Web Server:** Automatically starts `npm run dev`
- **Timeout:** 120 seconds
- **Retries:** 2 in CI, 0 locally

### Vitest Configuration (`vitest.config.js`)
- **Environment:** JSDOM (simulates browser)
- **Test Patterns:** `tests/**/*.test.{js,ts}` and `src/**/*.test.{js,ts}`
- **Globals:** Enabled

## Prerequisites

### For Playwright Tests
1. Install Playwright browsers:
```bash
npx playwright install
```

2. Ensure the development server can start on port 8083

### For Build Tests
1. Ensure build scripts work:
```bash
npm run build        # Astro build
npx @11ty/eleventy  # 11ty build
```

## Test Output Directories

- `playwright-report/` - HTML report of Playwright test runs
- `test-results/` - Screenshots and traces from failed tests

## Debugging Tests

### Playwright UI Mode
Run tests in interactive UI mode:
```bash
npx playwright test --ui
```

### Playwright Debug Mode
Run tests with debugger:
```bash
npx playwright test --debug
```

### View Test Report
After running tests:
```bash
npx playwright show-report
```

## CI/CD Integration

The test suite is designed to work in CI environments:
- Build verification runs before deployment
- E2E tests verify the production build
- Retries are enabled in CI (set via `process.env.CI`)

## Expected Test Results

### Asset Verification Checklist

**Astro Build (`dist/`):**
- [ ] `dist/assets/css/style.css` exists and has content
- [ ] `dist/assets/js/standard.js` exists
- [ ] `dist/assets/js/standard.lab.js` exists
- [ ] `dist/assets/fonts/` contains .woff2 files
- [ ] Key fonts present (InterVariable, InstrumentSans, Fraunces)

**11ty Build (`_site/`):**
- [ ] `_site/assets/css/style.css` exists and has content
- [ ] `_site/assets/js/standard.js` exists
- [ ] `_site/assets/js/standard.lab.js` exists
- [ ] `_site/assets/fonts/` contains .woff2 files
- [ ] Key fonts present (InterVariable, InstrumentSans, Fraunces)

## Known Issues

### Font Loading (11ty)
Note: Font export for 11ty is coming in a future update. Currently, the test verifies that fonts are present in the build output (they are copied from the public directory).

## Contributing

When adding new tests:
1. Use descriptive test names
2. Add console.log statements for important checkpoints
3. Include assertions for both positive and negative cases
4. Update this README with new test descriptions

## Troubleshooting

### Port 8083 Already in Use
```bash
npm run clean:ports
```

### Playwright Tests Fail to Start Server
Check if the dev server starts manually:
```bash
npm run dev
```

### Build Tests Fail
Ensure both build commands work:
```bash
npm run build           # Should create dist/
npx @11ty/eleventy     # Should create _site/
```

### Font Tests Fail
Verify fonts are in the public directory:
```bash
ls -la public/assets/fonts/
```
