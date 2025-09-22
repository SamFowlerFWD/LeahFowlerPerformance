#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

// Smart fix for unescaped entities - only in JSX text, not JavaScript strings
function fixUnescapedEntitiesSmartly(content, filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) {
    return content;
  }

  let fixed = content;
  let lines = fixed.split('\n');
  let newLines = [];
  let inJSX = false;
  let jsxDepth = 0;

  for (let line of lines) {
    let processedLine = '';
    let i = 0;

    while (i < line.length) {
      // Check for JSX tag opening
      if (line[i] === '<' && i + 1 < line.length && line[i + 1] !== ' ' && line[i + 1] !== '=') {
        // Check if it's a closing tag
        if (line[i + 1] === '/') {
          jsxDepth--;
          processedLine += line[i];
          i++;
        } else {
          // Opening tag
          jsxDepth++;
          processedLine += line[i];
          i++;
        }
      }
      // Check for JSX tag closing
      else if (line[i] === '>' && jsxDepth > 0) {
        processedLine += line[i];
        i++;
        inJSX = true;
      }
      // Check for JSX tag self-closing
      else if (line[i] === '/' && i + 1 < line.length && line[i + 1] === '>' && jsxDepth > 0) {
        jsxDepth--;
        processedLine += line.substring(i, i + 2);
        i += 2;
        inJSX = false;
      }
      // Inside JSX text content
      else if (inJSX && line[i] === '<') {
        inJSX = false;
        processedLine += line[i];
        i++;
      }
      // Process text inside JSX
      else if (inJSX && jsxDepth > 0) {
        if (line[i] === "'") {
          processedLine += '&apos;';
        } else if (line[i] === '"') {
          processedLine += '&quot;';
        } else {
          processedLine += line[i];
        }
        i++;
      }
      // Normal JavaScript code
      else {
        processedLine += line[i];
        i++;
      }
    }

    newLines.push(processedLine);
  }

  return newLines.join('\n');
}

