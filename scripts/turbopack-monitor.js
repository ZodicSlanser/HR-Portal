#!/usr/bin/env node

/**
 * Turbopack Performance Monitor
 * This script helps monitor and analyze Turbopack performance metrics
 */

const fs = require('fs');
const path = require('path');

class TurbopackMonitor {
  constructor() {
    this.startTime = Date.now();
    this.logFile = path.join(__dirname, '../.turbo/performance.log');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    
    console.log(logEntry.trim());
    
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  measureBuildTime(buildType = 'development') {
    const elapsed = Date.now() - this.startTime;
    this.log(`${buildType} build completed in ${elapsed}ms`, 'PERFORMANCE');
    
    return elapsed;
  }

  analyzeCacheSize() {
    const cacheDir = path.join(__dirname, '../.turbo');
    
    if (!fs.existsSync(cacheDir)) {
      this.log('Cache directory does not exist', 'WARNING');
      return 0;
    }

    try {
      const stats = this.getDirectorySize(cacheDir);
      this.log(`Cache size: ${(stats / 1024 / 1024).toFixed(2)} MB`, 'INFO');
      return stats;
    } catch (error) {
      this.log(`Error analyzing cache: ${error.message}`, 'ERROR');
      return 0;
    }
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += this.getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
    
    return totalSize;
  }

  generateReport() {
    const buildTime = this.measureBuildTime();
    const cacheSize = this.analyzeCacheSize();
    
    const report = {
      timestamp: new Date().toISOString(),
      buildTime: `${buildTime}ms`,
      cacheSize: `${(cacheSize / 1024 / 1024).toFixed(2)} MB`,
      turbopackVersion: this.getTurbopackVersion(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    };

    const reportPath = path.join(__dirname, '../.turbo/performance-report.json');
    
    try {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      this.log(`Performance report generated: ${reportPath}`, 'INFO');
    } catch (error) {
      this.log(`Failed to generate report: ${error.message}`, 'ERROR');
    }

    return report;
  }

  getTurbopackVersion() {
    try {
      const packageJson = require('../package.json');
      return packageJson.dependencies?.next || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  clearCache() {
    const cacheDir = path.join(__dirname, '../.turbo');
    
    if (fs.existsSync(cacheDir)) {
      try {
        fs.rmSync(cacheDir, { recursive: true, force: true });
        this.log('Cache cleared successfully', 'INFO');
        return true;
      } catch (error) {
        this.log(`Failed to clear cache: ${error.message}`, 'ERROR');
        return false;
      }
    } else {
      this.log('No cache to clear', 'INFO');
      return true;
    }
  }

  printUsage() {
    console.log(`
Turbopack Performance Monitor

Usage:
  node scripts/turbopack-monitor.js [command]

Commands:
  report    Generate performance report
  cache     Analyze cache size
  clear     Clear Turbopack cache
  help      Show this help message

Examples:
  node scripts/turbopack-monitor.js report
  node scripts/turbopack-monitor.js cache
  node scripts/turbopack-monitor.js clear
`);
  }
}

// CLI interface
if (require.main === module) {
  const monitor = new TurbopackMonitor();
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'report':
      monitor.generateReport();
      break;
    case 'cache':
      monitor.analyzeCacheSize();
      break;
    case 'clear':
      monitor.clearCache();
      break;
    case 'help':
    default:
      monitor.printUsage();
      break;
  }
}

module.exports = TurbopackMonitor;
