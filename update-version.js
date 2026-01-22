import fs from 'fs';
import path from 'path';

// Read package.json
const pkgPath = path.resolve('package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

console.log(`Syncing version v${version}...`);

// Update SettingsPage.js
const settingsPagePath = path.resolve('src/pages/SettingsPage.js');
let settingsContent = fs.readFileSync(settingsPagePath, 'utf8');

// Use regex to find and replace the version string
// Look for something like <p>Life Dashboard Pro v1.3.0</p>
const versionRegex = /<p>Life Dashboard Pro v[0-9.]*<\/p>/;
const newVersionString = `<p>Life Dashboard Pro v${version}</p>`;

if (versionRegex.test(settingsContent)) {
    settingsContent = settingsContent.replace(versionRegex, newVersionString);
    fs.writeFileSync(settingsPagePath, settingsContent);
    console.log(`Updated version in SettingsPage.js to v${version}`);
} else {
    console.warn('Could not find version string in SettingsPage.js');
}
