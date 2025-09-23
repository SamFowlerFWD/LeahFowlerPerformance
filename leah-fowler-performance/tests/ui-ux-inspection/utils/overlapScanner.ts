import { Page } from '@playwright/test';

export interface OverlapIssue {
  selector1: string;
  selector2: string;
  viewport: string;
  overlapArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  severity: 'critical' | 'major' | 'minor';
  zIndex1?: string;
  zIndex2?: string;
  description: string;
  screenshot?: string;
}

export class OverlapScanner {
  constructor(private page: Page) {}

  async scanForOverlaps(): Promise<OverlapIssue[]> {
    const issues: OverlapIssue[] = [];

    // Get all visible elements
    const elements = await this.page.$$('*:visible');
    const elementData: Array<{
      element: any;
      bounds: any;
      zIndex: string;
      selector: string;
      isInteractive: boolean;
    }> = [];

    for (const element of elements) {
      const bounds = await element.boundingBox();
      if (!bounds || bounds.width === 0 || bounds.height === 0) continue;

      const data = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        const tagName = el.tagName.toLowerCase();
        const className = el.className || '';
        const id = el.id || '';

        return {
          display: computed.display,
          visibility: computed.visibility,
          position: computed.position,
          zIndex: computed.zIndex,
          opacity: computed.opacity,
          selector: id ? `#${id}` : className ? `.${className.split(' ')[0]}` : tagName,
          isInteractive: ['a', 'button', 'input', 'select', 'textarea'].includes(tagName) ||
                        el.onclick !== null ||
                        el.getAttribute('role') === 'button'
        };
      });

      if (data.display === 'none' ||
          data.visibility === 'hidden' ||
          parseFloat(data.opacity) === 0) continue;

      elementData.push({
        element,
        bounds,
        zIndex: data.zIndex,
        selector: data.selector,
        isInteractive: data.isInteractive
      });
    }

    // Check for overlaps
    for (let i = 0; i < elementData.length; i++) {
      for (let j = i + 1; j < elementData.length; j++) {
        const elem1 = elementData[i];
        const elem2 = elementData[j];

        // Skip if elements are parent-child
        const isParentChild = await this.areParentChild(elem1.element, elem2.element);
        if (isParentChild) continue;

        const overlap = this.calculateOverlap(elem1.bounds, elem2.bounds);

        if (overlap.width > 0 && overlap.height > 0) {
          // Check if overlap is intentional (z-index difference)
          const zIndex1 = parseInt(elem1.zIndex) || 0;
          const zIndex2 = parseInt(elem2.zIndex) || 0;
          const hasZIndexDifference = Math.abs(zIndex1 - zIndex2) > 0;

          // Determine severity
          let severity: 'critical' | 'major' | 'minor' = 'minor';
          let description = 'Elements overlap';

          if (elem1.isInteractive && elem2.isInteractive) {
            severity = 'critical';
            description = 'Interactive elements overlap - may block user interaction';
          } else if (elem1.isInteractive || elem2.isInteractive) {
            if (!hasZIndexDifference) {
              severity = 'major';
              description = 'Interactive element may be blocked';
            }
          } else if (overlap.width * overlap.height > 100) { // Significant overlap area
            severity = hasZIndexDifference ? 'minor' : 'major';
            description = hasZIndexDifference ?
              'Intentional overlay detected' :
              'Unintentional content overlap';
          }

          // Skip minor overlaps that are likely intentional
          if (hasZIndexDifference && severity === 'minor') continue;

          const viewport = this.page.viewportSize();
          issues.push({
            selector1: elem1.selector,
            selector2: elem2.selector,
            viewport: `${viewport?.width}x${viewport?.height}`,
            overlapArea: overlap,
            severity,
            zIndex1: elem1.zIndex,
            zIndex2: elem2.zIndex,
            description
          });
        }
      }
    }

    // Check for text overlap specifically
    await this.checkTextOverlap(issues);

    return issues;
  }

  private calculateOverlap(bounds1: any, bounds2: any): any {
    const left = Math.max(bounds1.x, bounds2.x);
    const right = Math.min(bounds1.x + bounds1.width, bounds2.x + bounds2.width);
    const top = Math.max(bounds1.y, bounds2.y);
    const bottom = Math.min(bounds1.y + bounds1.height, bounds2.y + bounds2.height);

    const width = Math.max(0, right - left);
    const height = Math.max(0, bottom - top);

    return { x: left, y: top, width, height };
  }

  private async areParentChild(elem1: any, elem2: any): Promise<boolean> {
    const result = await this.page.evaluate(
      ([e1, e2]) => {
        return e1.contains(e2) || e2.contains(e1);
      },
      [elem1, elem2]
    );
    return result;
  }

  private async checkTextOverlap(issues: OverlapIssue[]): Promise<void> {
    const textElements = await this.page.$$('h1, h2, h3, h4, h5, h6, p, span, a, button, label');
    const textBounds: Array<{ element: any; bounds: any; selector: string }> = [];

    for (const element of textElements) {
      const bounds = await element.boundingBox();
      if (!bounds) continue;

      const selector = await element.evaluate((el) => {
        const id = el.id || '';
        const className = el.className || '';
        const tagName = el.tagName.toLowerCase();
        return id ? `#${id}` : className ? `.${className.split(' ')[0]}` : tagName;
      });

      textBounds.push({ element, bounds, selector });
    }

    // Check for text overlapping other text
    for (let i = 0; i < textBounds.length; i++) {
      for (let j = i + 1; j < textBounds.length; j++) {
        const isParentChild = await this.areParentChild(
          textBounds[i].element,
          textBounds[j].element
        );
        if (isParentChild) continue;

        const overlap = this.calculateOverlap(textBounds[i].bounds, textBounds[j].bounds);

        if (overlap.width > 5 && overlap.height > 5) { // More than 5px overlap
          const viewport = this.page.viewportSize();
          issues.push({
            selector1: textBounds[i].selector,
            selector2: textBounds[j].selector,
            viewport: `${viewport?.width}x${viewport?.height}`,
            overlapArea: overlap,
            severity: 'critical',
            description: 'Text content overlapping - affects readability'
          });
        }
      }
    }
  }

  async captureOverlapScreenshot(selector1: string, selector2: string): Promise<string> {
    const timestamp = Date.now();
    const filename = `overlap-issue-${timestamp}.png`;

    // Highlight overlapping elements
    const elem1 = await this.page.$(selector1);
    const elem2 = await this.page.$(selector2);

    if (elem1) {
      await elem1.evaluate((el) => {
        (el as HTMLElement).style.outline = '2px solid red';
        (el as HTMLElement).style.outlineOffset = '2px';
      });
    }

    if (elem2) {
      await elem2.evaluate((el) => {
        (el as HTMLElement).style.outline = '2px solid blue';
        (el as HTMLElement).style.outlineOffset = '2px';
      });
    }

    await this.page.screenshot({
      path: `tests/ui-ux-inspection/screenshots/${filename}`,
      fullPage: false
    });

    // Remove highlights
    if (elem1) {
      await elem1.evaluate((el) => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
      });
    }

    if (elem2) {
      await elem2.evaluate((el) => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
      });
    }

    return filename;
  }
}