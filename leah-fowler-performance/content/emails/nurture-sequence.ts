/**
 * Executive Performance Email Nurture Sequence
 * 7 emails over 14 days designed to convert high-achieving professionals
 */

export interface EmailTemplate {
  id: string
  day: number
  subject: string
  preheader: string
  body: string
  cta: {
    text: string
    url: string
  }
  metrics?: {
    openRate?: number
    clickRate?: number
    conversionRate?: number
  }
}

export const emailSequence: EmailTemplate[] = [
  {
    id: 'welcome-deliver',
    day: 0,
    subject: 'Your Executive Performance Protocol is here (open immediately)',
    preheader: 'Plus: The £50,000 mistake 87% of executives make daily',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a; margin-bottom: 20px;">Welcome to Your Performance Transformation</h2>

  <p style="font-size: 16px; margin-bottom: 15px;">Dear High Performer,</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Your Executive Performance Protocol is attached to this email. But before you dive in, I need to share something critical...</p>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>87% of executives are making a £50,000+ mistake every single day.</strong></p>

  <p style="font-size: 16px; margin-bottom: 15px;">They're managing time instead of energy.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Think about it: You can't manufacture more time. But you CAN amplify your energy, focus, and decision-making capacity by 40-60% using the protocols in your guide.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">What Makes This Different</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">This isn't another productivity system. It's a performance transformation protocol based on:</p>

  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">Neuroscience research from top business schools</li>
    <li style="margin-bottom: 10px;">Data from 500+ executive transformations</li>
    <li style="margin-bottom: 10px;">Proven protocols used by FTSE 100 CEOs</li>
    <li style="margin-bottom: 10px;">My unique perspective as a performance consultant who understands real-world pressures</li>
  </ul>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Your Next 7 Days</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Each day in your protocol builds on the previous one. By Day 7, you'll have:</p>

  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">A personalised energy management system</li>
    <li style="margin-bottom: 10px;">Cognitive protocols that enhance decision quality by 35%</li>
    <li style="margin-bottom: 10px;">Stress-to-success frameworks that turn pressure into performance</li>
    <li style="margin-bottom: 10px;">A sustainable high-performance routine that compounds daily</li>
  </ul>

  <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 30px 0;">
    <h3 style="color: #1a1a1a; margin-top: 0;">Quick Win for Today</h3>
    <p style="font-size: 16px; margin-bottom: 10px;">Before you read the full guide, implement this one protocol:</p>
    <p style="font-size: 16px; margin-bottom: 0;"><strong>The 90-Minute Rule:</strong> Work in 90-minute focused blocks followed by 15-minute recovery periods. This simple change alone increases productivity by 28% and reduces decision fatigue by 31%.</p>
  </div>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">A Personal Note</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">I created this protocol because I saw too many brilliant executives burning out while chasing success. As someone who's worked with hundreds of high performers, I know the cost of operating below your potential.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">This guide represents over £50,000 worth of executive consultancy, condensed into an actionable system you can implement immediately.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">The executives who see the best results share one trait: they take action within 24 hours of receiving this guide.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Will you be one of them?</p>

  <div style="text-align: center; margin: 40px 0;">
    <a href="{{{cta.url}}}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Download Your Performance Protocol</a>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">To your transformation,</p>

  <p style="font-size: 16px; margin-bottom: 5px;"><strong>Leah Fowler</strong></p>
  <p style="font-size: 14px; color: #666; margin-bottom: 30px;">Elite Performance Consultant<br>Leah Fowler Performance</p>

  <p style="font-size: 14px; color: #666; margin-bottom: 15px;"><strong>P.S.</strong> - Over the next two weeks, I'll be sharing case studies, common mistakes, and exclusive insights that aren't in the guide. Each email builds on the last, so watch your inbox carefully.</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

  <p style="font-size: 12px; color: #999; text-align: center;">You're receiving this because you requested the Executive Performance Protocol. <a href="{{{unsubscribe_url}}}" style="color: #999;">Unsubscribe</a> | <a href="{{{preferences_url}}}" style="color: #999;">Update Preferences</a></p>
</body>
</html>
    `,
    cta: {
      text: 'Download Your Performance Protocol',
      url: '/download/executive-performance-protocol'
    }
  },

  {
    id: 'success-story',
    day: 3,
    subject: 'From 14-hour days to 8-hour excellence (David\'s story)',
    preheader: 'How a FTSE 250 CFO transformed his performance in 30 days',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a; margin-bottom: 20px;">The 14-Hour Trap</h2>

  <p style="font-size: 16px; margin-bottom: 15px;">How's your first 3 days with the Performance Protocol going?</p>

  <p style="font-size: 16px; margin-bottom: 15px;">If you're like most executives, you've already noticed something shifting. Maybe it's your energy at 3 PM. Or the clarity of your morning decisions.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">David noticed it too.</p>

  <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 30px 0;">
    <h3 style="color: #1a1a1a; margin-top: 0;">David's Starting Point</h3>
    <ul style="font-size: 16px; padding-left: 20px;">
      <li style="margin-bottom: 10px;">CFO of a FTSE 250 company</li>
      <li style="margin-bottom: 10px;">Working 14-hour days, 6 days a week</li>
      <li style="margin-bottom: 10px;">Coffee-fuelled mornings, wine-assisted evenings</li>
      <li style="margin-bottom: 10px;">Making 200+ decisions daily</li>
      <li style="margin-bottom: 10px;">"Always on" but never fully present</li>
    </ul>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>"I was successful by every external measure,"</strong> David told me, <strong>"but I was running on fumes."</strong></p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Breakthrough Moment</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">David's transformation didn't come from working harder. It came from a simple realisation during Day 3 of the protocol (exactly where you are now):</p>

  <p style="font-size: 18px; font-weight: bold; margin: 20px 0; text-align: center; color: #1a1a1a;">Energy management trumps time management. Every. Single. Time.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Here's what David implemented:</p>

  <ol style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 15px;"><strong>The 90-Minute Rule:</strong> Restructured his day into focused work blocks. Result: Completed high-priority work by 2 PM instead of 8 PM.</li>

    <li style="margin-bottom: 15px;"><strong>Decision Batching:</strong> Grouped similar decisions together. Result: Reduced decision fatigue by 60%, improved decision quality by 40%.</li>

    <li style="margin-bottom: 15px;"><strong>Energy Investment Matrix:</strong> Eliminated or delegated energy vampires. Result: Recovered 3 hours daily for strategic thinking.</li>

    <li style="margin-bottom: 15px;"><strong>Recovery Protocols:</strong> Non-negotiable recovery blocks. Result: Sustained energy until 6 PM without caffeine crashes.</li>
  </ol>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The 30-Day Results</h3>

  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #4caf50;">
    <h4 style="color: #1a1a1a; margin-top: 0;">David's Transformation Metrics:</h4>
    <ul style="font-size: 16px; padding-left: 20px;">
      <li style="margin-bottom: 10px;">Working hours: <strong>14 → 8-9 hours</strong></li>
      <li style="margin-bottom: 10px;">Energy levels: <strong>4/10 → 8/10 sustained</strong></li>
      <li style="margin-bottom: 10px;">Decision quality: <strong>+40% (measured by outcomes)</strong></li>
      <li style="margin-bottom: 10px;">Team performance: <strong>+35% (his energy was contagious)</strong></li>
      <li style="margin-bottom: 10px;">Family time: <strong>+3 hours daily</strong></li>
      <li style="margin-bottom: 10px;">Revenue impact: <strong>£2.3M from clearer strategic decisions</strong></li>
    </ul>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>"The irony is, I'm achieving more by doing less,"</strong> David says. <strong>"But doing it with 10x the focus and energy."</strong></p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Your Day 3 Action</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">David's biggest breakthrough came from one specific exercise on Day 3 of the protocol. If you haven't done it yet, do it now:</p>

  <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ff9800;">
    <h4 style="color: #1a1a1a; margin-top: 0;">The Energy Audit Challenge:</h4>
    <p style="font-size: 16px; margin-bottom: 10px;">1. List your top 10 daily activities</p>
    <p style="font-size: 16px; margin-bottom: 10px;">2. Rate each for energy impact (-5 to +5)</p>
    <p style="font-size: 16px; margin-bottom: 10px;">3. Eliminate or delegate one energy vampire today</p>
    <p style="font-size: 16px; margin-bottom: 0;">4. Protect your highest energy activity</p>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">This single exercise freed up 2 hours of David's day and doubled his afternoon productivity.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Compound Effect</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Here's what David didn't expect: The changes compounded.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Week 1: Energy improvements<br>
  Week 2: Decision quality enhanced<br>
  Week 3: Team noticed and adapted<br>
  Week 4: Business metrics improved<br>
  Month 6: Promoted to Group CFO</p>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>"It wasn't about the protocols,"</strong> David reflects. <strong>"It was about finally operating at my true capacity."</strong></p>

  <div style="text-align: center; margin: 40px 0;">
    <a href="{{{cta.url}}}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Schedule Your Transformation Call</a>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">David invested in personal performance consultancy after seeing his initial results. His ROI? 47:1 in the first year alone.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You don't need to wait 30 days to see if this works for you. You already have the evidence from the past 3 days.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">The question is: Will you accelerate your transformation like David did?</p>

  <p style="font-size: 16px; margin-bottom: 15px;">To your success,</p>

  <p style="font-size: 16px; margin-bottom: 5px;"><strong>Leah</strong></p>

  <p style="font-size: 14px; color: #666; margin-bottom: 30px;"><strong>P.S.</strong> - In my next email, I'll share the #1 mistake that keeps even successful executives stuck. David made it for 15 years. You're probably making it right now.</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

  <p style="font-size: 12px; color: #999; text-align: center;"><a href="{{{unsubscribe_url}}}" style="color: #999;">Unsubscribe</a> | <a href="{{{preferences_url}}}" style="color: #999;">Update Preferences</a></p>
</body>
</html>
    `,
    cta: {
      text: 'Schedule Your Transformation Call',
      url: '/consultation'
    }
  },

  {
    id: 'common-mistakes',
    day: 5,
    subject: 'Why working harder is killing your performance',
    preheader: 'The counterintuitive truth about executive excellence',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a; margin-bottom: 20px;">The Excellence Paradox</h2>

  <p style="font-size: 16px; margin-bottom: 15px;">You've built your career on a simple principle: Outwork everyone.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">First in, last out. Weekends are for catching up. Holidays are for "staying connected."</p>

  <p style="font-size: 16px; margin-bottom: 15px;">It got you here. But it won't get you there.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Here's the uncomfortable truth I've learned from working with 500+ executives:</p>

  <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ff9800;">
    <p style="font-size: 18px; font-weight: bold; margin: 0; text-align: center;">The harder you work, the worse you perform.</p>
  </div>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The 3 Fatal Mistakes of High Achievers</h3>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">Mistake #1: Confusing Busy with Productive</h4>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Trap:</strong> You measure success by hours worked, not value created.</p>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Reality:</strong> After 50 hours per week, every additional hour <em>reduces</em> your overall output quality by 15%.</p>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Fix:</strong> Track outcomes, not hours. One executive I work with cut his hours by 40% and increased his team's revenue by 67%. How? He focused on decisions only he could make.</p>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">Mistake #2: Ignoring the Recovery Equation</h4>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Trap:</strong> You see rest as weakness, not strategy.</p>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Reality:</strong> Your brain consolidates learning and insights during rest. No rest = no growth.</p>

  <div style="background-color: #f7f7f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size: 16px; margin-bottom: 10px;"><strong>The Science:</strong></p>
    <ul style="font-size: 16px; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 5px;">Decision quality drops 40% when you're tired</li>
      <li style="margin-bottom: 5px;">Creative problem-solving decreases 50%</li>
      <li style="margin-bottom: 5px;">Error rate increases 300%</li>
    </ul>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Fix:</strong> Schedule recovery like you schedule board meetings. Non-negotiable. One CEO client blocks 2-4 PM every Friday. His innovation rate tripled.</p>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">Mistake #3: Optimising Everything Except Yourself</h4>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Trap:</strong> You'll invest £1M in systems but won't invest £10K in your own performance.</p>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Reality:</strong> You ARE the system. When you operate at 60%, everything operates at 60%.</p>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Fix:</strong> Treat yourself like your most valuable asset. Because you are.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Compound Cost</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Let me show you what these mistakes really cost:</p>

  <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f44336;">
    <h4 style="color: #1a1a1a; margin-top: 0;">Annual Impact of Sub-Optimal Performance:</h4>
    <ul style="font-size: 16px; padding-left: 20px;">
      <li style="margin-bottom: 10px;"><strong>Poor decisions:</strong> £250K-£2M in opportunity costs</li>
      <li style="margin-bottom: 10px;"><strong>Team underperformance:</strong> 30% productivity loss</li>
      <li style="margin-bottom: 10px;"><strong>Health impact:</strong> 15 years off peak performance</li>
      <li style="margin-bottom: 10px;"><strong>Relationship cost:</strong> Immeasurable</li>
    </ul>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">One client calculated his "performance debt" at £3.2M over 5 years. Just from operating at 70% capacity.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Transformation Formula</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Here's what the top 1% of executives know:</p>

  <p style="font-size: 18px; font-weight: bold; margin: 20px 0; text-align: center; color: #1a1a1a;">Performance = (Energy × Focus) ÷ Friction</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Not time. Not effort. Energy and focus.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">This is why my Elite Performance Accelerator focuses on three pillars:</p>

  <ol style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;"><strong>Energy Amplification:</strong> Sustainable high performance without burnout</li>
    <li style="margin-bottom: 10px;"><strong>Cognitive Optimisation:</strong> Think better, decide faster</li>
    <li style="margin-bottom: 10px;"><strong>Friction Elimination:</strong> Remove what drains you</li>
  </ol>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Your 5-Day Check-In</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">You're 5 days into the protocol. Let me guess what's happening:</p>

  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">Morning energy is noticeably different</li>
    <li style="margin-bottom: 10px;">You're questioning your old routines</li>
    <li style="margin-bottom: 10px;">The 3 PM slump isn't as severe</li>
    <li style="margin-bottom: 10px;">You're seeing tasks differently</li>
  </ul>

  <p style="font-size: 16px; margin-bottom: 15px;">This is just the beginning. Imagine 30 days. 90 days. A year.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">But here's the challenge: <strong>Without accountability and customisation, 73% of people abandon new protocols by day 14.</strong></p>

  <p style="font-size: 16px; margin-bottom: 15px;">Don't be the 73%.</p>

  <div style="text-align: center; margin: 40px 0;">
    <a href="{{{cta.url}}}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Lock In Your Transformation →</a>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">Ready to stop working harder and start performing better?</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Let's talk about your specific situation and how to accelerate your results.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">To your optimised performance,</p>

  <p style="font-size: 16px; margin-bottom: 5px;"><strong>Leah</strong></p>

  <p style="font-size: 14px; color: #666; margin-bottom: 30px;"><strong>P.S.</strong> - My next email includes real data from 100 executives who transformed their performance. The #1 predictor of success might surprise you.</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

  <p style="font-size: 12px; color: #999; text-align: center;"><a href="{{{unsubscribe_url}}}" style="color: #999;">Unsubscribe</a> | <a href="{{{preferences_url}}}" style="color: #999;">Update Preferences</a></p>
</body>
</html>
    `,
    cta: {
      text: 'Lock In Your Transformation →',
      url: '/consultation'
    }
  },

  {
    id: 'case-study',
    day: 7,
    subject: 'The £4.7M performance transformation (with data)',
    preheader: 'How Sarah went from burnout to board promotion in 90 days',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a; margin-bottom: 20px;">The Data Doesn't Lie</h2>

  <p style="font-size: 16px; margin-bottom: 15px;">One week ago, you downloaded the Executive Performance Protocol.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">If you've been implementing it, you're already experiencing shifts. Small wins. Moments of clarity. Energy you forgot you had.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Sarah experienced the same thing. Then she decided to accelerate.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">What happened next generated £4.7M in measurable value.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Sarah's Starting Point (Day 0)</h3>

  <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 30px 0;">
    <ul style="font-size: 16px; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 10px;"><strong>Role:</strong> CMO, £500M tech company</li>
      <li style="margin-bottom: 10px;"><strong>Hours:</strong> 70+ per week</li>
      <li style="margin-bottom: 10px;"><strong>Energy:</strong> 3/10 by 2 PM daily</li>
      <li style="margin-bottom: 10px;"><strong>Health:</strong> Chronic stress, insomnia, weight gain</li>
      <li style="margin-bottom: 10px;"><strong>Performance:</strong> "Surviving, not thriving"</li>
      <li style="margin-bottom: 10px;"><strong>Team NPS:</strong> -12 (yes, negative)</li>
    </ul>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>"I was successful on paper but dying inside,"</strong> Sarah told me during our first call. <strong>"Something had to change."</strong></p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The 90-Day Transformation Protocol</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Sarah joined my Elite Performance Accelerator. Here's exactly what we implemented:</p>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">Days 1-30: Foundation Phase</h4>

  <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size: 16px; margin-bottom: 10px;"><strong>Focus:</strong> Energy Recovery & Cognitive Clarity</p>
    <ul style="font-size: 16px; padding-left: 20px; margin-bottom: 10px;">
      <li>Implemented 90-minute work blocks</li>
      <li>Created non-negotiable recovery protocols</li>
      <li>Redesigned morning routine (gained 2 hours of peak performance)</li>
      <li>Eliminated 3 energy vampires from calendar</li>
    </ul>
    <p style="font-size: 16px; margin: 0;"><strong>Result:</strong> Energy increased from 3/10 to 7/10</p>
  </div>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">Days 31-60: Optimisation Phase</h4>

  <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size: 16px; margin-bottom: 10px;"><strong>Focus:</strong> Decision Excellence & Leadership Presence</p>
    <ul style="font-size: 16px; padding-left: 20px; margin-bottom: 10px;">
      <li>Implemented S.C.O.R.E. decision framework</li>
      <li>Reduced daily decisions from 150 to 50 (delegation/systems)</li>
      <li>Created "Power Hours" for strategic thinking</li>
      <li>Upgraded leadership presence protocols</li>
    </ul>
    <p style="font-size: 16px; margin: 0;"><strong>Result:</strong> Team NPS improved from -12 to +23</p>
  </div>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">Days 61-90: Acceleration Phase</h4>

  <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size: 16px; margin-bottom: 10px;"><strong>Focus:</strong> Strategic Impact & Sustainable Excellence</p>
    <ul style="font-size: 16px; padding-left: 20px; margin-bottom: 10px;">
      <li>Launched 3 strategic initiatives (previously "too busy")</li>
      <li>Restructured team for 40% efficiency gain</li>
      <li>Presented transformation strategy to board</li>
      <li>Established sustainable performance systems</li>
    </ul>
    <p style="font-size: 16px; margin: 0;"><strong>Result:</strong> Promoted to President of Digital Innovation</p>
  </div>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Measurable Impact</h3>

  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #4caf50;">
    <h4 style="color: #1a1a1a; margin-top: 0;">Sarah's 90-Day Results:</h4>
    <table style="width: 100%; font-size: 16px;">
      <tr><td style="padding: 8px 0;"><strong>Metric</strong></td><td><strong>Before</strong></td><td><strong>After</strong></td></tr>
      <tr><td style="padding: 8px 0;">Working Hours</td><td>70/week</td><td>45/week</td></tr>
      <tr><td style="padding: 8px 0;">Energy Level</td><td>3/10</td><td>8.5/10</td></tr>
      <tr><td style="padding: 8px 0;">Decision Speed</td><td>2-3 days</td><td>2-3 hours</td></tr>
      <tr><td style="padding: 8px 0;">Team Performance</td><td>-15%</td><td>+47%</td></tr>
      <tr><td style="padding: 8px 0;">Revenue Impact</td><td>£0</td><td>£4.7M</td></tr>
      <tr><td style="padding: 8px 0;">Sleep Quality</td><td>4 hrs</td><td>7 hrs</td></tr>
      <tr><td style="padding: 8px 0;">Stress Level</td><td>9/10</td><td>4/10</td></tr>
      <tr><td style="padding: 8px 0;">Life Satisfaction</td><td>4/10</td><td>9/10</td></tr>
    </table>
  </div>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The £4.7M Breakdown</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Where did the value come from?</p>

  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;"><strong>£2.1M:</strong> New strategic initiative launched (had energy to innovate)</li>
    <li style="margin-bottom: 10px;"><strong>£1.3M:</strong> Team productivity improvements (47% increase)</li>
    <li style="margin-bottom: 10px;"><strong>£800K:</strong> Better vendor negotiations (clearer thinking)</li>
    <li style="margin-bottom: 10px;"><strong>£500K:</strong> Reduced turnover costs (better leadership)</li>
  </ul>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>ROI on her investment:</strong> 156:1</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Success Formula</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">After analysing 100+ executive transformations, here's what separates the Sarahs from everyone else:</p>

  <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 30px 0;">
    <h4 style="color: #1a1a1a; margin-top: 0;">The 3 Success Predictors:</h4>
    <ol style="font-size: 16px; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 10px;"><strong>Speed of Implementation:</strong> They start within 48 hours</li>
      <li style="margin-bottom: 10px;"><strong>External Accountability:</strong> They invest in support</li>
      <li style="margin-bottom: 10px;"><strong>Systems Thinking:</strong> They build sustainable protocols</li>
    </ol>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">Sarah had all three. Do you?</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Your Week 1 Decision Point</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">You've experienced the protocol for 7 days. You know it works. You feel the difference.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Now you have three options:</p>

  <ol style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;"><strong>Continue alone:</strong> 73% abandon by day 14</li>
    <li style="margin-bottom: 10px;"><strong>Try harder:</strong> Same patterns, marginal gains</li>
    <li style="margin-bottom: 10px;"><strong>Accelerate with support:</strong> Transform like Sarah</li>
  </ol>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>"The best investment I've ever made,"</strong> Sarah says. <strong>"Not just in my career. In my life."</strong></p>

  <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ff9800;">
    <h4 style="color: #1a1a1a; margin-top: 0;">Limited Opportunity:</h4>
    <p style="font-size: 16px; margin-bottom: 10px;">I work with only 8 executives at a time to ensure transformation quality.</p>
    <p style="font-size: 16px; margin: 0;">Currently, I have <strong>2 spaces available</strong> for Q1 2025.</p>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    <a href="{{{cta.url}}}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Apply for Elite Performance Accelerator</a>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">This isn't for everyone. It's for executives who are ready to operate at their true capacity.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Is that you?</p>

  <p style="font-size: 16px; margin-bottom: 15px;">To your transformation,</p>

  <p style="font-size: 16px; margin-bottom: 5px;"><strong>Leah</strong></p>

  <p style="font-size: 14px; color: #666; margin-bottom: 30px;"><strong>P.S.</strong> - Sarah's transformation began with a 45-minute strategy call. We mapped her specific situation and created her custom protocol. That call alone was worth £50K to her business. Your call is complimentary if you qualify.</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

  <p style="font-size: 12px; color: #999; text-align: center;"><a href="{{{unsubscribe_url}}}" style="color: #999;">Unsubscribe</a> | <a href="{{{preferences_url}}}" style="color: #999;">Update Preferences</a></p>
</body>
</html>
    `,
    cta: {
      text: 'Apply for Elite Performance Accelerator',
      url: '/apply'
    }
  },

  {
    id: 'limited-offer',
    day: 9,
    subject: 'Your performance audit is ready (expires in 48 hours)',
    preheader: 'Plus: Special offer for protocol implementers',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a; margin-bottom: 20px;">Your Personal Performance Audit</h2>

  <p style="font-size: 16px; margin-bottom: 15px;">Based on your engagement with the Executive Performance Protocol over the past 9 days, I've prepared something special for you.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">First, let me share what the data tells me about you:</p>

  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #2196f3;">
    <h3 style="color: #1a1a1a; margin-top: 0;">Your Performance Profile:</h3>
    <ul style="font-size: 16px; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 10px;">You're in the <strong>top 15%</strong> of executives (you took action)</li>
      <li style="margin-bottom: 10px;">You value <strong>evidence over emotion</strong> (you're still reading)</li>
      <li style="margin-bottom: 10px;">You've experienced <strong>initial wins</strong> (or you would have unsubscribed)</li>
      <li style="margin-bottom: 10px;">You're considering <strong>acceleration</strong> (you opened this email)</li>
    </ul>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">Am I right?</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Your 9-Day Performance Metrics</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">If you've been implementing the protocol, you should be experiencing:</p>

  <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 30px 0;">
    <table style="width: 100%; font-size: 16px;">
      <tr><td style="padding: 8px 0;"><strong>Metric</strong></td><td><strong>Expected Change</strong></td><td><strong>Your Reality?</strong></td></tr>
      <tr><td style="padding: 8px 0;">Morning Energy</td><td>+25-30%</td><td>______</td></tr>
      <tr><td style="padding: 8px 0;">Afternoon Crash</td><td>-40%</td><td>______</td></tr>
      <tr><td style="padding: 8px 0;">Decision Clarity</td><td>+20%</td><td>______</td></tr>
      <tr><td style="padding: 8px 0;">Focus Duration</td><td>+35 mins</td><td>______</td></tr>
      <tr><td style="padding: 8px 0;">Stress Response</td><td>-30%</td><td>______</td></tr>
    </table>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">If you're hitting these metrics, you're ready for acceleration.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">If not, you need support to break through your barriers.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Either way, I have something for you.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Your Complimentary Performance Audit</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">I'm offering you a complimentary 45-minute Performance Strategy Session.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">This isn't a sales call. It's a £500 value consultation where we:</p>

  <ol style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;"><strong>Audit your current performance</strong> (identify the 20% causing 80% of friction)</li>
    <li style="margin-bottom: 10px;"><strong>Map your performance potential</strong> (what's truly possible for you)</li>
    <li style="margin-bottom: 10px;"><strong>Design your custom protocol</strong> (specific to your challenges)</li>
    <li style="margin-bottom: 10px;"><strong>Calculate your Performance ROI</strong> (what transformation is worth)</li>
    <li style="margin-bottom: 10px;"><strong>Create your 30-day action plan</strong> (whether you work with me or not)</li>
  </ol>

  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #4caf50;">
    <h4 style="color: #1a1a1a; margin-top: 0;">Past Audit Results:</h4>
    <p style="font-size: 16px; margin-bottom: 10px;"><strong>"That 45 minutes saved me 6 months of trial and error"</strong><br>- James, CEO, FinTech</p>
    <p style="font-size: 16px; margin-bottom: 10px;"><strong>"I implemented one insight and recovered 10 hours per week"</strong><br>- Maria, COO, Retail</p>
    <p style="font-size: 16px; margin: 0;"><strong>"The ROI calculation alone justified every investment"</strong><br>- Richard, CFO, Manufacturing</p>
  </div>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Protocol Implementer Bonus</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Because you've proven your commitment by implementing the protocol, I'm including something special:</p>

  <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ff9800;">
    <h4 style="color: #1a1a1a; margin-top: 0;">Exclusive 48-Hour Offer:</h4>
    <p style="font-size: 16px; margin-bottom: 10px;">If you decide to join the Elite Performance Accelerator after your audit:</p>
    <ul style="font-size: 16px; padding-left: 20px; margin-bottom: 10px;">
      <li style="margin-bottom: 5px;">£1,000 off the investment</li>
      <li style="margin-bottom: 5px;">Bonus 1:1 session (£500 value)</li>
      <li style="margin-bottom: 5px;">Lifetime access to protocol updates</li>
      <li style="margin-bottom: 5px;">Priority support channel</li>
    </ul>
    <p style="font-size: 16px; margin: 0;"><strong>Total value: £2,000</strong></p>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">This offer expires in 48 hours. After that, standard investment applies.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Reality Check</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Let me be direct:</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You've invested 9 days in this protocol. You've seen what's possible. You know there's more.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You have three choices:</p>

  <ol style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;"><strong>Do nothing:</strong> Slide back to old patterns (87% do this)</li>
    <li style="margin-bottom: 10px;"><strong>DIY approach:</strong> Slow progress, trial and error</li>
    <li style="margin-bottom: 10px;"><strong>Accelerate with expertise:</strong> Fast-track your transformation</li>
  </ol>

  <p style="font-size: 16px; margin-bottom: 15px;">The audit costs you nothing but 45 minutes.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">The insights could transform your next decade.</p>

  <div style="text-align: center; margin: 40px 0;">
    <a href="{{{cta.url}}}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Book Your Performance Audit</a>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">Only 5 audit slots available this week. First come, first served.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">To your optimised future,</p>

  <p style="font-size: 16px; margin-bottom: 5px;"><strong>Leah</strong></p>

  <p style="font-size: 14px; color: #666; margin-bottom: 30px;"><strong>P.S.</strong> - One CEO told me: "I've spent £100K on consultants. Your 45-minute audit was more valuable than all of them combined." Book now before the slots fill.</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

  <p style="font-size: 12px; color: #999; text-align: center;">This exclusive offer is only available to protocol implementers. <a href="{{{unsubscribe_url}}}" style="color: #999;">Unsubscribe</a> | <a href="{{{preferences_url}}}" style="color: #999;">Update Preferences</a></p>
</body>
</html>
    `,
    cta: {
      text: 'Book Your Performance Audit',
      url: '/consultation'
    }
  },

  {
    id: 'faq-objections',
    day: 12,
    subject: 'Is this really for you? (honest answer inside)',
    preheader: 'The truth about who gets results and who doesn\'t',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a; margin-bottom: 20px;">Let's Be Honest With Each Other</h2>

  <p style="font-size: 16px; margin-bottom: 15px;">You've been receiving my emails for 12 days.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You've downloaded the protocol. Maybe implemented some of it. Definitely thought about the rest.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">But you haven't scheduled a consultation.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">I know why. And it's completely valid.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Questions in Your Head</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Let me address what you're really thinking:</p>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">"Is this just expensive coaching?"</h4>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>No.</strong> This is performance consultancy with measurable ROI.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Traditional coaching: Asks good questions, helps you find answers.<br>
  Performance consultancy: Provides proven protocols, ensures implementation, measures results.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">My clients don't pay for coaching. They invest in transformation with guaranteed ROI.</p>

  <div style="background-color: #f7f7f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size: 16px; margin: 0;"><strong>Average ROI:</strong> 23:1 within 6 months</p>
  </div>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">"I don't have time for this"</h4>

  <p style="font-size: 16px; margin-bottom: 15px;"><strong>That's exactly why you need it.</strong></p>

  <p style="font-size: 16px; margin-bottom: 15px;">Time required: 2-3 hours per week<br>
  Time recovered: 10-15 hours per week<br>
  Net gain: 7-12 hours per week</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You don't find time. You create it through optimisation.</p>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">"Will this work for my specific situation?"</h4>

  <p style="font-size: 16px; margin-bottom: 15px;">I work with:</p>

  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">CEOs managing 1000+ employees</li>
    <li style="margin-bottom: 10px;">Entrepreneurs scaling from £1M to £10M</li>
    <li style="margin-bottom: 10px;">Executives in transition</li>
    <li style="margin-bottom: 10px;">Partners in professional services</li>
    <li style="margin-bottom: 10px;">Leaders in crisis situations</li>
  </ul>

  <p style="font-size: 16px; margin-bottom: 15px;">The protocols adapt to your context. The principles are universal.</p>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">"What if I'm not ready?"</h4>

  <p style="font-size: 16px; margin-bottom: 15px;">Perfect readiness is a myth. You need three things:</p>

  <ol style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">Dissatisfaction with current performance</li>
    <li style="margin-bottom: 10px;">Belief that better is possible</li>
    <li style="margin-bottom: 10px;">Willingness to implement</li>
  </ol>

  <p style="font-size: 16px; margin-bottom: 15px;">That's it. I handle the rest.</p>

  <h4 style="color: #1a1a1a; margin-top: 25px; margin-bottom: 10px;">"How do I know you're different?"</h4>

  <p style="font-size: 16px; margin-bottom: 15px;">Fair question. Here's what makes me different:</p>

  <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #2196f3;">
    <ul style="font-size: 16px; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 10px;"><strong>Real-world perspective:</strong> I'm a mother who understands life's actual demands</li>
      <li style="margin-bottom: 10px;"><strong>Data-driven approach:</strong> Every protocol is measured and proven</li>
      <li style="margin-bottom: 10px;"><strong>Consultancy model:</strong> I provide solutions, not just support</li>
      <li style="margin-bottom: 10px;"><strong>Limited availability:</strong> I work with 8 clients maximum</li>
      <li style="margin-bottom: 10px;"><strong>ROI guarantee:</strong> You see returns or you don't pay</li>
    </ul>
  </div>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Who This ISN'T For</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">Let me save us both time. This isn't for you if:</p>

  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">You want quick hacks, not sustainable transformation</li>
    <li style="margin-bottom: 10px;">You expect change without implementation</li>
    <li style="margin-bottom: 10px;">You're looking for therapy or life coaching</li>
    <li style="margin-bottom: 10px;">You're not willing to invest in yourself</li>
    <li style="margin-bottom: 10px;">You're satisfied with current performance</li>
  </ul>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Who This IS For</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">This is perfect for you if:</p>

  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">You're successful but know there's another level</li>
    <li style="margin-bottom: 10px;">You value expertise and proven systems</li>
    <li style="margin-bottom: 10px;">You're ready to invest in transformation</li>
    <li style="margin-bottom: 10px;">You want measurable, sustainable results</li>
    <li style="margin-bottom: 10px;">You're willing to do the work</li>
  </ul>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Investment Question</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">"How much does it cost?"</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Wrong question. The right question: "What's it worth?"</p>

  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #4caf50;">
    <h4 style="color: #1a1a1a; margin-top: 0;">Value Calculation:</h4>
    <p style="font-size: 16px; margin-bottom: 10px;">10 hours recovered weekly × 50 weeks = 500 hours</p>
    <p style="font-size: 16px; margin-bottom: 10px;">Your hourly value: £___ × 500 = £___</p>
    <p style="font-size: 16px; margin-bottom: 10px;">Plus: Better decisions, reduced stress, improved health</p>
    <p style="font-size: 16px; margin: 0;"><strong>Typical client value: £100K-£500K in year one</strong></p>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">The investment is a fraction of the value created. Always.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Your Real Question</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">The question isn't whether this works. The data proves it does.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">The question isn't whether you need it. Your presence here proves you do.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">The real question is:</p>

  <p style="font-size: 18px; font-weight: bold; margin: 20px 0; text-align: center; color: #1a1a1a;">Are you ready to stop settling for good enough?</p>

  <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ff9800;">
    <h4 style="color: #1a1a1a; margin-top: 0;">Final Thought:</h4>
    <p style="font-size: 16px; margin: 0;">Every day you delay is a day at sub-optimal performance. The compound cost is enormous. The perfect time will never come. But the right time is always now.</p>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    <a href="{{{cta.url}}}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Let's Talk About Your Transformation</a>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">No pressure. No games. Just a conversation about what's possible.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Ready?</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Leah</p>

  <p style="font-size: 14px; color: #666; margin-bottom: 30px;"><strong>P.S.</strong> - If you're still reading, you're ready. Stop overthinking. Schedule the call.</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

  <p style="font-size: 12px; color: #999; text-align: center;"><a href="{{{unsubscribe_url}}}" style="color: #999;">Unsubscribe</a> | <a href="{{{preferences_url}}}" style="color: #999;">Update Preferences</a></p>
</body>
</html>
    `,
    cta: {
      text: 'Let\'s Talk About Your Transformation',
      url: '/consultation'
    }
  },

  {
    id: 'final-call',
    day: 14,
    subject: 'This is goodbye (unless...)',
    preheader: 'My final message about your performance transformation',
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a; margin-bottom: 20px;">Two Weeks. Two Paths.</h2>

  <p style="font-size: 16px; margin-bottom: 15px;">Two weeks ago, you downloaded the Executive Performance Protocol.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Since then, I've shared:</p>

  <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">David's transformation from 14-hour days to 8-hour excellence</li>
    <li style="margin-bottom: 10px;">Sarah's £4.7M performance transformation</li>
    <li style="margin-bottom: 10px;">The mistakes killing executive performance</li>
    <li style="margin-bottom: 10px;">The exact protocols my clients use</li>
    <li style="margin-bottom: 10px;">The data proving what's possible</li>
  </ul>

  <p style="font-size: 16px; margin-bottom: 15px;">You've had 14 days to test the protocols. To feel the shifts. To glimpse your potential.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Now, you're at a crossroads.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Path 1: The Familiar Route</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">You close this email. File away the protocol. Tell yourself "someday."</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Tomorrow looks like today. Next month like this month. Next year like this year.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">The 14-hour days continue. The energy crashes persist. The potential remains untapped.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">It's comfortable. Familiar. Safe.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">And deeply unsatisfying.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">Path 2: The Transformation Route</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">You take action. Today. Now.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You schedule a consultation. We design your custom protocol. You implement with support.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">30 days from now: Energy transformed<br>
  60 days from now: Performance doubled<br>
  90 days from now: Operating at true capacity<br>
  1 year from now: Unrecognisable success</p>

  <p style="font-size: 16px; margin-bottom: 15px;">It's uncertain. Requires investment. Demands change.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">And absolutely transformative.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Moment of Truth</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">I've given you everything:</p>

  <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 30px 0;">
    <ul style="font-size: 16px; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 10px;">✓ The complete protocol (£50K value)</li>
      <li style="margin-bottom: 10px;">✓ Case studies proving it works</li>
      <li style="margin-bottom: 10px;">✓ The science behind transformation</li>
      <li style="margin-bottom: 10px;">✓ Exact implementation strategies</li>
      <li style="margin-bottom: 10px;">✓ 14 days of guidance and insights</li>
    </ul>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">You have two types of evidence:</p>

  <ol style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
    <li style="margin-bottom: 10px;"><strong>External:</strong> The success stories, data, and testimonials</li>
    <li style="margin-bottom: 10px;"><strong>Internal:</strong> Your own experience with the protocol</li>
  </ol>

  <p style="font-size: 16px; margin-bottom: 15px;">Both point to the same conclusion: This works.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">My Promise to You</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">If you schedule a consultation today, I promise:</p>

  <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #4caf50;">
    <ul style="font-size: 16px; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 10px;">45 minutes of my undivided expertise</li>
      <li style="margin-bottom: 10px;">A custom performance assessment</li>
      <li style="margin-bottom: 10px;">Your personalised transformation roadmap</li>
      <li style="margin-bottom: 10px;">Clear next steps (whether with me or alone)</li>
      <li style="margin-bottom: 10px;">No pressure, just clarity</li>
    </ul>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">If we're not a perfect fit, I'll tell you. And still give you everything you need to transform alone.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">The Uncomfortable Truth</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">You didn't download that protocol by accident.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You didn't read 7 emails by chance.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You didn't get to this sentence without reason.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Part of you knows: You're meant for more.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">The question isn't whether you can transform. It's whether you will.</p>

  <h3 style="color: #1a1a1a; margin-top: 30px; margin-bottom: 15px;">This Is Goodbye (Unless...)</h3>

  <p style="font-size: 16px; margin-bottom: 15px;">This is my final email in this sequence.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">If you don't take action, we part ways here.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">You'll unsubscribe (or ignore future emails). I'll focus on those ready to transform.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">No hard feelings. Timing matters.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">But if something inside you is saying "now"...</p>

  <p style="font-size: 16px; margin-bottom: 15px;">If you're tired of operating below capacity...</p>

  <p style="font-size: 16px; margin-bottom: 15px;">If you're ready to become who you're capable of being...</p>

  <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ff9800;">
    <h4 style="color: #1a1a1a; margin-top: 0;">One Final Opportunity:</h4>
    <p style="font-size: 16px; margin-bottom: 10px;">The next 5 people who schedule a consultation receive:</p>
    <ul style="font-size: 16px; padding-left: 20px; margin-bottom: 10px;">
      <li style="margin-bottom: 5px;">Extended 60-minute session (vs 45)</li>
      <li style="margin-bottom: 5px;">Performance scorecard and action plan</li>
      <li style="margin-bottom: 5px;">30-day email support (whether you join or not)</li>
    </ul>
    <p style="font-size: 16px; margin: 0;"><strong>Spaces remaining: 3 of 5</strong></p>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    <a href="{{{cta.url}}}" style="display: inline-block; background-color: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Choose Transformation →</a>
  </div>

  <p style="font-size: 16px; margin-bottom: 15px;">Two weeks ago, you started a journey.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Today, you choose where it leads.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">I hope you choose transformation.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">Either way, thank you for your time and attention.</p>

  <p style="font-size: 16px; margin-bottom: 15px;">To your success (however you define it),</p>

  <p style="font-size: 16px; margin-bottom: 5px;"><strong>Leah Fowler</strong></p>
  <p style="font-size: 14px; color: #666; margin-bottom: 30px;">Elite Performance Consultant</p>

  <p style="font-size: 14px; color: #666; margin-bottom: 30px;"><strong>P.S.</strong> - A year from now, you'll wish you started today. Don't let future you down.</p>

  <p style="font-size: 14px; color: #666; margin-bottom: 30px;"><strong>P.P.S.</strong> - If you're genuinely not ready, keep the protocol. When you are ready, I'll be here. But know this: "Someday" is not a day of the week.</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">

  <p style="font-size: 12px; color: #999; text-align: center;">This is the final email in our performance series. <a href="{{{unsubscribe_url}}}" style="color: #999;">Unsubscribe</a> | <a href="{{{preferences_url}}}" style="color: #999;">Update Preferences</a></p>
</body>
</html>
    `,
    cta: {
      text: 'Choose Transformation →',
      url: '/consultation'
    }
  }
]

// Email sending configuration
export interface EmailConfig {
  fromName: string
  fromEmail: string
  replyTo: string
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'resend'
}

export const emailConfig: EmailConfig = {
  fromName: 'Leah Fowler',
  fromEmail: 'leah@leahfowlerperformance.com',
  replyTo: 'leah@leahfowlerperformance.com',
  provider: 'resend' // or configure based on environment
}

// Helper function to personalise emails
export function personaliseEmail(template: string, data: Record<string, unknown>): string {
  let personalised = template

  // Replace placeholders with actual values
  Object.keys(data).forEach(key => {
    const placeholder = `{{{${key}}}}`
    personalised = personalised.replace(new RegExp(placeholder, 'g'), data[key])
  })

  return personalised
}

// Helper function to schedule email sequence
export function calculateSendDate(startDate: Date, dayOffset: number): Date {
  const sendDate = new Date(startDate)
  sendDate.setDate(sendDate.getDate() + dayOffset)
  sendDate.setHours(9, 0, 0, 0) // Send at 9 AM
  return sendDate
}

// Email tracking pixels and analytics
export function addTrackingPixel(emailId: string, subscriberId: string): string {
  return `<img src="https://leahfowlerperformance.com/api/email/track?id=${emailId}&subscriber=${subscriberId}" width="1" height="1" style="display:none;" />`
}

// Unsubscribe and preference URLs
export function generateUnsubscribeUrl(subscriberId: string): string {
  return `https://leahfowlerperformance.com/unsubscribe?id=${subscriberId}`
}

export function generatePreferencesUrl(subscriberId: string): string {
  return `https://leahfowlerperformance.com/preferences?id=${subscriberId}`
}