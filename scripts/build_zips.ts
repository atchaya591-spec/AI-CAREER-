import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../src/services/androidProjectFiles.js';

async function generateZips() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate Android Studio Project ZIP
  const androidZip = new JSZip();
  for (const file of ANDROID_PROJECT_FILES) {
    androidZip.file(file.path, file.content);
  }

  const androidBuffer = await androidZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const androidZipPath = path.join(publicDir, 'AI_Career_Guidance_Android_Project.zip');
  fs.writeFileSync(androidZipPath, androidBuffer);
  console.log(`Saved Android project zip to ${androidZipPath} (${androidBuffer.length} bytes)`);

  // 2. Generate Full Project ZIP (including Android + Web App Source)
  const fullZip = new JSZip();

  // Add Android project files in android/ directory
  for (const file of ANDROID_PROJECT_FILES) {
    fullZip.file(`android/${file.path}`, file.content);
  }

  // Helper to recursively add files
  function addDirectoryToZip(dirPath: string, zipFolder: JSZip) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      if (item === 'node_modules' || item === 'dist' || item === '.git' || item === 'public' || item.endsWith('.zip')) {
        continue;
      }
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        if (subFolder) {
          addDirectoryToZip(fullPath, subFolder);
        }
      } else {
        const fileData = fs.readFileSync(fullPath);
        zipFolder.file(item, fileData);
      }
    }
  }

  addDirectoryToZip(process.cwd(), fullZip);

  const fullBuffer = await fullZip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const fullZipPath = path.join(publicDir, 'AI_Career_Guidance_Full_System.zip');
  fs.writeFileSync(fullZipPath, fullBuffer);
  console.log(`Saved Full project zip to ${fullZipPath} (${fullBuffer.length} bytes)`);
}

generateZips().catch((err) => {
  console.error('Failed to generate zips:', err);
  process.exit(1);
});
