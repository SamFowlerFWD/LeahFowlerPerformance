import { Page } from '@playwright/test';

export interface ContrastIssue {
  selector: string;
  viewport: string;
  foreground: string;
  background: string;
  ratio: number;
  requiredRatio: number;
  level: 'AA' | 'AAA';
  fontSize: number;
  fontWeight: string;
  isLargeText: boolean;
  severity: 'critical' | 'major' | 'minor';
  wcagCriteria: string;
  recommendation: string;
  screenshot?: string;
}

export class ContrastValidator {
  constructor(private page: Page) {}

  async validateContrast(): Promise<ContrastIssue[]> {
    const issues: ContrastIssue[] = [];

    // Get all text elements
    const textElements = await this.page.$$('*');

    for (const element of textElements) {
      try {
        const hasText = await element.evaluate((el) => {
          const text = el.textContent?.trim();
          return text && text.length > 0 && el.children.length === 0;
        });

        if (!hasText) continue;

        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const getEffectiveBackground = (elem: Element): string => {
            let currentElem: Element | null = elem;
            while (currentElem) {
              const bg = window.getComputedStyle(currentElem).backgroundColor;
              if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                return bg;
              }
              currentElem = currentElem.parentElement;
            }
            return 'rgb(255, 255, 255)'; // Default to white
          };
          const getSelector = (elem: Element): string => {
            if (elem.id) return `#${elem.id}`;
            if (elem.className && typeof elem.className === 'string') {
              return `.${elem.className.split(' ')[0]}`;
            }
            return elem.tagName.toLowerCase();
          };
          return {
            color: computed.color,
            backgroundColor: getEffectiveBackground(el),
            fontSize: parseFloat(computed.fontSize),
            fontWeight: computed.fontWeight,
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            selector: getSelector(el)
          };
        });

        if (styles.display === 'none' ||
            styles.visibility === 'hidden' ||
            parseFloat(styles.opacity) === 0) continue;

        const foregroundRgb = this.parseColor(styles.color);
        const backgroundRgb = this.parseColor(styles.backgroundColor);

        if (!foregroundRgb || !backgroundRgb) continue;

        const ratio = this.calculateContrastRatio(foregroundRgb, backgroundRgb);
        const isLargeText = this.isLargeText(styles.fontSize, styles.fontWeight);

        // WCAG AA requirements
        const requiredRatioAA = isLargeText ? 3.0 : 4.5;
        const requiredRatioAAA = isLargeText ? 4.5 : 7.0;

