'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

interface MetricData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// Performance thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 }
};

export function PerformanceMonitor() {
  useEffect(() => {
    // Send metrics to analytics
    const sendToAnalytics = async (metric: MetricData) => {
      const body = {
        metric: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        delta: Math.round(metric.delta),
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        // Device info
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height
        },
        // Connection info
        connection: (navigator as any).connection ? {
          effectiveType: (navigator as any).connection.effectiveType,
          downlink: (navigator as any).connection.downlink,
          rtt: (navigator as any).connection.rtt
        } : null
      };

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${metric.name}:`, {
          value: Math.round(metric.value),
          rating: metric.rating
        });
      }

      // Send to analytics endpoint
      try {
        await fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (error) {
        console.error('Failed to send performance metrics:', error);
      }

      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          metric_delta: Math.round(metric.delta),
          non_interaction: true
        });
      }
    };

    // Register web vitals callbacks
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);

    // Track resource loading performance
    if ('PerformanceObserver' in window) {
      // Track long tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              sendToAnalytics({
                name: 'LongTask',
                value: entry.duration,
                rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
                delta: 0,
                id: `lt-${Date.now()}`,
                navigationType: 'navigate'
              });
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task observer not supported
      }

      // Track resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;

            // Track slow resources
            if (resource.duration > 1000) {
              sendToAnalytics({
                name: 'SlowResource',
                value: resource.duration,
                rating: resource.duration > 3000 ? 'poor' : 'needs-improvement',
                delta: 0,
                id: `sr-${Date.now()}`,
                navigationType: resource.name
              });
            }

            // Track large resources
            if (resource.transferSize > 500000) { // 500KB
              sendToAnalytics({
                name: 'LargeResource',
                value: resource.transferSize,
                rating: resource.transferSize > 1000000 ? 'poor' : 'needs-improvement',
                delta: 0,
                id: `lr-${Date.now()}`,
                navigationType: resource.name
              });
            }
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Track paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint' || entry.name === 'first-contentful-paint') {
            sendToAnalytics({
              name: entry.name,
              value: entry.startTime,
              rating: entry.startTime < 1000 ? 'good' : entry.startTime < 2000 ? 'needs-improvement' : 'poor',
              delta: 0,
              id: `paint-${Date.now()}`,
              navigationType: 'navigate'
            });
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    }

    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      sendToAnalytics({
        name: 'JSError',
        value: 1,
        rating: 'poor',
        delta: 0,
        id: `error-${Date.now()}`,
        navigationType: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      sendToAnalytics({
        name: 'UnhandledRejection',
        value: 1,
        rating: 'poor',
        delta: 0,
        id: `rejection-${Date.now()}`,
        navigationType: String(event.reason)
      });
    });

    // Performance budget monitoring
    const checkPerformanceBudget = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart,
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnection: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          domParsing: navigation.domInteractive - navigation.responseEnd,
          domContentLoaded: navigation.domContentLoadedEventStart - navigation.fetchStart,
          pageLoad: navigation.loadEventEnd - navigation.fetchStart
        };

        // Check against budgets
        const budgets = {
          pageLoad: 3000,
          domContentLoaded: 2000,
          domInteractive: 1500
        };

        Object.entries(budgets).forEach(([metric, budget]) => {
          if (metrics[metric] > budget) {
            sendToAnalytics({
              name: 'BudgetExceeded',
              value: metrics[metric],
              rating: 'poor',
              delta: metrics[metric] - budget,
              id: `budget-${Date.now()}`,
              navigationType: metric
            });
          }
        });
      }
    };

    // Check performance budget after page load
    if (document.readyState === 'complete') {
      checkPerformanceBudget();
    } else {
      window.addEventListener('load', checkPerformanceBudget);
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (usedPercent > 90) {
          sendToAnalytics({
            name: 'HighMemoryUsage',
            value: usedPercent,
            rating: 'poor',
            delta: usedPercent - 90,
            id: `memory-${Date.now()}`,
            navigationType: 'memory'
          });
        }
      }, 30000); // Check every 30 seconds
    }

  }, []);

  return null; // This component doesn't render anything
}

// Export a function to manually track custom metrics
export function trackCustomMetric(name: string, value: number) {
  const rating = value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Custom Metric] ${name}: ${value}ms (${rating})`);
  }

  fetch('/api/analytics/custom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metric: name,
      value,
      rating,
      timestamp: Date.now(),
      url: window.location.href
    })
  }).catch(console.error);
}