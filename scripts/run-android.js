const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const isWindows = process.platform === 'win32';

function quoteCmdArg(arg) {
  if (!/[\s"]/u.test(arg)) return arg;
  return `"${arg.replace(/"/g, '""')}"`;
}

function spawnNpx(args, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv };

  if (isWindows) {
    const cmdLine = ['npx', ...args].map(quoteCmdArg).join(' ');
    return spawn('cmd.exe', ['/d', '/s', '/c', cmdLine], {
      stdio: 'inherit',
      shell: false,
      env,
    });
  }

  return spawn('npx', args, {
    stdio: 'inherit',
    shell: false,
    env,
  });
}

function pathExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function resolveAndroidSdkPath() {
  const fromEnv = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (fromEnv && pathExists(fromEnv)) return fromEnv;

  if (isWindows) {
    const localAppData = process.env.LOCALAPPDATA;
    if (localAppData) {
      const defaultWindowsSdk = path.join(localAppData, 'Android', 'Sdk');
      if (pathExists(defaultWindowsSdk)) return defaultWindowsSdk;
    }
  }

  const home = process.env.HOME || process.env.USERPROFILE;
  if (!home) return null;

  const candidates = [
    path.join(home, 'Library', 'Android', 'sdk'), // macOS default
    path.join(home, 'Android', 'Sdk'),
    path.join(home, 'Android', 'sdk'),
  ];

  for (const candidate of candidates) {
    if (pathExists(candidate)) return candidate;
  }

  return null;
}

function hasAdbOnPath() {
  const cmd = isWindows ? 'where' : 'which';
  const result = spawnSync(cmd, ['adb'], {
    stdio: 'ignore',
    shell: false,
  });

  return result.status === 0;
}

function getAdbFromSdk(sdkPath) {
  if (!sdkPath) return null;
  const adbExe = isWindows ? 'adb.exe' : 'adb';
  const adbPath = path.join(sdkPath, 'platform-tools', adbExe);
  return pathExists(adbPath) ? adbPath : null;
}

function runExpo(expoArgs, extraEnv = {}) {
  const child = spawnNpx(expoArgs, extraEnv);

  child.on('exit', (code) => {
    process.exit(typeof code === 'number' ? code : 1);
  });

  child.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
}

const sdkPath = resolveAndroidSdkPath();
const adbFromSdk = getAdbFromSdk(sdkPath);
const adbAvailable = hasAdbOnPath() || Boolean(adbFromSdk);

if (!sdkPath || !adbAvailable) {
  console.log('Android emulator/ADB is not configured on this machine.');

  if (!sdkPath) {
    const defaultWindowsSdk = process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk')
      : null;

    console.log('Failed to resolve the Android SDK path.');
    if (isWindows && defaultWindowsSdk) {
      console.log(`Default install location not found: ${defaultWindowsSdk}`);
    }
    console.log('Set ANDROID_HOME (or ANDROID_SDK_ROOT) to your Android SDK folder.');
  }

  if (!adbAvailable) {
    console.log("Error: 'adb' was not found on PATH (Android Platform-Tools missing or not in PATH). ");
  }

  console.log('');
  console.log('To fix on Windows:');
  console.log('- Install Android Studio (includes the SDK manager).');
  console.log('- In Android Studio → SDK Manager, install Android SDK Platform-Tools.');
  console.log('- Set ANDROID_HOME (or ANDROID_SDK_ROOT) to your SDK path, commonly:');
  console.log('  C:\\Users\\<you>\\AppData\\Local\\Android\\Sdk');
  console.log('- Add %ANDROID_HOME%\\platform-tools to your PATH (so `adb` works).');
  console.log('');
  console.log('Starting Expo dev server without launching Android…');

  runExpo(['expo', 'start']);
} else {
  const env = {
    ANDROID_HOME: process.env.ANDROID_HOME || sdkPath,
    ANDROID_SDK_ROOT: process.env.ANDROID_SDK_ROOT || sdkPath,
  };

  runExpo(['expo', 'start', '--android'], env);
}
