#!/usr/bin/env node

/**
 * SVG Sprite Icon Usage Analyzer
 * 
 * This script analyzes the codebase to identify:
 * 1. Which icons from large sprite files are actually used
 * 2. Usage frequency of each icon
 * 3. Optimal candidates for extraction to individual files
 * 4. Potential bundle size savings
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class IconUsageAnalyzer {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.spriteFiles = {
      'mooooom-icons.svg': { size: 923007, component: 'MoooomIcon' },
      'device-icons.svg': { size: 39805, component: 'DeviceIcon' },
      'sprite-icons.svg': { size: 13226, component: 'SpriteIcon' },
      'player-icons.svg': { size: 23490, component: 'PlayerIcon' },
      'genre-icons.svg': { size: 64336, component: 'GenreIcon' }
    };
    this.iconUsage = new Map();
    this.fileExtensions = ['.vue', '.ts', '.js', '.tsx', '.jsx'];
  }

  async analyze() {
    console.log('🔍 Starting SVG Sprite Icon Usage Analysis...\n');
    
    // Step 1: Find all relevant files
    const files = this.findProjectFiles();
    console.log(`📁 Found ${files.length} files to analyze\n`);
    
    // Step 2: Analyze icon usage in each file
    this.analyzeIconUsage(files);
    
    // Step 3: Parse sprite files to get available icons
    await this.analyzeSpriteFiles();
    
    // Step 4: Generate reports
    this.generateUsageReport();
    this.generateOptimizationRecommendations();
    
    // Step 5: Calculate potential savings
    this.calculatePotentialSavings();
    
    console.log('✅ Analysis complete! Check the generated reports.\n');
  }

  findProjectFiles() {
    const files = [];
    const excludeDirs = ['node_modules', '.git', 'dist', 'build', 'docs', 'dev-dist'];
    
    const scanDirectory = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            if (!excludeDirs.includes(item) && !item.startsWith('.')) {
              scanDirectory(fullPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (this.fileExtensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };
    
    scanDirectory(this.projectRoot);
    return files;
  }

  analyzeIconUsage(files) {
    console.log('🔍 Analyzing icon usage patterns...\n');
    
    const iconPatterns = {
      // Pattern for icon prop usage: icon="iconName"
      iconProp: /(?:icon|startIcon|endIcon)\\s*=\\s*["']([^"']+)["']/g,
      // Pattern for SpriteIcon usage: <SpriteIcon icon="iconName"
      spriteIcon: /<SpriteIcon\\s+[^>]*icon\\s*=\\s*["']([^"']+)["']/g,
      // Pattern for MoooomIcon usage
      moooomIcon: /<MoooomIcon\\s+[^>]*icon\\s*=\\s*["']([^"']+)["']/g,
      // Pattern for DeviceIcon usage
      deviceIcon: /<DeviceIcon\\s+[^>]*icon\\s*=\\s*["']([^"']+)["']/g,
      // Pattern for PlayerIcon usage
      playerIcon: /<PlayerIcon\\s+[^>]*icon\\s*=\\s*["']([^"']+)["']/g,
      // Pattern for OptimizedIcon usage
      optimizedIcon: /<OptimizedIcon\\s+[^>]*icon\\s*=\\s*["']([^"']+)["']/g,
      // Pattern for getIcon() calls
      getIconCall: /getIcon\\s*\\(\\s*["']([^"']+)["']/g
    };
    
    files.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(this.projectRoot, filePath);
        
        // Check each pattern
        Object.entries(iconPatterns).forEach(([patternName, pattern]) => {
          let match;
          pattern.lastIndex = 0; // Reset regex
          
          while ((match = pattern.exec(content)) !== null) {
            const iconName = match[1];
            
            if (!this.iconUsage.has(iconName)) {
              this.iconUsage.set(iconName, {
                count: 0,
                files: new Set(),
                patterns: new Set(),
                component: this.guessIconComponent(patternName, iconName)
              });
            }
            
            const usage = this.iconUsage.get(iconName);
            usage.count++;
            usage.files.add(relativePath);
            usage.patterns.add(patternName);
          }
        });
      } catch (error) {
        console.warn(`⚠️  Could not analyze file: ${filePath}`);
      }
    });
    
    console.log(`📊 Found ${this.iconUsage.size} unique icons in use\n`);
  }

  guessIconComponent(patternName, iconName) {
    if (patternName === 'spriteIcon') return 'SpriteIcon';
    if (patternName === 'moooomIcon') return 'MoooomIcon';
    if (patternName === 'deviceIcon') return 'DeviceIcon';
    if (patternName === 'playerIcon') return 'PlayerIcon';
    if (patternName === 'optimizedIcon') return 'OptimizedIcon';
    
    // Try to guess based on icon name patterns
    if (iconName.includes('nm') || iconName.startsWith('mooooom-')) return 'MoooomIcon';
    if (['instagram', 'twitter', 'youtube', 'tiktok', 'imdb'].includes(iconName)) return 'SpriteIcon';
    
    return 'OptimizedIcon'; // Default assumption
  }

  async analyzeSpriteFiles() {
    console.log('📋 Analyzing sprite files...\n');
    
    for (const [fileName, info] of Object.entries(this.spriteFiles)) {
      const spritePath = path.join(this.projectRoot, 'resources', fileName);
      
      if (fs.existsSync(spritePath)) {
        try {
          const content = fs.readFileSync(spritePath, 'utf8');
          
          // Extract icon IDs from SVG sprite
          const iconIds = this.extractIconIds(content);
          
          console.log(`📄 ${fileName}:`);
          console.log(`   Size: ${(info.size / 1024).toFixed(1)}KB`);
          console.log(`   Icons: ${iconIds.length}`);
          console.log(`   Component: ${info.component}\n`);
          
          info.availableIcons = iconIds;
          info.unusedIcons = iconIds.filter(id => !this.iconUsage.has(id));
          info.usedIcons = iconIds.filter(id => this.iconUsage.has(id));
        } catch (error) {
          console.warn(`⚠️  Could not analyze sprite: ${fileName}`);
        }
      }
    }
  }

  extractIconIds(svgContent) {
    // Extract icon IDs from SVG sprite using various patterns
    const patterns = [
      /<symbol[^>]+id\\s*=\\s*["']([^"']+)["']/g,
      /<g[^>]+id\\s*=\\s*["']([^"']+)["']/g,
      /<defs[^>]*>[\\s\\S]*?<\\/defs>/g
    ];
    
    const ids = new Set();
    
    patterns.forEach(pattern => {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(svgContent)) !== null) {
        if (match[1] && !match[1].includes('filter') && !match[1].includes('gradient')) {
          ids.add(match[1]);
        }
      }
    });
    
    return Array.from(ids);
  }

  generateUsageReport() {
    const reportPath = path.join(this.projectRoot, 'icon-usage-report.json');
    
    // Convert usage data for JSON serialization
    const usageData = {};
    for (const [iconName, usage] of this.iconUsage.entries()) {
      usageData[iconName] = {
        count: usage.count,
        files: Array.from(usage.files),
        patterns: Array.from(usage.patterns),
        component: usage.component
      };
    }
    
    const report = {
      generatedAt: new Date().toISOString(),
      totalIcons: this.iconUsage.size,
      spriteFiles: this.spriteFiles,
      iconUsage: usageData
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Usage report saved to: ${reportPath}\n`);
  }

  generateOptimizationRecommendations() {
    console.log('💡 OPTIMIZATION RECOMMENDATIONS:\n');
    
    // Sort icons by usage frequency
    const sortedIcons = Array.from(this.iconUsage.entries())
      .sort(([, a], [, b]) => b.count - a.count);
    
    console.log('🔥 TOP 20 MOST USED ICONS:');
    sortedIcons.slice(0, 20).forEach(([name, usage], index) => {
      console.log(`${index + 1:2}. ${name.padEnd(25)} (${usage.count}x) - ${usage.component}`);
    });
    console.log();
    
    // Analyze each sprite file
    Object.entries(this.spriteFiles).forEach(([fileName, info]) => {
      if (info.availableIcons) {
        const usageRate = (info.usedIcons.length / info.availableIcons.length * 100).toFixed(1);
        const wastedSize = Math.round(info.size * (info.unusedIcons.length / info.availableIcons.length));
        
        console.log(`📊 ${fileName}:`);
        console.log(`   Total icons: ${info.availableIcons.length}`);
        console.log(`   Used icons: ${info.usedIcons.length} (${usageRate}%)`);
        console.log(`   Unused icons: ${info.unusedIcons.length}`);
        console.log(`   Estimated waste: ${(wastedSize / 1024).toFixed(1)}KB`);
        
        if (wastedSize > 50000) { // > 50KB waste
          console.log(`   🚨 RECOMMENDATION: High optimization potential!`);
          if (info.usedIcons.length < 20) {
            console.log(`   💡 STRATEGY: Extract ${info.usedIcons.length} used icons to individual files`);
          } else {
            console.log(`   💡 STRATEGY: Split into core pack + on-demand loading`);
          }
        }
        console.log();
      }
    });
  }

  calculatePotentialSavings() {
    console.log('💰 POTENTIAL SAVINGS ANALYSIS:\n');
    
    let totalCurrentSize = 0;
    let totalPotentialSavings = 0;
    
    Object.entries(this.spriteFiles).forEach(([fileName, info]) => {
      if (info.availableIcons) {
        totalCurrentSize += info.size;
        
        const unusedRatio = info.unusedIcons.length / info.availableIcons.length;
        const wastedSize = Math.round(info.size * unusedRatio);
        
        // Estimate optimized size (used icons + overhead)
        const avgIconSize = 2000; // ~2KB per optimized icon
        const optimizedSize = Math.max(
          info.usedIcons.length * avgIconSize,
          info.size * 0.1 // Minimum 10% of original size
        );
        
        const savings = info.size - optimizedSize;
        totalPotentialSavings += Math.max(0, savings);
        
        console.log(`${fileName}:`);
        console.log(`  Current: ${(info.size / 1024).toFixed(1)}KB`);
        console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(1)}KB`);
        console.log(`  Savings: ${(savings / 1024).toFixed(1)}KB (${((savings / info.size) * 100).toFixed(1)}%)\n`);
      }
    });
    
    console.log(`🎯 TOTAL OPTIMIZATION POTENTIAL:`);
    console.log(`   Current total: ${(totalCurrentSize / 1024).toFixed(1)}KB`);
    console.log(`   Potential savings: ${(totalPotentialSavings / 1024).toFixed(1)}KB`);
    console.log(`   Improvement: ${((totalPotentialSavings / totalCurrentSize) * 100).toFixed(1)}%\n`);
    
    // Specific recommendations
    const moooomInfo = this.spriteFiles['mooooom-icons.svg'];
    if (moooomInfo && moooomInfo.unusedIcons) {
      const moooomSavings = (moooomInfo.size * 0.8) / 1024; // Estimate 80% savings
      console.log(`🎯 PRIORITY 1 - Mooooom Icons:`);
      console.log(`   Convert to on-demand loading`);
      console.log(`   Estimated savings: ${moooomSavings.toFixed(1)}KB`);
      console.log(`   Implementation: Extract top 20 icons, lazy-load others\n`);
    }
  }
}

// Run the analysis
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  
  console.log(`Starting icon analysis for: ${projectRoot}\n`);
  
  const analyzer = new IconUsageAnalyzer(projectRoot);
  analyzer.analyze().catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
}

module.exports = IconUsageAnalyzer;
