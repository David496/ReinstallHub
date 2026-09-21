import { describe, it, expect } from 'vitest';
import { translateWingetExitCode, isProcessElevated } from '../../electron/utils/platformUtils';

describe('platformUtils - translateWingetExitCode', () => {
  it('identifies successful exit code 0', () => {
    const res = translateWingetExitCode(0);
    expect(res.isSuccess).toBe(true);
    expect(res.message).toMatch(/Installed successfully/);
  });

  it('identifies reboot required code 3010', () => {
    const res = translateWingetExitCode(3010);
    expect(res.isSuccess).toBe(true);
    expect(res.needsReboot).toBe(true);
  });

  it('translates access denied exit codes (5 and 0x80070005)', () => {
    const res5 = translateWingetExitCode(5);
    expect(res5.isSuccess).toBe(false);
    expect(res5.message).toMatch(/Administrator privileges/);

    const resHex = translateWingetExitCode(0x80070005);
    expect(resHex.isSuccess).toBe(false);
    expect(resHex.message).toMatch(/Administrator privileges/);
  });

  it('translates package not found (-1978335215)', () => {
    const res = translateWingetExitCode(-1978335215);
    expect(res.isSuccess).toBe(false);
    expect(res.message).toMatch(/Package not found/);
  });

  it('translates user cancellation (1602)', () => {
    const res = translateWingetExitCode(1602);
    expect(res.isSuccess).toBe(false);
    expect(res.message).toMatch(/cancelled by user/);
  });

  it('handles unknown exit code gracefully', () => {
    const res = translateWingetExitCode(9999);
    expect(res.isSuccess).toBe(false);
    expect(res.message).toBe('Installation failed with exit code 9999.');
  });

  it('detects process elevation state as boolean', async () => {
    const elevated = await isProcessElevated();
    expect(typeof elevated).toBe('boolean');
  });
});
