// Service Worker Registration with Performance Monitoring

export async function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('Service Worker registered successfully:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              if (confirm('New version available! Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });

      // Refresh on controller change
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      // Check for update every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Background sync registration
export async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register('sync-forms');
      console.log('Background sync registered');
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }
}

// Push notification subscription
export async function subscribeToPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Check current subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Subscribe
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;

        if (publicVapidKey) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          });

          // Send subscription to server
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          });
        }
      }

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }
}

// Helper function
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Check if app is installed
export function isAppInstalled() {
  if (typeof window === 'undefined') return false;

  // Check for iOS
  if ('standalone' in window.navigator) {
    return (window.navigator as any).standalone;
  }

  // Check for Android/Chrome
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
}

// Prompt for installation
export function promptInstall() {
  if (typeof window === 'undefined') return;

  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';

      installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;

          if (outcome === 'accepted') {
            console.log('User accepted install prompt');
            trackEvent('pwa_installed', {});
          } else {
            console.log('User dismissed install prompt');
          }

          deferredPrompt = null;
        }
      });
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    trackEvent('pwa_installed_success', {});
  });
}

// Track performance metrics
export function trackPerformance() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  if ('web-vitals' in window) {
    const { onCLS, onFID, onLCP, onTTFB, onFCP } = window['web-vitals'];

    onCLS((metric) => trackEvent('CLS', metric));
    onFID((metric) => trackEvent('FID', metric));
    onLCP((metric) => trackEvent('LCP', metric));
    onTTFB((metric) => trackEvent('TTFB', metric));
    onFCP((metric) => trackEvent('FCP', metric));
  }

  // Track resource timing
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          if (resource.duration > 1000) {
            trackEvent('slow_resource', {
              name: resource.name,
              duration: resource.duration,
              transferSize: resource.transferSize
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }
}

// Event tracking function
function trackEvent(eventName: string, data: any) {
  // Send to analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', eventName, data);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}:`, data);
  }

  // Send to custom endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: eventName, data, timestamp: Date.now() })
  }).catch(console.error);
}