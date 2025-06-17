#!/usr/bin/env node

/**
 * Script to remove SKIP_WAITING handler from generated service worker
 * This ensures manual control over service worker updates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swPath = path.join(__dirname, '..', 'docs', 'sw.js');

console.log('Fixing service worker to remove auto-skip functionality...');

if (!fs.existsSync(swPath)) {
    console.error('Service worker not found at:', swPath);
    process.exit(1);
}

let swContent = fs.readFileSync(swPath, 'utf8');

console.log('Original SW size:', swContent.length, 'characters');

// Remove the SKIP_WAITING message event listener
// This regex matches both minified and unminified patterns
const skipWaitingPatterns = [
    // Minified pattern (actual pattern found in production)
    /self\.addEventListener\("message",\(e=>\{e\.data&&"SKIP_WAITING"===e\.data\.type&&self\.skipWaiting\(\)\}\)\)/g,
    // Unminified pattern (fallback)
    /self\.addEventListener\("message",\([^)]+\)=>\{[^}]*"SKIP_WAITING"[^}]*skipWaiting\(\)[^}]*\}\)/g,
    // Generic pattern for variations
    /self\.addEventListener\("message",[^;]*"SKIP_WAITING"[^;]*skipWaiting\(\)[^;]*\)/g
];

let patternFound = false;
let originalSize = swContent.length;

for (const pattern of skipWaitingPatterns) {
    if (pattern.test(swContent)) {
        console.log('Found SKIP_WAITING handler with pattern:', pattern.source);
        swContent = swContent.replace(pattern, '');
        patternFound = true;
        break;
    }
}

if (patternFound) {
    console.log('Modified SW size:', swContent.length, 'characters');
    console.log('Removed', originalSize - swContent.length, 'characters');
    
    // Write the modified content back
    fs.writeFileSync(swPath, swContent, 'utf8');
    console.log('✅ Service worker fixed - SKIP_WAITING handler removed');
    console.log('The service worker will now wait for manual activation');
} else {
    console.log('❌ SKIP_WAITING handler not found - service worker may already be correct');
    
    // Debug: show first 500 characters to help identify the pattern
    console.log('SW Content Preview:');
    console.log(swContent.substring(0, 500) + '...');
}
