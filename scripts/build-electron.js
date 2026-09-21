const esbuild = require('esbuild');
const path = require('path');
const { spawn } = require('child_process');

const isWatch = process.argv.includes('--watch');

async function build() {
  const commonConfig = {
    platform: 'node',
    target: 'node20',
    bundle: true,
    sourcemap: true,
    external: ['electron'],
  };

  // Build Main Process
  const mainCtx = await esbuild.context({
    ...commonConfig,
    entryPoints: [path.join(__dirname, '../electron/main.ts')],
    outfile: path.join(__dirname, '../dist/main/main.js'),
    format: 'cjs',
  });

  // Build Preload Script
  const preloadCtx = await esbuild.context({
    ...commonConfig,
    entryPoints: [path.join(__dirname, '../electron/preload.ts')],
    outfile: path.join(__dirname, '../dist/preload/preload.js'),
    format: 'cjs',
  });

  if (isWatch) {
    let electronProcess = null;

    const startElectron = () => {
      if (electronProcess) {
        electronProcess.removeAllListeners();
        electronProcess.kill();
        electronProcess = null;
      }

      // electron binary path from node_modules
      const electronCmd = process.platform === 'win32' 
        ? path.join(__dirname, '../node_modules/.bin/electron.cmd')
        : path.join(__dirname, '../node_modules/.bin/electron');

      electronProcess = spawn(electronCmd, ['.'], {
        stdio: 'inherit',
        shell: true,
      });

      electronProcess.on('close', (code) => {
        if (code !== null && code !== 0) {
          process.exit(code);
        }
      });
    };

    await mainCtx.watch();
    await preloadCtx.watch();
    console.log('[esbuild] Watching electron main and preload...');
    
    // Initial build
    await mainCtx.rebuild();
    await preloadCtx.rebuild();
    console.log('[esbuild] Initial Electron build complete. Launching Electron...');
    startElectron();
  } else {
    await mainCtx.rebuild();
    await preloadCtx.rebuild();
    await mainCtx.dispose();
    await preloadCtx.dispose();
    console.log('[esbuild] Electron main & preload build complete.');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
