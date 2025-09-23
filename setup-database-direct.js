#!/usr/bin/env node

/**
 * Direct Supabase Database Setup Script
 * This script manually creates tables and applies schema using Supabase JS client
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://ltlbfltlhysjxslusypq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bGJmbHRsaHlzanhzbHVzeXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwODIsImV4cCI6MjA3NDEzODA4Mn0.fn5vQl7Rm-mMPUbXBTFsFs-S9Fml-RFhlnTgoDxF9h8';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createSampleBlogData() {
  console.log('📝 Creating sample blog data...\n');

  try {
    // First, let's check if categories exist
    console.log('Checking categories table...');
    const { data: existingCategories, error: catCheckError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (catCheckError) {
      console.log('❌ Categories table not accessible:', catCheckError.message);
      console.log('\n⚠️  Tables need to be created first via SQL Editor\n');
      return false;
    }

    console.log('✅ Categories table exists\n');

    // Insert sample categories if they don't exist
    console.log('Inserting sample categories...');
    const categories = [
      {
        name: 'Performance Training',
        slug: 'performance-training',
        description: 'Articles about performance optimisation and training techniques',
        is_active: true
      },
      {
        name: 'Nutrition',
        slug: 'nutrition',
        description: 'Nutrition guides, meal plans, and dietary advice',
        is_active: true
      },
      {
        name: 'Recovery',
        slug: 'recovery',
        description: 'Recovery techniques, sleep optimization, and stress management',
        is_active: true
      },
      {
        name: 'Mindset',
        slug: 'mindset',
        description: 'Mental performance, psychology, and motivation strategies',
        is_active: true
      },
      {
        name: 'Success Stories',
        slug: 'success-stories',
        description: 'Client transformations and success stories',
        is_active: true
      }
    ];

    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'slug' });

      if (error) {
        console.log(`⚠️  Error inserting category ${category.name}:`, error.message);
      } else {
        console.log(`✅ Category created/updated: ${category.name}`);
      }
    }

    // Get category IDs for blog posts
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id, slug');

    const categoryMap = {};
    if (categoryData) {
      categoryData.forEach(cat => {
        categoryMap[cat.slug] = cat.id;
      });
    }

    console.log('\n📝 Creating sample blog posts...');

    // Sample blog posts with UK English
    const posts = [
      {
        title: 'The Science of Peak Performance: How to Optimise Your Daily Routine',
        subtitle: 'Evidence-based strategies for maximising your performance potential',
        slug: 'science-of-peak-performance',
        excerpt: 'Discover the neuroscience behind peak performance and learn how to structure your day for optimal productivity, focus, and energy levels.',
        content: `
# The Science of Peak Performance

Peak performance isn't about working harder—it's about working smarter. Through understanding the science behind human performance, we can optimise our daily routines to achieve extraordinary results whilst maintaining balance and wellbeing.

## Understanding Your Circadian Rhythms

Your body operates on a 24-hour biological clock that influences everything from hormone production to cognitive function. By aligning your activities with these natural rhythms, you can dramatically improve your performance.

### Morning: The Power Hours

Between 6 AM and 10 AM, your body experiences a natural surge in cortisol and testosterone, making this the ideal time for:

- High-intensity training
- Complex problem-solving
- Strategic planning
- Creative work

### Afternoon: The Execution Phase

From 10 AM to 2 PM, your body temperature rises and reaction times peak. This is optimal for:

- Collaborative meetings
- Detailed analytical work
- Skill practice
- Communication tasks

### Evening: Recovery and Consolidation

After 6 PM, your body begins preparing for rest. This period is crucial for:

- Light movement and stretching
- Reflection and journaling
- Social connection
- Preparation for the next day

## The Four Pillars of Performance Optimisation

### 1. Strategic Recovery

Recovery isn't just rest—it's an active process that drives adaptation and growth. Incorporate these evidence-based recovery protocols:

- **Sleep Optimisation**: Aim for 7-9 hours of quality sleep with consistent wake times
- **Active Recovery**: Low-intensity movement on rest days enhances blood flow and reduces soreness
- **Stress Management**: Regular meditation or breathwork reduces cortisol and improves focus

### 2. Nutritional Precision

Fuel your performance with targeted nutrition:

- **Protein Timing**: Consume 25-35g of protein within 2 hours post-training
- **Hydration Strategy**: Drink 35ml per kg of body weight daily, more during training
- **Micronutrient Focus**: Prioritise whole foods rich in vitamins, minerals, and antioxidants

### 3. Movement Quality

Quality trumps quantity in training:

- **Progressive Overload**: Gradually increase training demands week by week
- **Movement Variety**: Incorporate strength, endurance, and mobility work
- **Form First**: Perfect technique before adding intensity

### 4. Mental Conditioning

Train your mind like you train your body:

- **Visualisation**: Spend 10 minutes daily visualising successful performance
- **Goal Setting**: Use SMART goals with regular progress reviews
- **Mindfulness Practice**: Develop present-moment awareness to improve focus

## Implementing Your Performance Programme

Week 1-2: Foundation Building
- Establish consistent sleep and wake times
- Begin basic movement routine
- Start 5-minute daily meditation

Week 3-4: Optimisation
- Fine-tune nutrition timing
- Increase training intensity
- Add visualisation practice

Week 5-6: Integration
- Combine all elements
- Track key metrics
- Adjust based on results

## Measuring Success

Track these key performance indicators:

- Energy levels (1-10 daily rating)
- Sleep quality and duration
- Training progression
- Cognitive performance
- Mood and motivation

## The Path Forward

Performance optimisation is a journey, not a destination. By implementing these science-based strategies and consistently tracking your progress, you'll unlock levels of performance you never thought possible.

Remember: sustainable high performance comes from working with your body's natural systems, not against them.

*Ready to take your performance to the next level? Book your free performance assessment today and discover your personalised optimisation strategy.*
        `,
        category_id: categoryMap['performance-training'],
        status: 'published',
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        is_featured: true,
        meta_title: 'Science of Peak Performance | Performance Optimisation Guide',
        meta_description: 'Learn evidence-based strategies for peak performance. Discover how to optimise your daily routine for maximum productivity and wellbeing.',
        meta_keywords: ['peak performance', 'performance optimisation', 'productivity', 'daily routine', 'circadian rhythms'],
        content_type: 'guide',
        reading_time_minutes: 8,
        view_count: 342
      },
      {
        title: 'Nutrition for High Performers: The Complete Guide',
        subtitle: 'Fuel your ambition with evidence-based nutrition strategies',
        slug: 'nutrition-for-high-performers',
        excerpt: 'Master the nutritional strategies that elite athletes and top executives use to maintain peak performance throughout demanding schedules.',
        content: `
# Nutrition for High Performers: The Complete Guide

High performance demands high-quality fuel. Whether you're training for a marathon or managing a demanding career, your nutrition strategy can make the difference between burnout and breakthrough.

## The Performance Nutrition Framework

### Energy Systems and Fuel Sources

Your body operates three primary energy systems:

1. **Phosphocreatine System** (0-10 seconds): Explosive movements
2. **Glycolytic System** (10 seconds-2 minutes): High-intensity efforts
3. **Oxidative System** (2+ minutes): Endurance activities

Each system requires different nutritional support for optimal function.

## Macronutrient Optimisation

### Protein: The Building Blocks

**Daily Target**: 1.6-2.2g per kg of body weight

**Quality Sources**:
- Lean meats and poultry
- Fish and seafood
- Eggs and dairy
- Legumes and plant proteins

**Timing Strategy**:
- 25-35g every 3-4 hours
- Pre-sleep casein protein for overnight recovery
- Post-training window within 2 hours

### Carbohydrates: Performance Fuel

**Daily Target**: 3-7g per kg body weight (activity dependent)

**Strategic Timing**:
- Complex carbs 2-3 hours before training
- Simple carbs during extended sessions (>90 minutes)
- Recovery carbs within 30 minutes post-training

### Fats: Essential Functions

**Daily Target**: 0.8-1.2g per kg body weight

**Focus on Quality**:
- Omega-3 fatty acids for inflammation control
- MCT oils for rapid energy
- Whole food sources over processed oils

## Micronutrient Excellence

### Critical Vitamins and Minerals

**Iron**: Oxygen transport and energy production
- Men: 8mg/day
- Women: 18mg/day
- Sources: Red meat, spinach, fortified cereals

**Vitamin D**: Bone health and immune function
- Target: 1000-4000 IU daily
- Sources: Sunlight, fatty fish, fortified foods

**Magnesium**: Muscle function and recovery
- Target: 400-420mg (men), 310-320mg (women)
- Sources: Nuts, seeds, whole grains

**B Vitamins**: Energy metabolism
- Sources: Whole grains, meat, eggs, leafy greens

## Hydration Mastery

### Daily Hydration Protocol

**Baseline**: 35ml per kg body weight
**Training Addition**: 500-1000ml per hour of exercise
**Electrolyte Balance**: Add sodium during sessions >60 minutes

### Performance Hydration Timeline

**Pre-Training** (2-4 hours): 500-750ml
**During Training**: 150-250ml every 15-20 minutes
**Post-Training**: 150% of fluid lost through sweat

## Meal Planning for Performance

### Sample Daily Schedule

**6:00 AM - Pre-Training**
- Black coffee or green tea
- Banana with almond butter

**7:30 AM - Post-Training Breakfast**
- 3-egg omelette with vegetables
- Wholegrain toast
- Mixed berries
- Orange juice

**10:30 AM - Morning Snack**
- Greek yoghurt with nuts and honey
- Apple

**1:00 PM - Performance Lunch**
- Grilled salmon (150g)
- Quinoa (1 cup cooked)
- Mixed salad with olive oil
- Avocado

**3:30 PM - Afternoon Fuel**
- Protein shake
- Rice cakes with hummus

**6:30 PM - Recovery Dinner**
- Lean beef or chicken (150g)
- Sweet potato
- Steamed vegetables
- Side salad

**9:00 PM - Evening Snack**
- Cottage cheese with berries
- Handful of almonds

## Supplementation Strategy

### Evidence-Based Supplements

**Tier 1 - Strong Evidence**:
- Creatine Monohydrate: 5g daily
- Whey Protein: As needed to meet targets
- Caffeine: 3-6mg/kg pre-performance
- Beta-Alanine: 3-5g daily

**Tier 2 - Moderate Evidence**:
- Omega-3: 2-3g EPA/DHA daily
- Vitamin D3: 1000-4000 IU daily
- Probiotics: 10-20 billion CFU
- Multivitamin: Daily insurance policy

## Special Considerations

### Training Day Adjustments

**High-Intensity Days**: Increase carbs by 1-2g/kg
**Endurance Days**: Focus on sustained energy foods
**Recovery Days**: Emphasise protein and micronutrients

### Competition Nutrition

**Week Before**: Maintain normal eating patterns
**Day Before**: Slightly increase carbohydrates
**Competition Day**: Familiar foods only, tested strategy

## Common Nutrition Mistakes

1. **Under-fuelling**: Restricting calories impairs performance and recovery
2. **Poor Timing**: Missing the post-workout window
3. **Dehydration**: Starting sessions already depleted
4. **Supplement Reliance**: Prioritising pills over whole foods
5. **Extreme Diets**: Following trends instead of science

## Tracking Your Nutrition

### Key Metrics to Monitor

- Energy levels throughout the day
- Recovery between sessions
- Sleep quality
- Body composition changes
- Performance markers

## The Bottom Line

Nutrition for high performance isn't about perfection—it's about consistency and smart choices that support your goals. Start with the fundamentals, track your progress, and adjust based on your individual response.

*Transform your nutrition strategy with our personalised performance nutrition programmes. Book your consultation today.*
        `,
        category_id: categoryMap['nutrition'],
        status: 'published',
        published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        is_featured: true,
        meta_title: 'Nutrition for High Performers | Complete Nutrition Guide',
        meta_description: 'Master evidence-based nutrition strategies for peak performance. Learn optimal macronutrient ratios, meal timing, and supplementation.',
        meta_keywords: ['performance nutrition', 'sports nutrition', 'meal planning', 'supplements', 'hydration'],
        content_type: 'guide',
        reading_time_minutes: 12,
        view_count: 567
      },
      {
        title: 'From Exhausted to Energised: Sarah\'s 90-Day Transformation',
        subtitle: 'How a busy marketing executive reclaimed her energy and performance',
        slug: 'sarah-transformation-story',
        excerpt: 'Sarah went from struggling through her days to achieving her best performance in years. Discover her inspiring journey and practical strategies.',
        content: `
# From Exhausted to Energised: Sarah's 90-Day Transformation

*"I thought feeling exhausted was just part of having a demanding career. I couldn't have been more wrong."*

Meet Sarah Thompson, 38, Marketing Director at a leading tech firm and mother of two. Like many high achievers, she'd accepted chronic fatigue as the price of success—until she decided to rewrite her story.

## The Breaking Point

### Life Before Transformation

Sarah's typical day started at 5:30 AM with multiple alarms and ended past midnight with work emails. Despite consuming 5-6 cups of coffee daily, she struggled with:

- Constant fatigue despite sleeping 8 hours
- Afternoon energy crashes requiring sugar and caffeine
- Weekend recovery that never felt sufficient
- Exercise attempts that left her more exhausted
- Brain fog affecting her decision-making

"I was surviving, not thriving," Sarah reflects. "I knew something had to change when I fell asleep during my daughter's school play."

## The Assessment: Understanding the Root Causes

Sarah's initial performance assessment revealed several critical factors:

### Physical Analysis
- **Cortisol Imbalance**: Chronically elevated stress hormones
- **Poor Sleep Quality**: Only 15% deep sleep despite 8 hours in bed
- **Nutritional Gaps**: Skipping meals, then overeating
- **Dehydration**: Less than 1 litre of water daily
- **Sedentary Pattern**: 12+ hours sitting daily

### Performance Metrics
- Energy Levels: 3/10
- Focus Duration: 20 minutes maximum
- Stress Management: 2/10
- Physical Fitness: Below average for age
- Recovery Quality: Poor

## The Transformation Programme

### Week 1-3: Foundation Reset

**Morning Routine Revolution**
Instead of immediately checking emails, Sarah implemented a 20-minute morning protocol:
- 5 minutes of gentle movement
- 10 minutes of breathwork and meditation
- 5 minutes of intention setting

**Nutrition Timing**
- Protein-rich breakfast within 90 minutes of waking
- Scheduled lunch breaks (non-negotiable)
- Afternoon protein snack to prevent crashes
- Dinner by 7 PM to improve sleep quality

**Hydration Protocol**
- 500ml upon waking
- 250ml every hour until 6 PM
- Herbal tea in the evening

### Week 4-6: Building Momentum

**Strategic Training Introduction**
- 3x weekly 30-minute strength sessions
- 2x weekly 20-minute walks
- Weekend family active time

"I was skeptical about adding exercise when I was already exhausted," Sarah admits. "But within two weeks, I had more energy than before starting."

**Sleep Optimisation**
- 10 PM technology cutoff
- Bedroom temperature reduced to 18°C
- Blackout curtains installed
- Consistent wake time (6 AM daily)

### Week 7-9: Performance Enhancement

**Stress Management Tools**
- Lunchtime walking meetings
- 2-minute breathing exercises between meetings
- Friday afternoon planning sessions
- Sunday evening week preparation

**Workplace Optimisation**
- Standing desk implementation
- Hourly movement alarms
- Healthy snack preparation
- Water bottle always visible

### Week 10-12: Integration and Mastery

**Advanced Strategies**
- Morning cold exposure (cold shower finish)
- Quarterly fitness testing
- Monthly progress reviews
- Peer accountability partner

## The Results: Measurable Transformation

### 30-Day Markers
- Energy increased from 3/10 to 6/10
- Afternoon crashes eliminated
- Coffee reduced to 2 cups daily
- 5kg weight loss without dieting

### 60-Day Achievements
- Energy stable at 8/10
- Focus duration extended to 90 minutes
- Running first 5K in 5 years
- Promotion to Senior Director

### 90-Day Transformation
- Energy consistently 9/10
- Stress resilience dramatically improved
- 10kg total weight loss
- Best fitness level in a decade
- Work performance reviews: "Exceptional"

## The Ripple Effect

### Professional Impact
"My team noticed the change immediately. I was more present, decisive, and creative. My productivity increased while my working hours decreased."

### Family Benefits
"I'm actually present with my family now. We're active together, and I'm modelling healthy habits for my children."

### Personal Growth
"I've learned that high performance isn't about pushing harder—it's about working smarter with your body's natural systems."

## Sarah's Top 10 Transformation Tips

1. **Start Small**: Change one habit at a time
2. **Track Everything**: Data drives decisions
3. **Prioritise Sleep**: It's the foundation of performance
4. **Move Regularly**: Frequency matters more than intensity
5. **Fuel Properly**: Eat for energy, not emotion
6. **Manage Stress**: Build it into your schedule
7. **Stay Hydrated**: It's simpler than you think
8. **Find Accountability**: Share your journey
9. **Celebrate Wins**: Acknowledge progress
10. **Be Patient**: Transformation takes time

## The Science Behind Sarah's Success

### Cortisol Regulation
By implementing stress management techniques and improving sleep quality, Sarah's cortisol levels normalised, resulting in:
- Improved energy regulation
- Better fat metabolism
- Enhanced cognitive function
- Reduced inflammation

### Mitochondrial Function
The combination of strategic exercise and nutrition optimised cellular energy production:
- Increased ATP production
- Improved oxygen utilisation
- Enhanced recovery capacity
- Greater endurance

### Neurological Adaptation
Consistent practices created new neural pathways:
- Improved stress response
- Better decision-making
- Enhanced focus and clarity
- Increased resilience

## Your Transformation Starts Today

Sarah's story isn't unique—it's repeatable. The strategies that transformed her life are based on proven performance science that works for anyone willing to commit.

### Key Takeaways

**Week 1 Action Items**:
1. Complete a honest self-assessment
2. Identify your three biggest energy drains
3. Choose one morning routine element to implement
4. Track your baseline metrics

**The Investment**:
- Time: 60-90 minutes daily
- Energy: Initial increase for long-term gains
- Commitment: 90 days for lasting change

**The Return**:
- Sustainable high performance
- Improved health markers
- Enhanced quality of life
- Professional advancement
- Personal fulfilment

## Sarah's Message to You

*"If you're reading this feeling exhausted and overwhelmed, know that change is possible. I'm not special—I just followed a proven system with expert guidance. You're one decision away from transforming your life."*

## Ready to Write Your Transformation Story?

Every transformation begins with a single step. Sarah took hers with a performance assessment that revealed exactly what needed to change.

*Start your journey today with our free performance assessment and discover your personalised transformation path.*
        `,
        category_id: categoryMap['success-stories'],
        status: 'published',
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        is_featured: false,
        meta_title: 'Executive Energy Transformation | 90-Day Success Story',
        meta_description: 'Discover how Sarah transformed from exhausted to energised in 90 days. Real strategies, measurable results, inspiring journey.',
        meta_keywords: ['transformation story', 'executive performance', 'energy optimisation', 'success story', 'case study'],
        content_type: 'case_study',
        reading_time_minutes: 10,
        view_count: 892
      },
      {
        title: 'The Executive\'s Guide to Stress-Proof Performance',
        subtitle: 'Building resilience in high-pressure environments',
        slug: 'executive-stress-proof-performance',
        excerpt: 'Learn evidence-based techniques used by top performers to maintain excellence under pressure whilst protecting their wellbeing.',
        content: `
# The Executive's Guide to Stress-Proof Performance

Stress isn't your enemy—unmanaged stress is. Learn how to harness pressure for performance whilst maintaining your health and relationships.

## Understanding Executive Stress

### The Modern Performance Paradox

Today's executives face unprecedented challenges:
- Always-on connectivity
- Global competition
- Rapid change cycles
- Work-life integration challenges
- Performance pressure

Yet some leaders thrive whilst others burn out. The difference? Stress-proofing strategies.

## The Neuroscience of Stress

### Your Brain Under Pressure

When stressed, your brain activates the amygdala (fear centre), reducing prefrontal cortex function (executive decisions). This creates:

- Impaired judgement
- Reduced creativity
- Poor emotional regulation
- Decreased memory function
- Compromised decision-making

### The Performance Sweet Spot

Optimal performance occurs in the "challenge state"—enough stress to engage, not enough to overwhelm. This requires:

- Controlled sympathetic activation
- Maintained parasympathetic tone
- Balanced neurotransmitters
- Regulated inflammation

## The ARMOUR Framework

### A - Awareness
Recognise your stress signatures:
- Physical: Tension, fatigue, headaches
- Mental: Racing thoughts, difficulty concentrating
- Emotional: Irritability, anxiety, mood swings
- Behavioural: Overworking, withdrawal, poor habits

### R - Regulation
Master your stress response:
- Box breathing (4-4-4-4 pattern)
- Progressive muscle relaxation
- Mindfulness meditation
- Cold exposure therapy

### M - Movement
Strategic exercise for resilience:
- Morning movement to set cortisol rhythm
- Lunchtime walks to reset focus
- Evening yoga for transition
- Weekend nature exposure

### O - Optimisation
Design your environment:
- Dedicated workspace boundaries
- Technology-free zones
- Natural light exposure
- Calming visual elements

### U - Unity
Build your support network:
- Professional mentorship
- Peer accountability groups
- Family communication protocols
- Expert guidance team

### R - Recovery
Prioritise restoration:
- 7-9 hours quality sleep
- Weekly complete rest day
- Quarterly mini-breaks
- Annual proper holidays

## Daily Stress-Proofing Protocols

### Morning Foundation (20 minutes)
1. Wake at consistent time
2. 5 minutes meditation
3. 10 minutes movement
4. 5 minutes intention setting

### Workday Resilience
- Start with most important task
- 90-minute focus blocks
- 5-minute breaks between blocks
- Lunchtime disconnection

### Evening Recovery
- Work shutdown ritual
- Family presence time
- Light movement or stretching
- Sleep preparation routine

## Advanced Techniques

### Heart Rate Variability Training
Improve your stress resilience by training HRV:
- Morning HRV measurement
- Breathwork practices
- Biofeedback training
- Recovery monitoring

### Cognitive Reframing
Transform stress perception:
- Challenge to opportunity
- Threat to growth
- Pressure to privilege
- Stress to strength

### Nutritional Support
Fuel stress resilience:
- Adaptogenic herbs (ashwagandha, rhodiola)
- Omega-3 fatty acids
- Magnesium supplementation
- B-complex vitamins

## Your 30-Day Stress-Proofing Plan

### Week 1: Foundation
- Establish morning routine
- Begin breath practice
- Track stress levels

### Week 2: Implementation
- Add movement protocols
- Introduce boundaries
- Optimise workspace

### Week 3: Enhancement
- Develop support network
- Refine nutrition
- Improve sleep hygiene

### Week 4: Integration
- Combine all elements
- Assess progress
- Plan ongoing development

*Master stress and unlock your full potential. Book your executive performance consultation today.*
        `,
        category_id: categoryMap['mindset'],
        status: 'published',
        published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        is_featured: false,
        meta_title: 'Executive Stress Management | Stress-Proof Performance Guide',
        meta_description: 'Evidence-based stress management techniques for executives. Build resilience and maintain peak performance under pressure.',
        meta_keywords: ['stress management', 'executive performance', 'resilience', 'burnout prevention', 'leadership'],
        content_type: 'guide',
        reading_time_minutes: 7,
        view_count: 445
      },
      {
        title: 'Recovery Revolution: Why Rest Days Make You Stronger',
        subtitle: 'The science of strategic recovery for peak performance',
        slug: 'recovery-revolution-rest-days',
        excerpt: 'Discover why recovery is your secret weapon for sustainable high performance and learn how to optimise your rest for maximum results.',
        content: `
# Recovery Revolution: Why Rest Days Make You Stronger

"No pain, no gain" is killing your performance. Discover why strategic recovery is the missing link in your performance programme.

## The Recovery Paradox

### Growth Happens During Rest

Training provides the stimulus, but adaptation occurs during recovery:
- Muscle protein synthesis peaks 24-48 hours post-training
- Neural pathways consolidate during sleep
- Hormonal balance restored through rest
- Energy stores replenished between sessions

## The Science of Recovery

### Physiological Processes

**Protein Synthesis**: Repairs and builds muscle tissue
**Glycogen Replenishment**: Restores energy stores
**Hormone Regulation**: Balances testosterone, growth hormone, cortisol
**Inflammation Resolution**: Clears metabolic waste products
**Neural Recovery**: Restores neurotransmitter balance

### The Supercompensation Effect

Strategic recovery creates performance improvements:
1. Training creates functional decline
2. Recovery returns to baseline
3. Supercompensation exceeds previous capacity
4. New performance level established

## Recovery Strategies Ranked by Evidence

### Tier 1: Essential (Strong Evidence)
- **Sleep**: 7-9 hours nightly
- **Nutrition**: Adequate protein and calories
- **Hydration**: Consistent fluid intake
- **Stress Management**: Mental recovery

### Tier 2: Beneficial (Good Evidence)
- **Active Recovery**: Light movement
- **Stretching**: Maintained flexibility
- **Massage**: Improved circulation
- **Cold Therapy**: Reduced inflammation

### Tier 3: Optional (Emerging Evidence)
- **Compression Garments**: May aid recovery
- **Foam Rolling**: Self-myofascial release
- **Sauna**: Heat shock proteins
- **Supplements**: Targeted support

## The Complete Recovery Protocol

### Daily Recovery Practices
- 8+ hours sleep opportunity
- Post-workout nutrition within 2 hours
- Hydration throughout day
- 10 minutes stretching
- 5 minutes breathwork

### Weekly Recovery Schedule
- 1-2 complete rest days
- 2-3 active recovery sessions
- 1 massage or bodywork session
- Regular stress management
- Social connection time

### Monthly Recovery Cycles
- Week 1-3: Progressive training
- Week 4: Deload (50% volume)
- Track recovery markers
- Adjust based on response

*Transform your recovery strategy and unlock your true performance potential. Start your personalised programme today.*
        `,
        category_id: categoryMap['recovery'],
        status: 'published',
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        is_featured: false,
        meta_title: 'Recovery for Performance | Why Rest Days Make You Stronger',
        meta_description: 'Learn the science of strategic recovery for peak performance. Discover evidence-based recovery strategies to optimise your results.',
        meta_keywords: ['recovery', 'rest days', 'performance recovery', 'athletic recovery', 'supercompensation'],
        content_type: 'article',
        reading_time_minutes: 6,
        view_count: 234
      }
    ];

    console.log(`\nInserting ${posts.length} blog posts...`);

    for (const post of posts) {
      // Calculate word count
      post.word_count = post.content.split(/\s+/).length;

      const { error } = await supabase
        .from('posts')
        .upsert(post, { onConflict: 'slug' });

      if (error) {
        console.log(`⚠️  Error inserting post "${post.title}":`, error.message);
      } else {
        console.log(`✅ Post created: ${post.title}`);
      }
    }

    // Create sample tags
    console.log('\n🏷️  Creating sample tags...');
    const tags = [
      { name: 'Performance', slug: 'performance' },
      { name: 'Nutrition', slug: 'nutrition' },
      { name: 'Recovery', slug: 'recovery' },
      { name: 'Training', slug: 'training' },
      { name: 'Mindset', slug: 'mindset' },
      { name: 'Executive Health', slug: 'executive-health' },
      { name: 'Stress Management', slug: 'stress-management' },
      { name: 'Sleep', slug: 'sleep' },
      { name: 'Energy', slug: 'energy' },
      { name: 'Transformation', slug: 'transformation' }
    ];

    for (const tag of tags) {
      const { error } = await supabase
        .from('tags')
        .upsert(tag, { onConflict: 'slug' });

      if (error) {
        console.log(`⚠️  Error creating tag ${tag.name}:`, error.message);
      } else {
        console.log(`✅ Tag created: ${tag.name}`);
      }
    }

    return true;

  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
    return false;
  }
}

async function testBlogFunctionality() {
  console.log('\n🔍 Testing blog functionality...\n');

  try {
    // Test fetching posts
    console.log('Testing posts endpoint...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(name, slug)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10);

    if (postsError) {
      console.log('❌ Error fetching posts:', postsError.message);
      return false;
    }

    console.log(`✅ Successfully fetched ${posts ? posts.length : 0} published posts`);

    if (posts && posts.length > 0) {
      console.log('\nSample post:');
      console.log('  Title:', posts[0].title);
      console.log('  Slug:', posts[0].slug);
      console.log('  Category:', posts[0].category?.name || 'None');
      console.log('  Status:', posts[0].status);
      console.log('  Reading time:', posts[0].reading_time_minutes, 'minutes');
    }

    // Test fetching categories
    console.log('\nTesting categories endpoint...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (catError) {
      console.log('❌ Error fetching categories:', catError.message);
      return false;
    }

    console.log(`✅ Successfully fetched ${categories ? categories.length : 0} active categories`);

    if (categories && categories.length > 0) {
      console.log('\nCategories:');
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug})`);
      });
    }

    // Test fetching single post by slug
    if (posts && posts.length > 0) {
      console.log('\nTesting single post fetch...');
      const testSlug = posts[0].slug;

      const { data: singlePost, error: singleError } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('slug', testSlug)
        .single();

      if (singleError) {
        console.log('❌ Error fetching single post:', singleError.message);
        return false;
      }

      console.log(`✅ Successfully fetched post: "${singlePost.title}"`);
    }

    return true;

  } catch (error) {
    console.error('❌ Error testing blog functionality:', error.message);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('SUPABASE DATABASE SETUP - SAMPLE DATA');
  console.log('='.repeat(60));
  console.log('Project: Leah Fowler Performance Coach Platform');
  console.log('Database URL:', SUPABASE_URL);
  console.log('='.repeat(60) + '\n');

  // First check if tables exist
  console.log('🔍 Checking database status...\n');

  const { data: tablesCheck, error: tablesError } = await supabase
    .from('posts')
    .select('id')
    .limit(1);

  if (tablesError && tablesError.message.includes('relation "public.posts" does not exist')) {
    console.log('❌ Database tables do not exist yet!\n');
    console.log('⚠️  IMPORTANT: You need to create the database schema first.\n');
    console.log('Please follow these steps:\n');
    console.log('1. Go to your Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/ltlbfltlhysjxslusypq/sql/new\n');
    console.log('2. Copy the entire contents of:');
    console.log('   leah-fowler-performance/COMPLETE-SUPABASE-SETUP.sql\n');
    console.log('3. Paste into the SQL Editor\n');
    console.log('4. Click "Run" to execute all statements\n');
    console.log('5. Then run this script again to add sample data\n');
    console.log('='.repeat(60));
    process.exit(1);
  }

  console.log('✅ Database tables exist\n');

  // Create sample data
  const dataCreated = await createSampleBlogData();

  if (!dataCreated) {
    console.log('\n⚠️  Some issues occurred during data creation');
  }

  // Test blog functionality
  const testsPass = await testBlogFunctionality();

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('SETUP SUMMARY');
  console.log('='.repeat(60));

  if (dataCreated && testsPass) {
    console.log('✅ Sample data created successfully');
    console.log('✅ Blog functionality is working');
    console.log('\n🎉 Your database is ready to use!');
    console.log('\nYou can now:');
    console.log('- View blog posts at /blog');
    console.log('- View individual posts at /blog/[slug]');
    console.log('- Access categories and tags');
    console.log('- Start building your platform features');
  } else {
    console.log('⚠️  Setup completed with some issues');
    console.log('\nPlease check the errors above and:');
    console.log('1. Ensure all tables are created in Supabase');
    console.log('2. Check RLS policies are properly configured');
    console.log('3. Verify your API keys are correct');
  }

  console.log('\n' + '='.repeat(60));
}

// Run the setup
main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n❌ Fatal error:', err);
    process.exit(1);
  });