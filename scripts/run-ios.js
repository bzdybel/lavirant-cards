const { spawn } = require('node:child_process');

const isMacOS = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

function quoteCmdArg(arg) {
  if (!/[\s"]/u.test(arg)) return arg;
  return `"${arg.replace(/"/g, '""')}"`;
}

function spawnNpx(args) {
  if (isWindows) {
    const cmdLine = ['npx', ...args].map(quoteCmdArg).join(' ');
    return spawn('cmd.exe', ['/d', '/s', '/c', cmdLine], {
      stdio: 'inherit',
      shell: false,
    });
  }

  return spawn('npx', args, {
    stdio: 'inherit',
    shell: false,
  });
}

const expoArgs = ['expo', 'start'];

if (isMacOS) {
  expoArgs.push('--ios');
} else {
  // iOS Simulator requires Xcode, which requires macOS.
  // On Windows/Linux, we still start the dev server so you can use Expo Go or a device.
  console.log('iOS Simulator requires macOS + Xcode.');
  console.log('Starting Expo dev server without launching the iOS Simulator...');
}

const child = spawnNpx(expoArgs);

child.on('exit', (code) => {
  process.exit(typeof code === 'number' ? code : 1);
});

child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
