const fs = require('fs');
const path = require('path');

// File paths
const javaFilePath = path.join(
  __dirname,
  '../node_modules/@jofr/capacitor-media-session/android/src/main/java/io/github/jofr/capacitor/mediasessionplugin/MediaSessionPlugin.java'
);
const searchPattern = 'private void updateServiceMetadata() {';
const insertLine = '        if (service == null) return;';

const sourceIconPath = path.join(
  __dirname,
  '../public/img/icons/ic_baseline_play_arrow_24.xml'
);
const destinationIconPath = path.join(
  __dirname,
  '../node_modules/@jofr/capacitor-media-session/android/src/main/res/drawable/ic_baseline_volume_up_24.xml'
);

try {
  // Patch the Java file
  let fileContent = fs.readFileSync(javaFilePath, 'utf8');

  if (!fileContent.includes(insertLine)) {
    fileContent = fileContent.replace(
      searchPattern,
      `${searchPattern}\n${insertLine}`
    );

    fs.writeFileSync(javaFilePath, fileContent, 'utf8');
    console.log('Patched MediaSessionPlugin.java successfully.');
  } else {
    console.log('Patch already applied.');
  }

  // Copy the icon file
  fs.copyFileSync(sourceIconPath, destinationIconPath);
  console.log('Copied icon file successfully.');
} catch (error) {
  console.error('Error during postinstall script:', error);
}