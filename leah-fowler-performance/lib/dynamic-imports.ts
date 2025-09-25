import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component with skeleton
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

// Dynamic import helper with error boundary
export function createDynamicComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    loading?: ComponentType;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading || LoadingSpinner,
    ssr: options?.ssr ?? true,
  });
}

// Heavy component dynamic imports
export const DynamicTiptapEditor = dynamic(
  () => import('@/components/TiptapEditor').then(mod => mod.default),
  {
    loading: LoadingSpinner,
    ssr: false
  }
);

export const DynamicStripeCheckout = dynamic(
  () => import('@/components/StripeCheckout').then(mod => mod.default),
  {
    loading: LoadingSpinner,
    ssr: false
  }
);

export const DynamicPerformanceChart = dynamic(
  () => import('@/components/PerformanceChart').then(mod => mod.default),
  {
    loading: LoadingSkeleton,
    ssr: false
  }
);

export const DynamicVideoPlayer = dynamic(
  () => import('@/components/VideoPlayer').then(mod => mod.default),
  {
    loading: LoadingSpinner,
    ssr: false
  }
);

export const DynamicImageGallery = dynamic(
  () => import('@/components/ImageGallery').then(mod => mod.default),
  {
    loading: LoadingSkeleton,
    ssr: true
  }
);

// Radix UI dynamic imports for rarely used components
export const DynamicDialog = dynamic(
  () => import('@radix-ui/react-dialog').then(mod => mod.Root),
  { ssr: true }
);

export const DynamicTabs = dynamic(
  () => import('@radix-ui/react-tabs').then(mod => mod.Root),
  { ssr: true }
);

export const DynamicAccordion = dynamic(
  () => import('@radix-ui/react-accordion').then(mod => mod.Root),
  { ssr: true }
);

// Framer Motion animations - lazy load for non-critical animations
export const DynamicAnimatedSection = dynamic(
  () => import('@/components/AnimatedSection').then(mod => mod.default),
  { ssr: false }
);

export const DynamicParallaxSection = dynamic(
  () => import('@/components/ParallaxSection').then(mod => mod.default),
  { ssr: false }
);

// Page-specific heavy components
export const DynamicPerformanceAccelerator = dynamic(
  () => import('@/app/performance-accelerator/page'),
  {
    loading: LoadingSpinner,
    ssr: true
  }
);

export const DynamicAssessmentForm = dynamic(
  () => import('@/components/AssessmentForm').then(mod => mod.default),
  {
    loading: LoadingSkeleton,
    ssr: false
  }
);

export const DynamicTestimonials = dynamic(
  () => import('@/components/Testimonials').then(mod => mod.default),
  {
    loading: LoadingSkeleton,
    ssr: true
  }
);

// Admin components - only load when needed
export const DynamicAdminDashboard = dynamic(
  () => import('@/components/admin/Dashboard').then(mod => mod.default),
  {
    loading: LoadingSpinner,
    ssr: false
  }
);

export const DynamicAdminAnalytics = dynamic(
  () => import('@/components/admin/Analytics').then(mod => mod.default),
  {
    loading: LoadingSpinner,
    ssr: false
  }
);

// Utility function to preload components
export const preloadComponent = (componentName: keyof typeof componentMap) => {
  const component = componentMap[componentName];
  if (component && typeof component === 'function') {
    component();
  }
};

// Component map for preloading
const componentMap = {
  TiptapEditor: () => import('@/components/TiptapEditor'),
  StripeCheckout: () => import('@/components/StripeCheckout'),
  PerformanceChart: () => import('@/components/PerformanceChart'),
  VideoPlayer: () => import('@/components/VideoPlayer'),
  ImageGallery: () => import('@/components/ImageGallery'),
  AnimatedSection: () => import('@/components/AnimatedSection'),
  ParallaxSection: () => import('@/components/ParallaxSection'),
  AssessmentForm: () => import('@/components/AssessmentForm'),
  Testimonials: () => import('@/components/Testimonials'),
  AdminDashboard: () => import('@/components/admin/Dashboard'),
  AdminAnalytics: () => import('@/components/admin/Analytics'),
};