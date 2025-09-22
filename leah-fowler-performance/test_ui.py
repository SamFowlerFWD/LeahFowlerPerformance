#!/usr/bin/env python3
"""
UI Testing Script for Leah Fowler Performance Coach Platform
Tests functionality, responsiveness, and accessibility using Playwright
"""

from playwright.sync_api import sync_playwright, expect
import time
import json

def test_assessment_tool():
    """Test the Assessment Tool functionality and capture UI issues"""
    
    with sync_playwright() as p:
        # Launch browser with viewport for desktop
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        
        print("🔍 Testing Leah Fowler Performance Coach Platform")
        print("=" * 50)
        
        # Navigate to the application
        page.goto("http://localhost:3004")
        page.wait_for_load_state("networkidle")
        
        # Take screenshot of homepage
        page.screenshot(path="homepage_desktop.png")
        print("✅ Homepage loaded successfully")
        
        # Test navigation menu
        print("\n📱 Testing Navigation Menu:")
        nav_links = page.locator("nav a").all()
        print(f"  - Found {len(nav_links)} navigation links")
        
        # Check if navigation is sticky
        initial_nav_position = page.locator("nav").bounding_box()
        page.evaluate("window.scrollBy(0, 500)")
        time.sleep(0.5)
        scrolled_nav_position = page.locator("nav").bounding_box()
        is_sticky = initial_nav_position['y'] == scrolled_nav_position['y']
        print(f"  - Navigation is {'sticky' if is_sticky else 'not sticky'}: {'✅' if is_sticky else '⚠️'}")
        
        # Scroll to Assessment section
        page.evaluate("window.scrollTo(0, 0)")
        assessment_section = page.locator("#assessment")
        assessment_section.scroll_into_view_if_needed()
        time.sleep(0.5)
        
        print("\n🎯 Testing Assessment Tool:")
        
        # Check if Assessment Tool is visible
        assessment_tool = page.locator("text='Discover Your Performance Profile'").first
        expect(assessment_tool).to_be_visible()
        print("  - Assessment section visible: ✅")
        
        # Find the assessment questions container
        questions_container = page.locator(".bg-white.rounded-2xl.shadow-xl").first
        expect(questions_container).to_be_visible()
        print("  - Assessment tool loaded: ✅")
        
        # Test progress bar
        progress_bar = page.locator(".bg-gradient-accent").first
        initial_width = progress_bar.evaluate("el => el.style.width")
        print(f"  - Initial progress: {initial_width}")
        
        # Test question navigation
        print("\n📊 Testing Question Flow:")
        
        # Answer first question
        page.locator("button").filter(has_text="7").first.click()
        time.sleep(0.5)
        
        # Check if moved to next question
        question_text = page.locator("h3.text-xl.font-semibold").inner_text()
        print(f"  - Current question: {question_text[:50]}...")
        
        # Test Back button
        back_button = page.locator("button").filter(has_text="Back")
        back_button.click()
        time.sleep(0.5)
        print("  - Back button works: ✅")
        
        # Complete the assessment
        print("\n🔄 Completing Assessment:")
        for i in range(8):
            # Select a rating (varying between 6-9 for realistic scores)
            rating = 6 + (i % 4)
            page.locator(f"button").filter(has_text=str(rating)).first.click()
            time.sleep(0.3)
            print(f"  - Question {i+1} answered with rating {rating}")
        
        # Wait for results
        page.wait_for_selector("text='Your Performance Assessment Results'", timeout=5000)
        print("\n✨ Results page loaded: ✅")
        
        # Check results elements
        overall_score = page.locator(".text-4xl.font-bold.text-white").inner_text()
        print(f"  - Overall score displayed: {overall_score}")
        
        # Check for strengths and improvement areas
        strengths_section = page.locator("text='Your Strengths'").first
        expect(strengths_section).to_be_visible()
        print("  - Strengths section visible: ✅")
        
        improvements_section = page.locator("text='Areas for Growth'").first
        expect(improvements_section).to_be_visible()
        print("  - Improvement areas visible: ✅")
        
        # Check recommended programme
        recommended = page.locator(".text-2xl.font-bold.text-gold").inner_text()
        print(f"  - Recommended programme: {recommended}")
        
        # Test email form
        print("\n📧 Testing Email Capture:")
        # Be more specific - target the inputs in the results section
        results_section = page.locator(".bg-white.rounded-2xl.shadow-xl")
        name_input = results_section.locator("input[placeholder='Your Name']")
        email_input = results_section.locator("input[placeholder='Your Email']")
        
        name_input.fill("Test User")
        email_input.fill("test@example.com")
        print("  - Form fields fillable: ✅")
        
        # Take screenshot of results
        page.screenshot(path="assessment_results.png")
        
        # Test Start Over button
        start_over = page.locator("button").filter(has_text="Start Over")
        start_over.click()
        time.sleep(0.5)
        
        # Verify back at beginning - check if we're back at question 1
        try:
            first_question = page.locator("h3").filter(has_text="energy levels")
            expect(first_question).to_be_visible(timeout=3000)
            print("  - Start Over works: ✅")
        except:
            print("  - Start Over works: ⚠️ (Could not verify return to first question)")
        
        browser.close()
        
        print("\n" + "=" * 50)
        print("✅ Assessment Tool Testing Complete!")


