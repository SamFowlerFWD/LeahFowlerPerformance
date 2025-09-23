# UI/UX Fixes Implementation Checklist

## 🚨 PRIORITY 1: Critical WCAG Violations (Day 1)

### Colour Contrast Fixes
- [ ] Update brand colours in Tailwind config:
  - [ ] Change `#d4a574` → `#b88a54` (gold)
  - [ ] Change `#87a96b` → `#6b8557` (sage)
  - [ ] Change `#1a2942` → `#0f1b2e` (navy)
- [ ] Test all text/background combinations with WebAIM tool
- [ ] Update `globals.css` with new colour variables
- [ ] Fix button hover states for contrast
- [ ] Verify link colours meet 4.5:1 ratio

### Touch Target Compliance
- [ ] Add to `globals.css`: minimum button size 44x44px
- [ ] Update `MobileDock` component touch targets
- [ ] Fix close buttons in modals/popups
- [ ] Increase spacing between interactive elements (min 8px)
- [ ] Test all forms on mobile devices

### Horizontal Scroll Prevention
- [ ] Add `overflow-x: hidden` to body
- [ ] Audit all components for fixed widths
- [ ] Check `OnlinePackageShowcase` for overflow
- [ ] Fix container padding on mobile
- [ ] Test at 375px, 390px, 414px widths

---

## ⚠️ PRIORITY 2: Major Issues (Day 1-2)

### Padding Standardisation
- [ ] Create CSS custom properties for spacing scale
- [ ] Update all components to use consistent padding:
  - [ ] Buttons: `py-3 px-6` (12px 24px)
  - [ ] Cards: `p-6` (24px)
  - [ ] Sections: `py-16 md:py-20` (64px/80px)
- [ ] Remove inline styles with custom padding
- [ ] Update `mobile-optimizations.css`

### Z-Index Management
- [ ] Implement z-index scale in `globals.css`
- [ ] Update component z-indices:
  - [ ] `ModernHeader`: z-200
  - [ ] `MobileDock`: z-300
  - [ ] `ExitIntentPopup`: z-600
  - [ ] Modals: z-500
- [ ] Test overlapping elements
- [ ] Document z-index hierarchy

### Grid/Flex Alignment
- [ ] Add consistent gap values to all grids
- [ ] Fix testimonial card alignment
- [ ] Update footer column layout for tablet
- [ ] Test `AphroditePricingTiers` grid at all breakpoints
- [ ] Ensure proper `align-items` on all flex containers

---

## 📋 PRIORITY 3: Minor Improvements (Day 2-3)

### Focus Indicators
- [ ] Increase focus outline to 3px
- [ ] Ensure 3:1 contrast for focus colour
- [ ] Test keyboard navigation flow
- [ ] Add skip links for navigation

### Mobile Optimisations
- [ ] Reduce header height to 60-70px max
- [ ] Add safe area padding for iOS
- [ ] Fix text truncation in buttons
- [ ] Improve section spacing on mobile

### Performance
- [ ] Lazy load images below fold
- [ ] Optimise font loading
- [ ] Reduce CSS bundle size
- [ ] Implement critical CSS

---

## 🧪 TESTING CHECKLIST

### Automated Testing
- [ ] Run Lighthouse audit (target: 100 accessibility)
- [ ] Test with axe DevTools
- [ ] Run WAVE accessibility checker
- [ ] Validate HTML with W3C validator

### Manual Testing
- [ ] Test with keyboard only navigation
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Test on real devices:
  - [ ] iPhone SE (375px)
  - [ ] iPhone 14 (390px)
  - [ ] iPad (768px)
  - [ ] Desktop (1440px)
- [ ] Test in high contrast mode
- [ ] Test with browser zoom 200%

### Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari iOS
- [ ] Chrome Android

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Apply CSS Fixes
```bash
# 1. Import the recommended fixes
cat tests/ui-ux-inspection/recommended-fixes.css >> app/globals.css

# 2. Update Tailwind config with new colours
# 3. Rebuild CSS
npm run build
```

### Step 2: Update Components
1. Open each component file
2. Apply standardised classes
3. Remove inline styles
4. Test component in isolation

### Step 3: Global Testing
1. Start dev server: `npm run dev`
2. Open Chrome DevTools
3. Run Lighthouse audit
4. Fix any remaining issues

---

## ✅ SIGN-OFF CRITERIA

### Accessibility
- [ ] Lighthouse Accessibility: 100
- [ ] Zero WCAG AA violations
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader compatible

### Mobile Usability
- [ ] No horizontal scroll
- [ ] All touch targets ≥44x44px
- [ ] Text readable without zoom
- [ ] Forms usable on mobile

### Visual Consistency
- [ ] Consistent padding across components
- [ ] Aligned grid elements
- [ ] No unintended overlaps
- [ ] Proper focus indicators

### Performance
- [ ] Page load <2 seconds
- [ ] Core Web Vitals green
- [ ] Smooth scrolling
- [ ] No layout shifts

---

## 📊 SUCCESS METRICS

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Accessibility Score | ~75% | 100% | ⏳ |
| Mobile Usability | ~85% | 98% | ⏳ |
| Contrast Violations | 10-15 | 0 | ⏳ |
| Touch Target Issues | 5-10 | 0 | ⏳ |
| Horizontal Scroll | Yes | No | ⏳ |

---

## 🎯 NEXT STEPS

1. **Immediate:** Apply `recommended-fixes.css` to project
2. **Today:** Fix all critical WCAG violations
3. **Tomorrow:** Complete major issues and test
4. **Day 3:** Final testing and deployment

---

## 📚 RESOURCES

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Chrome DevTools Accessibility](https://developer.chrome.com/docs/devtools/accessibility/reference/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

*Checklist Generated: 2025-09-23*
*Estimated Completion: 2-3 days*
*Priority: CRITICAL - Legal compliance required*