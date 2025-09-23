import { Page } from '@playwright/test';

export interface AlignmentIssue {
  selector: string;
  element: string;
  viewport: string;
  type: 'horizontal' | 'vertical' | 'grid' | 'flex';
  expectedAlignment: number;
  actualAlignment: number;
  deviation: number;
  severity: 'critical' | 'major' | 'minor';
  affectedElements: string[];
  screenshot?: string;
}

export class AlignmentDetector {
  constructor(private page: Page) {}

  async detectAlignmentIssues(): Promise<AlignmentIssue[]> {
    const issues: AlignmentIssue[] = [];

    // Check grid and flex containers
    const containers = await this.page.$$('[class*="grid"], [class*="flex"]');

    for (const container of containers) {
      const containerClass = await container.getAttribute('class');
      const isGrid = containerClass?.includes('grid');
      const isFlex = containerClass?.includes('flex');

      const children = await container.$$(':scope > *');
      if (children.length < 2) continue;

      const childPositions: { element: any; bounds: any }[] = [];

      for (const child of children) {
        const bounds = await child.boundingBox();
        if (bounds) {
          childPositions.push({ element: child, bounds });
        }
      }

      // Check horizontal alignment
      if (isFlex && containerClass?.includes('flex-row')) {
        const baselineY = childPositions[0]?.bounds.y;
        for (let i = 1; i < childPositions.length; i++) {
          const deviation = Math.abs(childPositions[i].bounds.y - baselineY);
          if (deviation > 2) { // More than 2px misalignment
            const viewport = this.page.viewportSize();
            issues.push({
              selector: containerClass || 'unknown',
              element: 'flex-container',
              viewport: `${viewport?.width}x${viewport?.height}`,
              type: 'horizontal',
              expectedAlignment: baselineY,
              actualAlignment: childPositions[i].bounds.y,
              deviation,
              severity: deviation > 10 ? 'critical' : deviation > 5 ? 'major' : 'minor',
              affectedElements: [`child-${i}`],
            });
          }
        }
      }

      // Check vertical alignment
      if (isFlex && containerClass?.includes('flex-col')) {
        const baselineX = childPositions[0]?.bounds.x;
        for (let i = 1; i < childPositions.length; i++) {
          const deviation = Math.abs(childPositions[i].bounds.x - baselineX);
          if (deviation > 2) {
            const viewport = this.page.viewportSize();
            issues.push({
              selector: containerClass || 'unknown',
              element: 'flex-container',
              viewport: `${viewport?.width}x${viewport?.height}`,
              type: 'vertical',
              expectedAlignment: baselineX,
              actualAlignment: childPositions[i].bounds.x,
              deviation,
              severity: deviation > 10 ? 'critical' : deviation > 5 ? 'major' : 'minor',
              affectedElements: [`child-${i}`],
            });
          }
        }
      }

      // Check grid alignment
      if (isGrid) {
        const rows: Map<number, any[]> = new Map();
        const cols: Map<number, any[]> = new Map();

        // Group elements by approximate row/column
        for (const pos of childPositions) {
          const row = Math.round(pos.bounds.y / 50) * 50; // 50px threshold
          const col = Math.round(pos.bounds.x / 50) * 50;

          if (!rows.has(row)) rows.set(row, []);
          if (!cols.has(col)) cols.set(col, []);

          rows.get(row)!.push(pos);
          cols.get(col)!.push(pos);
        }

        // Check row alignment
        for (const [rowY, elements] of rows) {
          if (elements.length < 2) continue;
          const heights = elements.map(e => e.bounds.height);
          const maxHeight = Math.max(...heights);
          const minHeight = Math.min(...heights);

          if (maxHeight - minHeight > 5) {
            const viewport = this.page.viewportSize();
            issues.push({
              selector: containerClass || 'unknown',
              element: 'grid-container',
              viewport: `${viewport?.width}x${viewport?.height}`,
              type: 'grid',
              expectedAlignment: maxHeight,
              actualAlignment: minHeight,
              deviation: maxHeight - minHeight,
              severity: 'major',
              affectedElements: [`row at y=${rowY}`],
            });
          }
        }
      }
    }

    // Check text alignment
    await this.checkTextAlignment(issues);

    return issues;
  }

  private async checkTextAlignment(issues: AlignmentIssue[]): Promise<void> {
    const textElements = await this.page.$$('h1, h2, h3, h4, h5, h6, p, div[class*="text"], span[class*="text"]');

    const groups: Map<number, any[]> = new Map();

    for (const element of textElements) {
      const bounds = await element.boundingBox();
      if (!bounds) continue;

      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          textAlign: computed.textAlign,
          display: computed.display,
          visibility: computed.visibility,
        };
      });

      if (styles.display === 'none' || styles.visibility === 'hidden') continue;

      // Group by approximate vertical position
      const groupY = Math.round(bounds.y / 100) * 100;
      if (!groups.has(groupY)) {
        groups.set(groupY, []);
      }
      groups.get(groupY)!.push({ element, bounds, styles });
    }

    // Check alignment within groups
    for (const [groupY, elements] of groups) {
      if (elements.length < 2) continue;

      const centerAligned = elements.filter(e => e.styles.textAlign === 'center');
      const leftAligned = elements.filter(e => e.styles.textAlign === 'left' || e.styles.textAlign === 'start');

      if (centerAligned.length > 0 && leftAligned.length > 0) {
        const viewport = this.page.viewportSize();
        issues.push({
          selector: `text-group-${groupY}`,
          element: 'text-elements',
          viewport: `${viewport?.width}x${viewport?.height}`,
          type: 'horizontal',
          expectedAlignment: 0,
          actualAlignment: 0,
          deviation: elements.length,
          severity: 'minor',
          affectedElements: ['mixed text alignment in same section'],
        });
      }
    }
  }

  async captureScreenshot(selector: string): Promise<string> {
    const element = await this.page.$(selector);
    if (!element) return '';

    const timestamp = Date.now();
    const filename = `alignment-issue-${timestamp}.png`;

    // Highlight the misaligned element
    await element.evaluate((el) => {
      (el as HTMLElement).style.outline = '2px solid red';
      (el as HTMLElement).style.outlineOffset = '2px';
    });

    await element.screenshot({
      path: `tests/ui-ux-inspection/screenshots/${filename}`,
      animations: 'disabled'
    });

    // Remove highlight
    await element.evaluate((el) => {
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.outlineOffset = '';
    });

    return filename;
  }
}