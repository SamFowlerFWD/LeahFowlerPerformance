import type { Metadata } from 'next'
import PricingTiersWithStripe from '@/components/PricingTiersWithStripe'
import ComparisonTable from '@/components/ComparisonTable'
import TrustBar from '@/components/TrustBar'
import { generateServiceSchema } from '@/lib/schema-markup'

export const metadata: Metadata = {
  title: 'Training Packages & Pricing | Aphrodite Fitness Norfolk',
  description: 'Transform your strength with evidence-based training programmes. From £48 online foundation programme to premium 1:1 coaching. Small groups, semi-private, and personal training available.',
  keywords: 'personal training Norfolk, small group fitness classes, online fitness programmes, strength training Norwich, parent fitness programmes',
  openGraph: {
    title: 'Training Packages | Aphrodite Fitness Norfolk',
    description: 'Evidence-based strength training from £48. Small groups £120, Personal training from £140/month. Join 500+ parents transforming their strength.',
    url: 'https://leahfowlerperformance.com/services',
    siteName: 'Leah Fowler Performance',
    images: [
      {
        url: 'https://leahfowlerperformance.com/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'Leah Fowler Performance Coaching Services',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transform Your Performance | Services & Pricing',
    description: 'Strength training packages from £48. Small groups, personal training, and online programmes. Start your transformation today.',
    images: ['https://leahfowlerperformance.com/og-services.jpg'],
  },
  alternates: {
    canonical: 'https://leahfowlerperformance.com/services',
  },
}

export default function ServicesPage() {
  // Generate structured data for services
  const serviceSchema = generateServiceSchema()

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-dark to-black text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/40 text-gold font-medium text-sm mb-6">
              Transform Your Performance
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transform Your
              <span className="text-gradient-gold"> Strength</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Evidence-based strength training for busy parents.
              From £48 online foundation programme to premium 1:1 coaching.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-lg hover:shadow-2xl transition-all duration-300"
              >
                View Programmes
              </a>
              <a
                href="/assessment"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-gold text-gold font-bold text-lg hover:bg-gold hover:text-navy transition-all duration-300"
              >
                Take Assessment First
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gold/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-sage/20 rounded-full blur-3xl"></div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Pricing Section */}
      <div id="pricing">
        <PricingTiersWithStripe />
      </div>

      {/* Comparison Table */}
      <ComparisonTable />

      {/* VAT & Payment Information */}
      <section className="py-16 bg-gray-50 dark:bg-navy-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-navy dark:text-white">
            Payment Information
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-navy rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-navy dark:text-gold">
                VAT Information
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  All prices include UK VAT at 20%
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  VAT invoices provided for business expenses
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  Company registration: [Your VAT Number]
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-navy rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-navy dark:text-gold">
                Payment Security
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  Secure payment processing via Stripe
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  PCI DSS Level 1 compliant
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  Strong Customer Authentication (SCA) enabled
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-navy rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-navy dark:text-gold">
                Billing Options
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  Monthly: Standard pricing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  Quarterly: Save 15% on all programmes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  Annual: Save 20% on all programmes
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-navy rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-navy dark:text-gold">
                Cancellation Policy
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  Cancel anytime via your account dashboard
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  No cancellation fees
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  Access continues until end of billing period
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-navy-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <details className="bg-gray-50 dark:bg-navy rounded-xl p-6 cursor-pointer">
              <summary className="font-semibold text-lg text-navy dark:text-gold">
                Can I change my programme tier later?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Yes, you can upgrade or downgrade your programme at any time. Changes take effect at the next billing cycle, and we&apos;ll prorate any differences in price.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-navy rounded-xl p-6 cursor-pointer">
              <summary className="font-semibold text-lg text-navy dark:text-gold">
                Do you offer corporate or group discounts?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Yes, we offer corporate wellness packages and group discounts for teams of 5 or more. Contact us at corporate@leahfowlerperformance.com for custom pricing.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-navy rounded-xl p-6 cursor-pointer">
              <summary className="font-semibold text-lg text-navy dark:text-gold">
                Is there a minimum commitment period?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                No, all our programmes are flexible with no minimum commitment. However, we recommend at least 3 months to see significant, measurable results.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-navy rounded-xl p-6 cursor-pointer">
              <summary className="font-semibold text-lg text-navy dark:text-gold">
                What payment methods do you accept?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure Stripe payment system. Bank transfers are available for annual payments.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-navy rounded-xl p-6 cursor-pointer">
              <summary className="font-semibold text-lg text-navy dark:text-gold">
                Can I pause my subscription?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Yes, you can pause your subscription for up to 3 months per year for holidays or unexpected circumstances. Contact support to arrange a pause.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gold via-gold-light to-sage-light">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-navy">
            Ready to Transform Your Performance?
          </h2>
          <p className="text-xl text-navy/80 mb-8">
            Join 500+ high achievers who&apos;ve already started their journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-navy text-white font-bold text-lg hover:bg-navy-dark transition-all duration-300"
            >
              Choose Your Programme
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-navy font-bold text-lg hover:shadow-xl transition-all duration-300"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  )
}