// Revert bad replacements in JavaScript code
function revertBadReplacements(content, filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx') && !filePath.endsWith('.ts')) {
    return content;
  }

  let fixed = content;

  // Revert &apos; in JavaScript strings (not in JSX text)
  fixed = fixed.replace(/useState<[^>]+>\(&apos;([^)]+)&apos;\)/g, "useState<$1>('$2')");
  fixed = fixed.replace(/: &apos;([^']+)&apos;([,;}])/g, ": '$1'$2");
  fixed = fixed.replace(/\(&apos;([^)]+)&apos;\)/g, "('$1')");
  fixed = fixed.replace(/= &apos;([^']+)&apos;([,;}])/g, "= '$1'$2");

  // Revert &quot; in JavaScript strings
  fixed = fixed.replace(/&quot;([^"]+)&quot;/g, '"$1"');
  fixed = fixed.replace(/&ldquo;([^"]+)&rdquo;/g, '"$1"');

  return fixed;
}

// Fix unused imports
function fixUnusedImports(content, filePath) {
  const unusedImports = {
    'app/admin/assessments/page.tsx': ['Tabs', 'TabsContent', 'TabsList', 'TabsTrigger', 'AlertCircle', 'CheckCircle', 'Filter'],
    'app/api/assessment/admin/route.ts': ['request'],
    'app/api/assessment/gdpr/route.ts': ['request'],
    'app/api/assessment/submit/route.ts': ['request'],
    'app/api/lead-magnet/route.ts': ['EmailQueueItem', 'request'],
    'app/api/performance-assessment/route.ts': ['tableError'],
    'app/blog/page.tsx': ['Calendar'],
    'app/performance-accelerator/page.tsx': ['Target', 'CardHeader', 'CardTitle', 'data', 'programme'],
    'components/AboutSection.tsx': ['BookOpen', 'Briefcase', 'Globe', 'TrendingUp', 'BadgeCheck', 'Dumbbell', 'Activity', 'Brain', 'Shield', 'Image'],
    'components/AphroditePricingTiers.tsx': ['Zap', 'Video', 'Clock', 'pricingMessages'],
    'components/AssessmentSection.tsx': ['ClipboardCheck'],
    'components/AssessmentTool.tsx': ['Users', 'BarChart', 'Clock', 'Briefcase', 'Activity', 'getPhaseInfo', 'generateDetailedReport', 'disqualified', 'checkQualification', 'PhaseIcon'],
    'components/BarrierIdentificationSystem.tsx': ['useEffect', 'XCircle', 'Label'],
    'components/ChatWidget.tsx': ['X', 'User', 'Badge', 'Card', 'Textarea'],
    'components/ConsultancyProgrammes.tsx': ['Users', 'TrendingUp'],
    'components/ContactSection.tsx': ['MessageSquare', 'Send', 'Sparkles'],
    'components/FamilyTransformationTestimonials.tsx': ['Image', 'AnimatePresence', 'ChevronLeft', 'ChevronRight', 'Play'],
    'components/FloatingElements.tsx': ['cn'],
    'components/Footer.tsx': ['Send', 'Sparkles', 'Globe', 'Clock', 'Calendar'],
    'components/InteractiveProgrammeGallery.tsx': ['Calendar', 'Play'],
    'components/LoadingStates.tsx': ['startY'],
    'components/MobileBottomNav.tsx': ['Home', 'ChevronUp'],
    'components/MobileNav.tsx': ['User'],
    'components/MobileOptimizedHero.tsx': ['Link'],
    'components/NorfolkCommunitySection.tsx': ['Image', 'Star', 'Activity', 'Target', 'CommunityMember'],
    'components/OptimizedImage.tsx': ['generateSrcSet'],
    'components/PremiumFAQSection.tsx': ['seoOptimizedContent'],
    'components/PremiumHeroWithImage.tsx': ['Link', 'Brain', 'TrendingUp', 'Shield', 'Activity', 'ChevronRight', 'CheckCircle', 'Star', 'fitnessHeroContent', 'easings', 'spacingScale', 'stats', 'smoothMouseX', 'smoothMouseY'],
    'components/PremiumProgrammeComparison.tsx': ['easings'],
    'components/PremiumSocialProof.tsx': ['easings'],
    'components/PremiumTestimonialsSection.tsx': ['fadeInUp', 'luxuryScale', 'staggerContainer', 'isVideoPlaying'],
    'components/PricingTiers.tsx': ['Video', 'FileText', 'index'],
    'components/ProgrammeRecommendationEngine.tsx': ['Heart', 'Smartphone', 'Video', 'Award', 'ChevronLeft', 'ChevronRight', 'Tabs', 'TabsContent', 'TabsList', 'TabsTrigger'],
    'components/ProgrammesSection.tsx': ['Zap', 'Target', 'Users', 'Brain'],
    'components/SocialProofNotifications.tsx': ['AvatarImage'],
    'components/TestimonialsSection.tsx': ['Briefcase', 'Building'],
    'components/TruthfulTrustSection.tsx': ['Clock', 'Star', 'Users'],
    'components/VideoTestimonials.tsx': ['TrendingUp', 'Calendar'],
    'components/WhyChooseSection.tsx': ['iconMap'],
    'lib/assessment-questions.ts': ['_question', '_answer'],
    'lib/assessment-scoring.ts': ['_answers']
  };

  const fileName = path.basename(filePath);
  const toRemove = unusedImports[fileName] || unusedImports[filePath];

  if (!toRemove || toRemove.length === 0) {
    return content;
  }

  let fixed = content;
  let removedCount = 0;

  toRemove.forEach(importName => {
    // Remove from import statements
    const patterns = [
      new RegExp(`\\b${importName}\\s*,`, 'g'),
      new RegExp(`,\\s*${importName}\\b`, 'g'),
      new RegExp(`\\b${importName}\\b`, 'g')
    ];

    patterns.forEach(pattern => {
      const beforeLength = fixed.length;
      fixed = fixed.replace(pattern, '');
      if (fixed.length !== beforeLength) {
        removedCount++;
      }
    });
  });

  // Clean up empty imports
  fixed = fixed.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\n/g, '');

  // Clean up multiple spaces and commas
  fixed = fixed.replace(/,\s*,/g, ',');
  fixed = fixed.replace(/{\s*,/g, '{');
  fixed = fixed.replace(/,\s*}/g, '}');
  fixed = fixed.replace(/\s+/g, ' ');

  if (removedCount > 0) {
    log.info(`Removed ${removedCount} unused imports from ${path.basename(filePath)}`);
  }

  return fixed;
}

// Process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fixed = content;

    // First revert bad replacements
    fixed = revertBadReplacements(fixed, filePath);

    // Then apply smart entity fixes
    fixed = fixUnescapedEntitiesSmartly(fixed, filePath);

    // Fix unused imports
    fixed = fixUnusedImports(fixed, filePath);

    // Only write if changes were made
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      log.success(`Fixed ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    log.error(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  console.log(`${colors.cyan}🔧 Smart ESLint Error Fixes${colors.reset}`);
  console.log('=' .repeat(50));

  const rootDir = '/root/app/leah-fowler-performance';

  // Files with unescaped entity errors
  const filesWithErrors = [
    'components/AphroditePricingTiers.tsx',
    'components/AssessmentTool.tsx',
    'components/ContactSection.tsx',
    'components/LeadMagnetDelivery.tsx',
    'components/MobileNav.tsx',
    'components/NorfolkCommunitySection.tsx',
    'components/InteractiveProgrammeGallery.tsx',
    'components/PremiumTestimonialsSection.tsx',
    'components/ProgrammeRecommendationEngine.tsx',
    'app/family-athlete-demo/page.tsx',
    'app/mobile-demo/page.tsx',
    'app/performance-accelerator/page.tsx',
    'components/AboutSection.tsx',
    'components/AssessmentSection.tsx',
    'components/BarrierIdentificationSystem.tsx',
    'components/ChatWidget.tsx',
    'components/ConsultancyProgrammes.tsx',
    'components/ExitIntentPopup.tsx',
    'components/Footer.tsx',
    'components/HeroStatsSection.tsx',
    'components/PerformanceBreakthroughLeadMagnet.tsx',
    'components/PremiumProgrammeComparison.tsx',
    'components/PricingTiers.tsx',
    'components/ProgrammesSection.tsx',
    'components/SectionErrorBoundary.tsx',
    'components/TestimonialsSection.tsx',
    'components/TruthfulTrustSection.tsx',
    'components/VideoTestimonials.tsx',
    'components/WhyChooseSection.tsx',
    'components/spacing/SpacingShowcase.tsx',
    // API routes with unused params
    'app/api/assessment/admin/route.ts',
    'app/api/assessment/gdpr/route.ts',
    'app/api/assessment/submit/route.ts',
    'app/api/lead-magnet/route.ts',
    'app/api/performance-assessment/route.ts'
  ];

  let fixedCount = 0;

  filesWithErrors.forEach(relativePath => {
    const fullPath = path.join(rootDir, relativePath);
    if (fs.existsSync(fullPath)) {
      if (processFile(fullPath)) {
        fixedCount++;
      }
    } else {
      log.warning(`File not found: ${relativePath}`);
    }
  });

  console.log('=' .repeat(50));
  console.log(`${colors.green}✅ Summary:${colors.reset}`);
  console.log(`   Files processed: ${filesWithErrors.length}`);
  console.log(`   Files fixed: ${fixedCount}`);
  console.log('=' .repeat(50));
}

// Run the script
if (require.main === module) {
  main();
}