import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { WingetInstallProgress } from '../../src/types/winget';
import { LoggerService } from './LoggerService';
import { WingetDetector } from './WingetDetector';

const VCLIBS_URL = 'https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx';
const UI_XAML_URL = 'https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx';
const WINGET_BUNDLE_URL = 'https://aka.ms/getwinget';

export class WingetInstaller {
  private static logger = LoggerService.getInstance();
  private static isInstalling = false;

  public static isBusy(): boolean {
    return this.isInstalling;
  }

  private static async downloadFile(
    url: string,
    targetPath: string,
    onProgress?: (percent: number) => void
  ): Promise<void> {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) {
      throw new Error(`Failed to download ${url}: HTTP ${res.status} ${res.statusText}`);
    }

    const totalBytes = Number(res.headers.get('content-length')) || 0;
    let downloadedBytes = 0;

    const fileStream = fs.createWriteStream(targetPath);

    if (!res.body) {
      throw new Error('Response body is empty');
    }

    // @ts-ignore - ReadableStream iterate in Node 18+
    for await (const chunk of res.body) {
      fileStream.write(chunk);
      downloadedBytes += chunk.length;
      if (totalBytes > 0 && onProgress) {
        const percent = Math.min(100, Math.round((downloadedBytes / totalBytes) * 100));
        onProgress(percent);
      }
    }

    await new Promise<void>((resolve, reject) => {
      fileStream.end((err?: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public static async install(
    onProgress?: (progress: WingetInstallProgress) => void
  ): Promise<{ success: boolean; message: string; version?: string }> {
    if (this.isInstalling) {
      return { success: false, message: 'Installation is already in progress.' };
    }

    this.isInstalling = true;
    const tempDir = path.join(os.tmpdir(), `reinstall-hub-winget-${Date.now()}`);

    const emit = (progress: WingetInstallProgress) => {
      this.logger.info(`[WinGet Installer] ${progress.message}`);
      if (onProgress) onProgress(progress);
    };

    try {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const vclibsPath = path.join(tempDir, 'Microsoft.VCLibs.x64.appx');
      const xamlPath = path.join(tempDir, 'Microsoft.UI.Xaml.x64.appx');
      const bundlePath = path.join(tempDir, 'Microsoft.DesktopAppInstaller.msixbundle');

      // 1. Download Dependencies (VCLibs & UI.Xaml)
      emit({
        step: 'downloading_deps',
        percent: 15,
        message: 'Descargando dependencias oficiales (VCLibs y UI.Xaml)...',
      });

      this.logger.info(`Downloading VCLibs from ${VCLIBS_URL}...`);
      await this.downloadFile(VCLIBS_URL, vclibsPath);

      this.logger.info(`Downloading UI.Xaml from ${UI_XAML_URL}...`);
      await this.downloadFile(UI_XAML_URL, xamlPath);

      // 2. Download WinGet MSIX Bundle
      emit({
        step: 'downloading_bundle',
        percent: 50,
        message: 'Descargando paquete oficial de Windows Package Manager (MSIX Bundle)...',
      });

      this.logger.info(`Downloading DesktopAppInstaller bundle from ${WINGET_BUNDLE_URL}...`);
      await this.downloadFile(WINGET_BUNDLE_URL, bundlePath, (p) => {
        emit({
          step: 'downloading_bundle',
          percent: 50 + Math.round(p * 0.3),
          message: `Descargando paquete WinGet... (${p}%)`,
        });
      });

      // 3. Register & Install Packages via PowerShell
      emit({
        step: 'installing',
        percent: 85,
        message: 'Instalando y registrando WinGet en Windows...',
      });

      const psScript = `
        try {
          Write-Output "Installing VCLibs dependency..."
          Add-AppxPackage -Path '${vclibsPath}' -ErrorAction SilentlyContinue
          Write-Output "Installing UI.Xaml dependency..."
          Add-AppxPackage -Path '${xamlPath}' -ErrorAction SilentlyContinue
          Write-Output "Installing WinGet DesktopAppInstaller Bundle..."
          Add-AppxPackage -Path '${bundlePath}' -DependencyPath '${vclibsPath}','${xamlPath}'
          Write-Output "SUCCESS"
        } catch {
          Write-Error $_.Exception.Message
          exit 1
        }
      `;

      await new Promise<void>((resolve, reject) => {
        const ps = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript], {
          windowsHide: true,
        });

        let stderr = '';
        ps.stdout.on('data', (d) => this.logger.info(`[PowerShell] ${d.toString().trim()}`));
        ps.stderr.on('data', (d) => {
          stderr += d.toString();
          this.logger.warning(`[PowerShell] ${d.toString().trim()}`);
        });

        ps.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(stderr || `PowerShell exited with code ${code}`));
          }
        });

        ps.on('error', reject);
      });

      // 4. Verification
      emit({
        step: 'verifying',
        percent: 95,
        message: 'Verificando disponibilidad del CLI winget en el sistema...',
      });

      // Allow a brief pause for Windows to register PATH / App Execution Alias
      await new Promise((r) => setTimeout(r, 2000));
      const info = await WingetDetector.detect(true);

      if (info.isAvailable) {
        emit({
          step: 'completed',
          percent: 100,
          message: `WinGet instalado y activado correctamente (Versión: ${info.version}).`,
        });
        return {
          success: true,
          message: `WinGet se instaló y detectó correctamente con versión ${info.version}.`,
          version: info.version || undefined,
        };
      } else {
        throw new Error('WinGet fue instalado pero aún no se detecta en PATH. Puede requerir reiniciar el equipo.');
      }
    } catch (err: any) {
      this.logger.error(`Error durante la instalación de WinGet: ${err.message}`);
      emit({
        step: 'failed',
        percent: 0,
        message: `Error al instalar WinGet: ${err.message}`,
        error: err.message,
      });
      return { success: false, message: err.message };
    } finally {
      this.isInstalling = false;
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch {
        // ignore temp cleanup
      }
    }
  }
}
