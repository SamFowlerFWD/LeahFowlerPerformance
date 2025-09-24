from playwright.sync_api import sync_playwright
import time

# Start Playwright
with sync_playwright() as p:
    # Launch browser
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 390, 'height': 844},  # Mobile viewport
        device_scale_factor=2
    )
    page = context.new_page()

    # Navigate to the apply page
    page.goto('http://localhost:3004/apply')

    # Wait for page to load
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # Take a screenshot for inspection
    page.screenshot(path='apply-page-mobile.png')

    # Search for elements containing "A" or "C" that might be partially hidden
    # Check for text elements with overflow issues
    elements_with_overflow = page.evaluate('''() => {
        const elements = [];
        document.querySelectorAll('*').forEach(el => {
            const computed = window.getComputedStyle(el);
            const text = el.textContent || '';

            // Check if element has text and might be clipped
            if (text && (text.includes('A') || text.includes('C'))) {
                const rect = el.getBoundingClientRect();
                const parent = el.parentElement;
                const parentRect = parent ? parent.getBoundingClientRect() : null;

                // Check various conditions that might cause partial visibility
                if (
                    computed.overflow === 'hidden' ||
                    computed.textOverflow === 'ellipsis' ||
                    rect.top < 0 ||
                    rect.left < 0 ||
                    (parentRect && (rect.right > parentRect.right || rect.bottom > parentRect.bottom)) ||
                    parseFloat(computed.fontSize) > rect.height
                ) {
                    elements.push({
                        tag: el.tagName,
                        text: text.substring(0, 100),
                        className: el.className,
                        id: el.id,
                        overflow: computed.overflow,
                        position: computed.position,
                        fontSize: computed.fontSize,
                        lineHeight: computed.lineHeight,
                        rect: {
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height
                        },
                        display: computed.display,
                        visibility: computed.visibility
                    });
                }
            }
        });
        return elements;
    }''')

    print("Elements that might have clipped text:")
    for elem in elements_with_overflow[:10]:  # Show first 10
        print(f"\nTag: {elem['tag']}")
        print(f"Text: {elem['text'][:50]}...")
        print(f"Class: {elem['className']}")
        print(f"Position: {elem['position']}, Overflow: {elem['overflow']}")
        print(f"Rect: {elem['rect']}")

    # Look specifically for any text with just "A" or "C"
    single_letters = page.evaluate('''() => {
        const elements = [];
        document.querySelectorAll('*').forEach(el => {
            // Skip script and style elements
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;

            // Check direct text nodes
            for (let node of el.childNodes) {
                if (node.nodeType === 3) { // Text node
                    const text = node.textContent.trim();
                    if (text === 'A' || text === 'C' || text === 'AC') {
                        const rect = el.getBoundingClientRect();
                        elements.push({
                            tag: el.tagName,
                            text: text,
                            className: el.className,
                            rect: {
                                top: rect.top,
                                left: rect.left,
                                width: rect.width,
                                height: rect.height
                            },
                            computed: {
                                display: window.getComputedStyle(el).display,
                                visibility: window.getComputedStyle(el).visibility,
                                opacity: window.getComputedStyle(el).opacity,
                                position: window.getComputedStyle(el).position
                            }
                        });
                    }
                }
            }
        });
        return elements;
    }''')

    print("\n\nElements with just 'A' or 'C' text:")
    for elem in single_letters:
        print(f"\nTag: {elem['tag']}")
        print(f"Text: '{elem['text']}'")
        print(f"Class: {elem['className']}")
        print(f"Rect: {elem['rect']}")
        print(f"Computed styles: {elem['computed']}")

    browser.close()

print("\nScreenshot saved as apply-page-mobile.png")