-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    tier TEXT NOT NULL CHECK (tier IN ('foundation', 'performance', 'elite', 'youth')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing', 'paused')),
    billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'quarterly', 'annual')),
    price_gbp INTEGER NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_payment_method_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    card_brand TEXT,
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT UNIQUE NOT NULL,
    invoice_number TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
    amount_paid INTEGER NOT NULL,
    amount_due INTEGER NOT NULL,
    amount_remaining INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    tax INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    currency TEXT DEFAULT 'gbp',
    description TEXT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    invoice_pdf TEXT,
    hosted_invoice_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription_items table
CREATE TABLE IF NOT EXISTS public.subscription_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    stripe_subscription_item_id TEXT UNIQUE NOT NULL,
    stripe_price_id TEXT NOT NULL,
    stripe_product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pricing_tiers table for reference
CREATE TABLE IF NOT EXISTS public.pricing_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tier TEXT UNIQUE NOT NULL CHECK (tier IN ('foundation', 'performance', 'elite', 'youth')),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    stripe_price_id_monthly TEXT,
    stripe_price_id_quarterly TEXT,
    stripe_price_id_annual TEXT,
    price_monthly_gbp INTEGER NOT NULL,
    price_quarterly_gbp INTEGER NOT NULL,
    price_annual_gbp INTEGER NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]',
    badge TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create webhook_events table for tracking
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    data JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    stripe_coupon_id TEXT,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    value INTEGER NOT NULL, -- percentage (0-100) or fixed amount in pence
    applies_to TEXT[] DEFAULT ARRAY[]::TEXT[], -- empty means all tiers
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_discounts table
CREATE TABLE IF NOT EXISTS public.customer_discounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    discount_code_id UUID REFERENCES public.discount_codes(id),
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_stripe_customer_id ON public.payment_methods(stripe_customer_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_subscription_id ON public.invoices(subscription_id);
CREATE INDEX idx_invoices_stripe_invoice_id ON public.invoices(stripe_invoice_id);
CREATE INDEX idx_webhook_events_stripe_event_id ON public.webhook_events(stripe_event_id);
CREATE INDEX idx_webhook_events_type ON public.webhook_events(type);
CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_items_updated_at BEFORE UPDATE ON public.subscription_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at BEFORE UPDATE ON public.pricing_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON public.discount_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_discounts ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON public.subscriptions
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Payment methods policies
CREATE POLICY "Users can view own payment methods" ON public.payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payment methods" ON public.payment_methods
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all invoices" ON public.invoices
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Subscription items policies (read-only for users)
CREATE POLICY "Users can view own subscription items" ON public.subscription_items
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM public.subscriptions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all subscription items" ON public.subscription_items
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Pricing tiers policies (public read)
CREATE POLICY "Anyone can view active pricing tiers" ON public.pricing_tiers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage pricing tiers" ON public.pricing_tiers
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Webhook events policies (service role only)
CREATE POLICY "Service role can manage webhook events" ON public.webhook_events
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Discount codes policies (public read for active codes)
CREATE POLICY "Anyone can view active discount codes" ON public.discount_codes
    FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Service role can manage discount codes" ON public.discount_codes
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Customer discounts policies
CREATE POLICY "Users can view own discounts" ON public.customer_discounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all customer discounts" ON public.customer_discounts
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Insert initial pricing tiers data
INSERT INTO public.pricing_tiers (tier, name, slug, price_monthly_gbp, price_quarterly_gbp, price_annual_gbp, description, features, badge, is_popular, display_order)
VALUES
    ('foundation', 'Foundation', 'foundation', 197, 497, 1970, 'For those building their commitment to excellence',
     '["Group Training (max 6 people)", "Trainerize App Programming", "Monthly Progress Reviews", "Access to Exercise Library", "Community Support Group", "Commitment Tracking Tools"]'::jsonb,
     NULL, false, 1),

    ('performance', 'Performance', 'performance', 497, 1297, 4970, 'For the seriously committed athlete or high achiever',
     '["Everything in Foundation, plus:", "Weekly 1-to-1 Coaching", "Fully Customised Programming", "Nutrition Optimisation Plan", "WhatsApp Support Access", "Competition Preparation", "Performance Testing & Metrics", "Recovery Protocol Design", "Monthly Performance Analysis"]'::jsonb,
     'MOST POPULAR', true, 2),

    ('elite', 'Elite Performance', 'elite', 997, 2497, 9970, 'For those pursuing excellence without compromise',
     '["Everything in Performance, plus:", "2x Weekly Training Sessions", "Competition & Event Preparation", "Full Lifestyle Optimisation", "Daily WhatsApp Check-ins", "Quarterly Testing & Assessment", "Priority Access to All Services", "Family Member Discount (25%)", "VIP Events & Masterminds", "Lifetime Alumni Benefits"]'::jsonb,
     NULL, false, 3),

    ('youth', 'Youth Development', 'youth', 297, 797, 2970, 'Safe strength training for young athletes (ages 8-18)',
     '["Age-Appropriate Programming", "Sport-Specific Development", "2x Weekly Group Sessions", "Long-Term Athletic Development", "Injury Prevention Focus", "Parent Education Included", "Quarterly Progress Testing", "Competition Preparation", "Nutritional Guidance for Growth", "Sibling Discount Available"]'::jsonb,
     'UNIQUE', false, 4)
ON CONFLICT (tier) DO NOTHING;