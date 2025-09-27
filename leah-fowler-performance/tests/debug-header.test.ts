import { test, devices } from '@playwright/test'

test('Debug header height on mobile', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  })
  const page = await context.newPage()

  await page.goto('http://localhost:3001')
  await page.waitForLoadState('networkidle')

  // Get header details
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('header')
    if (!header) return null

    const styles = window.getComputedStyle(header)
    const rect = header.getBoundingClientRect()

    // Get logo details
    const logo = header.querySelector('img')
    const logoRect = logo?.getBoundingClientRect()
    const logoContainer = logo?.parentElement
    const logoContainerRect = logoContainer?.getBoundingClientRect()

    return {
      header: {
        height: rect.height,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        className: header.className,
        computedHeight: styles.height
      },
      logo: logo ? {
        height: logoRect?.height,
        width: logoRect?.width,
        naturalHeight: (logo as HTMLImageElement).naturalHeight,
        naturalWidth: (logo as HTMLImageElement).naturalWidth,
        src: (logo as HTMLImageElement).src
      } : null,
      logoContainer: logoContainer ? {
        height: logoContainerRect?.height,
        className: logoContainer.className,
        computedHeight: window.getComputedStyle(logoContainer).height
      } : null
    }
  })

  console.log('Header Debug Info:', JSON.stringify(headerInfo, null, 2))

  // Take screenshot for visual inspection
  await page.screenshot({
    path: 'tests/screenshots/header-debug.png',
    clip: { x: 0, y: 0, width: 390, height: 200 }
  })

  await context.close()
})