import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export interface Route {
  path: string;
  isDynamic: boolean;
  component: string;
}

export function discoverRoutes(appDir: string): Route[] {
  const routes: Route[] = [];

  function scanDirectory(dir: string, basePath: string = '') {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        // Skip api, components, and other non-route directories
        if (['api', 'components', 'lib', 'utils'].includes(item)) continue;

        // Check for dynamic routes
        if (item.startsWith('[') && item.endsWith(']')) {
          // For now, we'll test with sample values
          const paramName = item.slice(1, -1);
          routes.push({
            path: basePath + '/sample-' + paramName,
            isDynamic: true,
            component: fullPath
          });
        } else {
          // Regular route
          const routePath = basePath + '/' + item;

          // Check if it has a page.tsx
          try {
            const pageFile = join(fullPath, 'page.tsx');
            if (readdirSync(fullPath).includes('page.tsx')) {
              routes.push({
                path: routePath === '' ? '/' : routePath,
                isDynamic: false,
                component: pageFile
              });
            }
          } catch (e) {
            // Directory might not have page.tsx
          }

          // Continue scanning subdirectories
          scanDirectory(fullPath, routePath);
        }
      }
    }
  }

  scanDirectory(appDir);

  // Add root route
  routes.push({
    path: '/',
    isDynamic: false,
    component: join(appDir, 'page.tsx')
  });

  return routes;
}

export const VIEWPORTS = [
  { name: 'mobile-sm', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop-sm', width: 1024, height: 768 },
  { name: 'desktop-md', width: 1440, height: 900 },
  { name: 'desktop-lg', width: 1920, height: 1080 }
];