        if (ratio < requiredRatioAA) {
          const viewport = this.page.viewportSize();
          issues.push({
            selector: styles.selector,
            viewport: `${viewport?.width}x${viewport?.height}`,
            foreground: styles.color,
            background: styles.backgroundColor,
            ratio: Math.round(ratio * 100) / 100,
            requiredRatio: requiredRatioAA,
            level: 'AA',
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            isLargeText,
            severity: ratio < 2.0 ? 'critical' : 'major',
            wcagCriteria: isLargeText ? '1.4.3 (Large Text)' : '1.4.3 (Normal Text)',
            recommendation: this.getRecommendation(foregroundRgb, backgroundRgb, requiredRatioAA)
          });
        }
      } catch (error) {
        console.error('Error checking contrast for element:', error);
      }
    }

    // Also check specific important elements
    await this.checkCriticalElements(issues);

    return issues;
  }

  private async checkCriticalElements(issues: ContrastIssue[]): Promise<void> {
    const criticalSelectors = [
      'button',
      'a',
      'input',
      'select',
      'textarea',
      '[role="button"]',
      '[role="link"]',
      'nav',
      'header',
      'footer'
    ];

    for (const selector of criticalSelectors) {
      const elements = await this.page.$$(selector);

      for (const element of elements) {
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();

          // Skip if element is not visible
          if (rect.width === 0 || rect.height === 0) return null;

          const getEffectiveBackground = (elem: Element): string => {
            let currentElem: Element | null = elem;
            while (currentElem) {
              const bg = window.getComputedStyle(currentElem).backgroundColor;
              if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                return bg;
              }
              currentElem = currentElem.parentElement;
            }
            return 'rgb(255, 255, 255)'; // Default to white
          };
          const getSelector = (elem: Element): string => {
            if (elem.id) return `#${elem.id}`;
            if (elem.className && typeof elem.className === 'string') {
              return `.${elem.className.split(' ')[0]}`;
            }
            return elem.tagName.toLowerCase();
          };
          return {
            color: computed.color,
            backgroundColor: getEffectiveBackground(el),
            borderColor: computed.borderColor,
            fontSize: parseFloat(computed.fontSize),
            fontWeight: computed.fontWeight,
            selector: getSelector(el)
          };
        });

        if (!styles) continue;

        // Check text contrast
        const foregroundRgb = this.parseColor(styles.color);
        const backgroundRgb = this.parseColor(styles.backgroundColor);

        if (foregroundRgb && backgroundRgb) {
          const ratio = this.calculateContrastRatio(foregroundRgb, backgroundRgb);

          // Interactive elements should have at least 3:1 contrast
          if (ratio < 3.0) {
            const viewport = this.page.viewportSize();
            issues.push({
              selector: styles.selector,
              viewport: `${viewport?.width}x${viewport?.height}`,
              foreground: styles.color,
              background: styles.backgroundColor,
              ratio: Math.round(ratio * 100) / 100,
              requiredRatio: 3.0,
              level: 'AA',
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              isLargeText: false,
              severity: 'critical',
              wcagCriteria: '1.4.11 (Non-text Contrast)',
              recommendation: 'Interactive elements require minimum 3:1 contrast'
            });
          }
        }

        // Check border contrast for form elements
        if (selector === 'input' || selector === 'select' || selector === 'textarea') {
          const borderRgb = this.parseColor(styles.borderColor);
          if (borderRgb && backgroundRgb) {
            const borderRatio = this.calculateContrastRatio(borderRgb, backgroundRgb);

            if (borderRatio < 3.0) {
              const viewport = this.page.viewportSize();
              issues.push({
                selector: `${styles.selector} (border)`,
                viewport: `${viewport?.width}x${viewport?.height}`,
                foreground: styles.borderColor,
                background: styles.backgroundColor,
                ratio: Math.round(borderRatio * 100) / 100,
                requiredRatio: 3.0,
                level: 'AA',
                fontSize: 0,
                fontWeight: 'normal',
                isLargeText: false,
                severity: 'major',
                wcagCriteria: '1.4.11 (Non-text Contrast)',
                recommendation: 'Form element borders require minimum 3:1 contrast'
              });
            }
          }
        }
      }
    }
  }

  private parseColor = (color: string): { r: number; g: number; b: number } | null => {
    if (!color || color === 'transparent') return null;

    // Handle rgb/rgba format
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }

    // Handle hex format
    const hexMatch = color.match(/^#([0-9a-f]{6})$/i);
    if (hexMatch) {
      const hex = hexMatch[1];
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      };
    }

    return null;
  }

  private calculateContrastRatio(fg: { r: number; g: number; b: number },
                                 bg: { r: number; g: number; b: number }): number {
    const l1 = this.relativeLuminance(fg);
    const l2 = this.relativeLuminance(bg);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  private relativeLuminance(rgb: { r: number; g: number; b: number }): number {
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private isLargeText(fontSize: number, fontWeight: string): boolean {
    const weightNum = parseInt(fontWeight) || 400;
    return fontSize >= 18 || (fontSize >= 14 && weightNum >= 700);
  }

  private getRecommendation(fg: { r: number; g: number; b: number },
                           bg: { r: number; g: number; b: number },
                           requiredRatio: number): string {
    // Calculate how much to adjust the foreground color
    const currentRatio = this.calculateContrastRatio(fg, bg);
    const adjustment = Math.ceil((requiredRatio / currentRatio) * 100 - 100);

    if (this.relativeLuminance(bg) > 0.5) {
      // Light background - darken text
      return `Darken text colour by approximately ${adjustment}% to meet WCAG AA standards`;
    } else {
      // Dark background - lighten text
      return `Lighten text colour by approximately ${adjustment}% to meet WCAG AA standards`;
    }
  }

  async captureContrastScreenshot(selector: string): Promise<string> {
    const element = await this.page.$(selector);
    if (!element) return '';

    const timestamp = Date.now();
    const filename = `contrast-issue-${timestamp}.png`;

    // Add visual indicator
    await element.evaluate((el) => {
      (el as HTMLElement).style.outline = '3px dashed red';
      (el as HTMLElement).style.outlineOffset = '3px';
    });

    await element.screenshot({
      path: `tests/ui-ux-inspection/screenshots/${filename}`,
      animations: 'disabled'
    });

    // Remove indicator
    await element.evaluate((el) => {
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.outlineOffset = '';
    });

    return filename;
  }
}