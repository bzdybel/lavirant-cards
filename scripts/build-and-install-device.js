/* eslint-disable no-console */
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');

const DEVICE_ID = process.env.DEPLOY_DEVICE_ID || null;
const ANDROID_PACKAGE = process.env.DEPLOY_ANDROID_PACKAGE || 'com.lavirantcards.app';
const EAS_PROFILE = process.env.DEPLOY_EAS_PROFILE || 'apk';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: 'pipe',
    ...options,
  });

  if (options.print !== false) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }

  return result;
}

function fail(message, extra) {
  console.error(`\nERROR: ${message}`);
  if (extra) console.error(extra);
  process.exit(1);
}

function findAdb() {
  const candidates = [
    process.env.ADB,
    process.env.ANDROID_HOME && path.join(process.env.ANDROID_HOME, 'platform-tools', 'adb.exe'),
    process.env.ANDROID_SDK_ROOT && path.join(process.env.ANDROID_SDK_ROOT, 'platform-tools', 'adb.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe'),
    'adb',
  ].filter(Boolean);

  for (const candidate of candidates) {
    const res = run(candidate, ['version'], { print: false });
    if (res.status === 0) return candidate;
  }

  return null;
}

function downloadToFile(url, outPath) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        downloadToFile(response.headers.location, outPath).then(resolve, reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
        response.resume();
        return;
      }

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      const file = fs.createWriteStream(outPath);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });

    request.on('error', reject);
  });
}

function parseJson(stdout, context) {
  try {
    return JSON.parse(stdout);
  } catch (e) {
    fail(`Failed to parse JSON from ${context}.`, stdout);
  }
}

async function main() {
  console.log(`Building Android APK (profile: ${EAS_PROFILE})…`);
  console.log(`Target device: ${DEVICE_ID ?? '(auto)'}${DEVICE_ID ? '' : ' (will auto-detect)'} `);

  const adb = findAdb();
  if (!adb) {
    fail(
      'adb not found. Install Android platform-tools or set ADB env var to your adb.exe path.',
      'Expected at: %LOCALAPPDATA%\\Android\\Sdk\\platform-tools\\adb.exe'
    );
  }

  // Verify device is connected and choose target
  const devices = run(adb, ['devices'], { print: false });
  if (devices.status !== 0) fail('Failed to run adb devices.', devices.stderr || devices.stdout);

  const lines = devices.stdout
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => l !== 'List of devices attached');

  const connected = lines
    .map((l) => l.split(/\s+/))
    .filter((parts) => parts.length >= 2 && parts[1] === 'device')
    .map((parts) => parts[0]);

  let targetDevice = DEVICE_ID;
  if (!targetDevice) {
    if (connected.length === 1) {
      targetDevice = connected[0];
      console.log(`Auto-selected device: ${targetDevice}`);
    } else {
      fail(
        'Multiple (or zero) devices detected. Set DEPLOY_DEVICE_ID to choose one.',
        `Connected devices: ${connected.length ? connected.join(', ') : '(none)'}\n\nFull adb devices output:\n${devices.stdout}`
      );
    }
  }

  if (!connected.includes(targetDevice)) {
    fail(
      `Target device not detected by adb: ${targetDevice}`,
      `Connected devices: ${connected.length ? connected.join(', ') : '(none)'}\n\nFull adb devices output:\n${devices.stdout}`
    );
  }

  // Build (waits for completion)
  const buildRes = run('pnpm', [
    '-s',
    'dlx',
    'eas-cli@latest',
    'build',
    '-p',
    'android',
    '-e',
    EAS_PROFILE,
    '--wait',
    '--json',
    '--non-interactive',
  ]);

  if (buildRes.status !== 0) {
    fail('EAS build failed. If this is an auth issue, set EXPO_TOKEN and re-run.', buildRes.stderr || buildRes.stdout);
  }

  const buildJson = parseJson(buildRes.stdout, 'eas build');
  const buildId = Array.isArray(buildJson) ? buildJson[0]?.id : buildJson?.id;
  if (!buildId) {
    fail('Could not determine build ID from EAS JSON output.', buildRes.stdout);
  }

  console.log(`\nBuild finished. Build ID: ${buildId}`);
  console.log('Fetching artifact URL…');

  const viewRes = run('pnpm', [
    '-s',
    'dlx',
    'eas-cli@latest',
    'build:view',
    buildId,
    '--json',
  ]);

  if (viewRes.status !== 0) {
    fail('Failed to fetch build metadata (eas build:view).', viewRes.stderr || viewRes.stdout);
  }

  const viewJson = parseJson(viewRes.stdout, 'eas build:view');
  const apkUrl = viewJson?.artifacts?.applicationArchiveUrl || viewJson?.artifacts?.buildUrl;
  if (!apkUrl) {
    fail('Could not find applicationArchiveUrl in build metadata.', viewRes.stdout);
  }

  const outApk = path.join(os.homedir(), 'Downloads', `lavirant-${EAS_PROFILE}-latest.apk`);
  console.log(`Downloading APK to: ${outApk}`);
  await downloadToFile(apkUrl, outApk);

  console.log('\nInstalling to device…');
  // Try update first
  const installRes = run(adb, ['-s', targetDevice, 'install', '-r', outApk], { print: false });

  if (installRes.status !== 0) {
    const output = `${installRes.stdout || ''}\n${installRes.stderr || ''}`;
    console.error(output);
    console.log('Install failed; attempting uninstall + fresh install…');

    const uninstallRes = run(adb, ['-s', targetDevice, 'uninstall', ANDROID_PACKAGE], { print: false });
    // Ignore uninstall failures (e.g., not installed)
    if (uninstallRes.stdout) process.stdout.write(uninstallRes.stdout);
    if (uninstallRes.stderr) process.stderr.write(uninstallRes.stderr);

    const freshInstall = run(adb, ['-s', targetDevice, 'install', outApk]);
    if (freshInstall.status !== 0) {
      fail('Fresh install failed.', freshInstall.stderr || freshInstall.stdout);
    }
  } else {
    process.stdout.write(installRes.stdout);
    process.stderr.write(installRes.stderr);
  }

  console.log('\nDone. New APK installed.');
  console.log('If the launcher still shows the old label/icon, reboot the phone or remove/re-add the launcher shortcut (launcher cache).');
}

main().catch((e) => fail(e.message, e.stack));
