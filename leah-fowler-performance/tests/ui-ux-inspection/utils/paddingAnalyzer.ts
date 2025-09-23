import { Page, Locator } from '@playwright/test';

export interface PaddingIssue {
  selector: string;
  element: string;
  viewport: string;
  computedPadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  expectedPadding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  deviation: number;
  severity: 'critical' | 'major' | 'minor';
  screenshot?: string;
}

export class PaddingAnalyzer {
  private baseline: Map<string, { top: number; right: number; bottom: number; left: number }> = new Map();

  constructor(private page: Page) {}

  async analyzePadding(selectors: string[]): Promise<PaddingIssue[]> {
    const issues: PaddingIssue[] = [];

    for (const selector of selectors) {
      try {
        const elements = await this.page.$$(selector);

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const boundingBox = await element.boundingBox();
          if (!boundingBox) continue;

          const styles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              paddingTop: parseFloat(computed.paddingTop),
              paddingRight: parseFloat(computed.paddingRight),
              paddingBottom: parseFloat(computed.paddingBottom),
              paddingLeft: parseFloat(computed.paddingLeft),
              display: computed.display,
              visibility: computed.visibility,
            };
          });

          if (styles.display === 'none' || styles.visibility === 'hidden') continue;

          const padding = {
            top: styles.paddingTop,
            right: styles.paddingRight,
            bottom: styles.paddingBottom,
            left: styles.paddingLeft,
          };

          // Check for inconsistent padding
          const key = `${selector}-${i}`;
          if (!this.baseline.has(selector)) {
            this.baseline.set(selector, padding);
          } else {
            const baseline = this.baseline.get(selector)!;
            const deviation = this.calculateDeviation(padding, baseline);

            if (deviation > 20) { // More than 20% deviation
              const viewport = this.page.viewportSize();
              issues.push({
                selector: `${selector}:nth-of-type(${i + 1})`,
                element: selector,
                viewport: `${viewport?.width}x${viewport?.height}`,
                computedPadding: padding,
                expectedPadding: baseline,
                deviation,
                severity: deviation > 50 ? 'critical' : deviation > 30 ? 'major' : 'minor',
              });
            }
          }

          // Check for asymmetric padding
          if (this.isAsymmetric(padding)) {
            const viewport = this.page.viewportSize();
            issues.push({
              selector: `${selector}:nth-of-type(${i + 1})`,
              element: selector,
              viewport: `${viewport?.width}x${viewport?.height}`,
              computedPadding: padding,
              deviation: this.calculateAsymmetryDeviation(padding),
              severity: 'minor',
            });
          }
        }
      } catch (error) {
        console.error(`Error analyzing padding for ${selector}:`, error);
      }
    }

    return issues;
  }

  private calculateDeviation(current: any, baseline: any): number {
    const diffs = [
      Math.abs(current.top - baseline.top) / (baseline.top || 1),
      Math.abs(current.right - baseline.right) / (baseline.right || 1),
      Math.abs(current.bottom - baseline.bottom) / (baseline.bottom || 1),
      Math.abs(current.left - baseline.left) / (baseline.left || 1),
    ];
    return Math.max(...diffs) * 100;
  }

  private isAsymmetric(padding: any): boolean {
    const horizontal = Math.abs(padding.left - padding.right);
    const vertical = Math.abs(padding.top - padding.bottom);
    return horizontal > 2 || vertical > 2; // More than 2px difference
  }

  private calculateAsymmetryDeviation(padding: any): number {
    const horizontal = Math.abs(padding.left - padding.right);
    const vertical = Math.abs(padding.top - padding.bottom);
    return Math.max(horizontal, vertical);
  }

  async captureScreenshot(selector: string): Promise<string> {
    const element = await this.page.$(selector);
    if (!element) return '';

    const timestamp = Date.now();
    const filename = `padding-issue-${timestamp}.png`;
    await element.screenshot({
      path: `tests/ui-ux-inspection/screenshots/${filename}`,
      animations: 'disabled'
    });
    return filename;
  }
}