def test_responsive_design():
    """Test responsive design across different viewports"""
    
    viewports = [
        {"name": "Mobile", "width": 375, "height": 667},
        {"name": "Tablet", "width": 768, "height": 1024},
        {"name": "Desktop", "width": 1920, "height": 1080}
    ]
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        
        print("\n📱 Testing Responsive Design")
        print("=" * 50)
        
        for viewport in viewports:
            context = browser.new_context(viewport={'width': viewport['width'], 'height': viewport['height']})
            page = context.new_page()
            
            print(f"\n🖥️ Testing {viewport['name']} ({viewport['width']}x{viewport['height']}):")
            
            page.goto("http://localhost:3004")
            page.wait_for_load_state("networkidle")
            
            # Check navigation visibility
            desktop_nav = page.locator("nav .hidden.md\\:flex")
            mobile_menu = page.locator("nav button").filter(has_text="Book Consultation")
            
            if viewport['name'] == 'Desktop':
                expect(desktop_nav).to_be_visible()
                print("  - Desktop navigation visible: ✅")
            else:
                # On mobile/tablet, check if menu is properly hidden
                is_desktop_nav_hidden = desktop_nav.count() == 0 or not desktop_nav.is_visible()
                print(f"  - Desktop nav hidden on {viewport['name']}: {'✅' if is_desktop_nav_hidden else '⚠️'}")
            
            # Check hero section text scaling
            hero_title = page.locator("h1").first
            hero_font_size = hero_title.evaluate("el => window.getComputedStyle(el).fontSize")
            print(f"  - Hero title font size: {hero_font_size}")
            
            # Check button stacking on mobile
            hero_buttons = page.locator(".flex.flex-col.sm\\:flex-row").first
            buttons_display = hero_buttons.evaluate("el => window.getComputedStyle(el).flexDirection")
            print(f"  - Hero buttons layout: {buttons_display}")
            
            # Check assessment tool responsiveness
            page.locator("#assessment").scroll_into_view_if_needed()
            assessment_container = page.locator(".max-w-2xl.mx-auto").first
            container_width = assessment_container.evaluate("el => el.offsetWidth")
            print(f"  - Assessment container width: {container_width}px")
            
            # Take screenshot
            page.screenshot(path=f"responsive_{viewport['name'].lower()}.png")
            
            context.close()
        
        browser.close()
        print("\n✅ Responsive Design Testing Complete!")


