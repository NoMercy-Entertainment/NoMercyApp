import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const version = execSync('git rev-parse --short HEAD').toString().trim();
const buildTime = new Date().toISOString();

const versionInfo = {
	version,
	buildTime,
	forceUpdate: process.env.FORCE_UPDATE === 'true',
};

writeFileSync('docs/version.json', JSON.stringify(versionInfo, null, 2));
console.log('Generated version.json:', versionInfo);
