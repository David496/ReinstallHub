import { spawn } from 'child_process';
import os from 'os';
import { WingetInfo } from '../../src/types/winget';
import { isWindows } from '../utils/platformUtils';
import { LoggerService } from './LoggerService';

export class WingetDetector {
  private static cachedInfo: WingetInfo | null = null;
  private static logger = LoggerService.getInstance();

  public static async detect(forceRefresh = false): Promise<WingetInfo> {
    if (this.cachedInfo && !forceRefresh) {
      return this.cachedInfo;
    }

    this.logger.info('Checking Windows Package Manager (winget) availability...');

    if (!isWindows()) {
      const errorMsg = `ReInstall Hub requires Windows. Current platform: ${process.platform}`;
      this.logger.warning(errorMsg);
      const info: WingetInfo = {
        isAvailable: false,
        version: null,
        architecture: os.arch(),
        platform: process.platform,
        error: errorMsg,
      };
      this.cachedInfo = info;
      return info;
    }

    return new Promise<WingetInfo>((resolve) => {
      let stdoutData = '';
      let stderrData = '';

      try {
        // Run winget --version with shell: true for Windows PATH resolution
        const child = spawn('winget', ['--version'], {
          shell: true,
          windowsHide: true,
        });

        child.stdout.on('data', (chunk) => {
          stdoutData += chunk.toString();
        });

        child.stderr.on('data', (chunk) => {
          stderrData += chunk.toString();
        });

        child.on('error', (err) => {
          const errMsg = `WinGet process failed to launch: ${err.message}`;
          this.logger.error(errMsg);
          const result: WingetInfo = {
            isAvailable: false,
            version: null,
            architecture: os.arch(),
            platform: process.platform,
            error: errMsg,
          };
          this.cachedInfo = result;
          resolve(result);
        });

        child.on('close', (code) => {
          if (code === 0) {
            // e.g. "v1.29.290" or "1.10.390"
            const match = stdoutData.match(/v?(\d+\.\d+(\.\d+)?(\.\w+)?)/i);
            const version = match ? match[1] : stdoutData.trim();
            this.logger.success(`WinGet detected successfully. Version: ${version}`);

            const result: WingetInfo = {
              isAvailable: true,
              version,
              architecture: os.arch(),
              platform: process.platform,
            };
            this.cachedInfo = result;
            resolve(result);
          } else {
            const errMsg = stderrData.trim() || `WinGet exited with code ${code}. WinGet may not be installed or enabled in PATH.`;
            this.logger.warning(errMsg);
            const result: WingetInfo = {
              isAvailable: false,
              version: null,
              architecture: os.arch(),
              platform: process.platform,
              error: errMsg,
            };
            this.cachedInfo = result;
            resolve(result);
          }
        });
      } catch (err: any) {
        const errMsg = `Exception checking winget: ${err.message}`;
        this.logger.error(errMsg);
        const result: WingetInfo = {
          isAvailable: false,
          version: null,
          architecture: os.arch(),
          platform: process.platform,
          error: errMsg,
        };
        this.cachedInfo = result;
        resolve(result);
      }
    });
  }
}