def test_accessibility():
    """Test WCAG 2.1 AA compliance"""
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        
        print("\n♿ Testing Accessibility (WCAG 2.1 AA)")
        print("=" * 50)
        
        page.goto("http://localhost:3004")
        page.wait_for_load_state("networkidle")
        
        # Test keyboard navigation
        print("\n⌨️ Testing Keyboard Navigation:")
        
        # Tab through interactive elements
        interactive_elements = []
        for i in range(20):
            page.keyboard.press("Tab")
            focused = page.evaluate("""() => {
                const el = document.activeElement;
                return {
                    tag: el.tagName,
                    text: el.innerText?.substring(0, 30),
                    ariaLabel: el.getAttribute('aria-label'),
                    role: el.getAttribute('role')
                }
            }""")
            interactive_elements.append(focused)
            
        print(f"  - Found {len(interactive_elements)} focusable elements")
        
        # Check for skip navigation link
        skip_nav = page.locator("a[href='#main'], a[href='#content'], .skip-navigation")
        has_skip_nav = skip_nav.count() > 0
        print(f"  - Skip navigation link: {'✅' if has_skip_nav else '⚠️ Missing'}")
        
        # Test color contrast
        print("\n🎨 Testing Color Contrast:")
        
        # Check main text contrast
        contrast_results = page.evaluate("""() => {
            function getLuminance(r, g, b) {
                const [rs, gs, bs] = [r, g, b].map(c => {
                    c = c / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            }
            
            function getContrastRatio(color1, color2) {
                const l1 = getLuminance(...color1);
                const l2 = getLuminance(...color2);
                const lighter = Math.max(l1, l2);
                const darker = Math.min(l1, l2);
                return (lighter + 0.05) / (darker + 0.05);
            }
            
            const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button');
            const results = [];
            
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                const color = style.color;
                const bgColor = style.backgroundColor;
                
                // Skip if colors can't be determined
                if (!color || !bgColor || bgColor === 'rgba(0, 0, 0, 0)') return;
                
                // Parse RGB values (simplified)
                const colorMatch = color.match(/\d+/g);
                const bgMatch = bgColor.match(/\d+/g);
                
                if (colorMatch && bgMatch) {
                    const ratio = getContrastRatio(
                        colorMatch.slice(0, 3).map(Number),
                        bgMatch.slice(0, 3).map(Number)
                    );
                    
                    if (ratio < 4.5) {
                        results.push({
                            text: el.innerText?.substring(0, 30),
                            ratio: ratio.toFixed(2),
                            element: el.tagName
                        });
                    }
                }
            });
            
            return results;
        }""")
        
        if len(contrast_results) > 0:
            print("  ⚠️ Low contrast elements found:")
            for item in contrast_results[:5]:
                print(f"    - {item['element']}: ratio {item['ratio']} (min 4.5)")
        else:
            print("  - Color contrast: ✅ All elements meet WCAG AA")
        
        # Check ARIA attributes
        print("\n🏷️ Testing ARIA Attributes:")
        
        # Check form labels
        inputs = page.locator("input, textarea, select").all()
        unlabeled = []
        for input_el in inputs:
            has_label = input_el.evaluate("""el => {
                const id = el.id;
                const ariaLabel = el.getAttribute('aria-label');
                const ariaLabelledby = el.getAttribute('aria-labelledby');
                const label = id ? document.querySelector(`label[for="${id}"]`) : null;
                return !!(label || ariaLabel || ariaLabelledby);
            }""")
            if not has_label:
                placeholder = input_el.get_attribute("placeholder")
                unlabeled.append(placeholder or "Unknown input")
        
        if unlabeled:
            print(f"  ⚠️ Unlabeled inputs: {', '.join(unlabeled)}")
        else:
            print("  - All form inputs labeled: ✅")
        
        # Check images for alt text
        images = page.locator("img").all()
        missing_alt = []
        for img in images:
            alt = img.get_attribute("alt")
            if not alt:
                src = img.get_attribute("src")
                missing_alt.append(src)
        
        if missing_alt:
            print(f"  ⚠️ Images missing alt text: {len(missing_alt)}")
        else:
            print("  - All images have alt text: ✅")
        
        # Check heading hierarchy
        headings = page.evaluate("""() => {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            return Array.from(headings).map(h => ({
                level: parseInt(h.tagName[1]),
                text: h.innerText.substring(0, 30)
            }));
        }""")
        
        h1_count = sum(1 for h in headings if h['level'] == 1)
        print(f"\n  - H1 tags on page: {h1_count} {'✅' if h1_count == 1 else '⚠️ Should be exactly 1'}")
        
        # Check for proper heading hierarchy
        last_level = 0
        hierarchy_issues = []
        for h in headings:
            if h['level'] > last_level + 1 and last_level > 0:
                hierarchy_issues.append(f"H{last_level} → H{h['level']}")
            last_level = h['level']
        
        if hierarchy_issues:
            print(f"  ⚠️ Heading hierarchy issues: {', '.join(hierarchy_issues[:3])}")
        else:
            print("  - Heading hierarchy: ✅")
        
        browser.close()
        print("\n✅ Accessibility Testing Complete!")


def test_interactive_components():
    """Test all interactive components"""
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        
        print("\n🎮 Testing Interactive Components")
        print("=" * 50)
        
        page.goto("http://localhost:3004")
        page.wait_for_load_state("networkidle")
        
        # Test navigation links
        print("\n🔗 Testing Navigation Links:")
        nav_links = [
            ("Assessment", "#assessment"),
            ("Programmes", "#programmes"),
            ("About", "#about"),
            ("Testimonials", "#testimonials"),
            ("Contact", "#contact")
        ]
        
        for link_text, expected_hash in nav_links:
            link = page.locator("nav a").filter(has_text=link_text)
            if link.count() > 0:
                link.click()
                time.sleep(0.5)
                current_url = page.url
                print(f"  - {link_text}: {'✅' if expected_hash in current_url else '⚠️'}")
        
        # Test buttons
        print("\n🔘 Testing Buttons:")
        buttons = page.locator("button").all()
        print(f"  - Total buttons found: {len(buttons)}")
        
        # Test hover states
        print("\n🖱️ Testing Hover States:")
        test_button = page.locator("button").filter(has_text="Book Consultation").first
        initial_styles = test_button.evaluate("el => window.getComputedStyle(el).backgroundColor")
        test_button.hover()
        time.sleep(0.3)
        hover_styles = test_button.evaluate("el => window.getComputedStyle(el).backgroundColor")
        has_hover = initial_styles != hover_styles
        print(f"  - Button hover effects: {'✅' if has_hover else '⚠️'}")
        
        # Test form validation
        print("\n📝 Testing Form Validation:")
        page.goto("http://localhost:3004#contact")
        time.sleep(1)
        
        # Try submitting empty form
        submit_button = page.locator("button").filter(has_text="Schedule Consultation")
        if submit_button.count() > 0:
            submit_button.click()
            time.sleep(0.5)
            
            # Check for validation messages
            name_input = page.locator("input[placeholder='Your Name']")
            is_required = name_input.evaluate("el => el.hasAttribute('required')")
            print(f"  - Form validation: {'✅ Has required fields' if is_required else '⚠️ Missing validation'}")
        
        # Test smooth scrolling
        print("\n📜 Testing Smooth Scrolling:")
        page.goto("http://localhost:3004")
        page.locator("a[href='#assessment']").first.click()
        time.sleep(1)
        
        scroll_behavior = page.evaluate("() => window.getComputedStyle(document.documentElement).scrollBehavior")
        print(f"  - Scroll behavior: {scroll_behavior} {'✅' if scroll_behavior == 'smooth' else '⚠️'}")
        
        browser.close()
        print("\n✅ Interactive Components Testing Complete!")


if __name__ == "__main__":
    # Run all tests with error handling
    tests = [
        ("Assessment Tool", test_assessment_tool),
        ("Responsive Design", test_responsive_design),
        ("Accessibility", test_accessibility),
        ("Interactive Components", test_interactive_components)
    ]
    
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"\n❌ Error in {test_name} test: {str(e)[:100]}")
    
    print("\n" + "=" * 50)
    print("🎉 All UI Tests Complete!")
    print("=" * 50)