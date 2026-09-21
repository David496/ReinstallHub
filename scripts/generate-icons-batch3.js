const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const icons = {
  'pdf24.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#0052cc"/>
    <circle cx="24" cy="22" r="12" fill="#ffffff"/>
    <circle cx="19" cy="20" r="2" fill="#172b4d"/>
    <circle cx="29" cy="20" r="2" fill="#172b4d"/>
    <ellipse cx="24" cy="25" rx="3" ry="2" fill="#ff7452"/>
    <path d="M12 18c-3-2-3-6 0-8 3 2 2 6 0 8zM36 18c3-2 3-6 0-8-3 2-2 6 0 8z" fill="#ffffff"/>
    <rect x="14" y="34" width="20" height="9" rx="3" fill="#ff5630"/>
    <text x="24" y="41" font-size="7" font-family="Segoe UI, sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">PDF24</text>
  </svg>`,

  'wisediskcleaner.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#0284c7"/>
    <circle cx="24" cy="24" r="14" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="24" cy="24" r="5" fill="#0284c7"/>
    <path d="M28 14l6-6 4 4-6 6z" fill="#f59e0b"/>
    <path d="M26 16l-8 12c-1 2 0 4 2 4s3-1 4-2l6-10z" fill="#facc15"/>
    <path d="M18 30l-4 6 6-2z" fill="#fbbf24"/>
  </svg>`,

  'ccleaner.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#dc2626"/>
    <path d="M34 16c-3-4-9-5-14-3-6 3-9 9-8 15 1 6 7 11 13 10 5-1 9-5 10-9" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <path d="M28 26l7 7 3-3-7-7z" fill="#f59e0b"/>
    <path d="M33 35l-2 5 6-1z" fill="#fef08a"/>
  </svg>`,

  'googledrive.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#ffffff"/>
    <path d="M17 11l-9 16 5 9 9-16z" fill="#0066da"/>
    <path d="M17 11h14l9 16H26z" fill="#00ac47"/>
    <path d="M13 36h22l5-9H18z" fill="#ffba00"/>
    <path d="M26 27l-5 9h14l5-9z" fill="#ea4335" opacity="0.1"/>
  </svg>`,

  'dropbox.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#0061ff"/>
    <path d="M13 14l11 7-7 6-11-7zm22 0l7 6-11 7-7-6zm-18 19l7-6 11 7-7 6zm18 0l7-6 7 6-11 7zM24 28l7-5 7 5-7 5z" fill="#ffffff" opacity="0.15"/>
    <path d="M14 16l10 6-6 5-10-6zm20 0l6 5-10 6-6-5zm-16 17l6-5 10 6-6 5zm16 0l6-5 6 5-10 6zM24 23l6 5-6 5-6-5z" fill="#ffffff"/>
  </svg>`,

  'cinebench.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#1e1e24"/>
    <path d="M12 24a12 12 0 1 1 24 0 12 12 0 0 1-24 0z" fill="none" stroke="#f97316" stroke-width="4.5" stroke-dasharray="60 16"/>
    <rect x="20" y="16" width="14" height="14" rx="2" fill="#ea580c"/>
    <path d="M23 20h8v2h-8zm0 4h6v2h-6z" fill="#ffffff"/>
    <text x="24" y="42" font-size="8" font-family="Segoe UI, sans-serif" font-weight="900" fill="#fdba74" text-anchor="middle">R23</text>
  </svg>`,

  'furmark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#0f172a"/>
    <circle cx="24" cy="24" r="14" fill="#ea580c"/>
    <circle cx="24" cy="24" r="12" fill="#f59e0b"/>
    <circle cx="24" cy="24" r="7" fill="#0f172a"/>
    <path d="M24 6c2 4-1 7 1 10M38 18c-3 2-4-2-7 1M38 30c-4-1-5 3-8 1M24 42c-2-4 1-7-1-10M10 30c3-2 4 2 7-1M10 18c4 1 5-3 8-1" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
    <text x="24" y="27" font-size="9" font-family="Segoe UI, sans-serif" font-weight="900" fill="#fef08a" text-anchor="middle">FUR</text>
  </svg>`,

  'occt.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#991b1b"/>
    <path d="M24 8l14 8v16l-14 8-14-8V16z" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>
    <text x="24" y="27" font-size="11" font-family="Segoe UI, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">OCCT</text>
    <path d="M16 32h16" stroke="#fca5a5" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  'geekbench.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#0284c7"/>
    <circle cx="24" cy="24" r="13" fill="none" stroke="#ffffff" stroke-width="3"/>
    <path d="M17 28l5-6 4 3 5-7" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="24" y="20" font-size="10" font-family="Segoe UI, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">GB6</text>
  </svg>`,

  'aida64.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#0f172a"/>
    <rect x="8" y="10" width="32" height="28" rx="4" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
    <text x="24" y="25" font-size="11" font-family="Segoe UI, sans-serif" font-weight="900" fill="#60a5fa" text-anchor="middle">AIDA</text>
    <text x="24" y="35" font-size="10" font-family="Segoe UI, sans-serif" font-weight="900" fill="#ef4444" text-anchor="middle">64</text>
  </svg>`,

  'wireshark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#0c4a6e"/>
    <path d="M12 36c4-8 12-16 12-22 4 4 10 9 12 22z" fill="#0284c7"/>
    <path d="M18 36c2-6 6-12 6-16 2 3 6 7 8 16z" fill="#38bdf8"/>
    <path d="M8 36h32" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round"/>
    <path d="M14 40h20" stroke="#bae6fd" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  'cloudflare.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#f97316"/>
    <path d="M33 19c-1-4-5-6-9-5-3 1-5 4-5 7-3 1-5 3-5 7 0 4 3 7 7 7h18c3 0 6-3 6-6 0-4-3-7-7-7z" fill="#ffffff"/>
    <path d="M22 28l-2 6h8l2-6z" fill="#ea580c"/>
    <circle cx="21" cy="31" r="1.5" fill="#ffffff"/>
    <circle cx="27" cy="31" r="1.5" fill="#ffffff"/>
  </svg>`,

  'angryip.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#b91c1c"/>
    <circle cx="24" cy="24" r="14" fill="#ef4444"/>
    <path d="M17 19l4 2m10-2l-4 2" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="19" cy="23" r="2.5" fill="#ffffff"/>
    <circle cx="29" cy="23" r="2.5" fill="#ffffff"/>
    <path d="M19 31c2-3 8-3 10 0" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </svg>`,

  'mremoteng.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#1e293b"/>
    <rect x="10" y="10" width="28" height="20" rx="3" fill="#334155" stroke="#64748b" stroke-width="2"/>
    <path d="M10 16h28" stroke="#64748b" stroke-width="1.5"/>
    <circle cx="14" cy="13" r="1.5" fill="#ef4444"/>
    <circle cx="18" cy="13" r="1.5" fill="#eab308"/>
    <circle cx="22" cy="13" r="1.5" fill="#22c55e"/>
    <path d="M24 30v6m-6 0h12" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
    <text x="24" y="26" font-size="8" font-family="Segoe UI, sans-serif" font-weight="bold" fill="#38bdf8" text-anchor="middle">mR</text>
  </svg>`,

  'protonvpn.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#1b1335"/>
    <path d="M24 8l14 6v10c0 10-7 15-14 18-7-3-14-8-14-18V14z" fill="#6d4aff"/>
    <path d="M24 16l8 12h-6l-2-4-2 4h-6z" fill="#ffffff"/>
    <path d="M24 16l-8 12h5l3-5z" fill="#a48dff"/>
  </svg>`,

  '1password.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#0094f5"/>
    <circle cx="24" cy="24" r="13" fill="#ffffff"/>
    <rect x="22" y="17" width="4" height="14" rx="2" fill="#0094f5"/>
    <circle cx="24" cy="24" r="2.5" fill="#0094f5"/>
  </svg>`,

  'figma.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#1e1e1e"/>
    <path d="M18 10h6v6h-6a3 3 0 0 1 0-6z" fill="#f24e1e"/>
    <path d="M24 10h6a3 3 0 0 1 0 6h-6z" fill="#ff7262"/>
    <path d="M18 16h6v6h-6a3 3 0 0 1 0-6z" fill="#a259ff"/>
    <circle cx="27" cy="19" r="3" fill="#1abcfe"/>
    <path d="M18 22h6v6a3 3 0 0 1-6 0z" fill="#0acf83"/>
  </svg>`,

  'drawio.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#f08705"/>
    <rect x="10" y="12" width="10" height="10" rx="2" fill="#ffffff"/>
    <rect x="28" y="26" width="10" height="10" rx="2" fill="#ffffff"/>
    <path d="M20 17h8v9" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <polygon points="28,29 25,24 31,24" fill="#ffffff"/>
  </svg>`,

  'xmind.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#d92d20"/>
    <circle cx="24" cy="24" r="6" fill="#ffffff"/>
    <circle cx="12" cy="16" r="3.5" fill="#ffffff"/>
    <circle cx="36" cy="16" r="3.5" fill="#ffffff"/>
    <circle cx="14" cy="34" r="3.5" fill="#ffffff"/>
    <circle cx="34" cy="34" r="3.5" fill="#ffffff"/>
    <path d="M15 18l5 4m8 0l5-4m-13 8l-3 5m11-5l3 5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  'shotcut.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#005a70"/>
    <rect x="10" y="12" width="28" height="24" rx="3" fill="#008080" stroke="#20b2aa" stroke-width="2"/>
    <polygon points="20,18 32,24 20,30" fill="#ffffff"/>
    <path d="M28 12l-8 24" stroke="#e0f2fe" stroke-width="2" stroke-dasharray="3 3"/>
  </svg>`,

  'kdenlive.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#1b2a47"/>
    <path d="M12 16h6v16h-6zm8 0h6v16h-6zm8 0h6v16h-6zm8 0h2v16h-2z" fill="#3b82f6" opacity="0.4"/>
    <polygon points="20,17 32,24 20,31" fill="#ef4444"/>
    <path d="M14 24h20" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  'playnite.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#2d132c"/>
    <circle cx="24" cy="24" r="14" fill="#ee4540"/>
    <path d="M18 16h8a5 5 0 0 1 5 5c0 3-2 5-5 5h-4v6h-4zm4 4v4h4a2 2 0 0 0 0-4z" fill="#ffffff"/>
  </svg>`,

  'goggalaxy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#581c87"/>
    <circle cx="24" cy="24" r="14" fill="none" stroke="#a855f7" stroke-width="3"/>
    <circle cx="24" cy="24" r="7" fill="#ffffff"/>
    <circle cx="32" cy="18" r="3" fill="#c084fc"/>
    <circle cx="16" cy="30" r="2" fill="#c084fc"/>
  </svg>`,

  'ubisoft.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#000000"/>
    <path d="M24 10a14 14 0 1 0 14 14c0-5-3-9-8-11-5-2-10 1-11 5-1 4 1 8 5 9 3 1 6-1 7-4" fill="none" stroke="#00b0ff" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="25" cy="24" r="2" fill="#ffffff"/>
  </svg>`,

  'ea.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#ff4747"/>
    <polygon points="12,32 18,16 22,25 16,25 15,28 23,28 21,32" fill="#ffffff"/>
    <polygon points="26,32 32,16 38,32 34,32 32,26 28,26 27,29 33,29 31,32" fill="#ffffff"/>
  </svg>`,

  'windowsterminal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#1e1e1e"/>
    <path d="M10 10h28v6H10z" fill="#2d2d2d"/>
    <circle cx="14" cy="13" r="1.5" fill="#ff5f56"/>
    <circle cx="18" cy="13" r="1.5" fill="#ffbd2e"/>
    <circle cx="22" cy="13" r="1.5" fill="#27c93f"/>
    <path d="M15 22l6 5-6 5" stroke="#4af626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M24 32h9" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  'sublimetext.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#333333"/>
    <path d="M14 18l12-6 8 4-12 6z" fill="#ff9800"/>
    <path d="M14 24l12-6 8 4-12 6z" fill="#ff5722"/>
    <path d="M14 30l12-6 8 4-12 6z" fill="#f44336"/>
  </svg>`,

  'java.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#ffffff"/>
    <path d="M22 10c-3 4 1 6-1 9 3-2 4-5 1-9zM26 12c-2 3 1 5-1 7 2-1 3-4 1-7z" fill="#ea2d2e"/>
    <path d="M16 25h16c0 6-4 9-8 9s-8-3-8-9z" fill="#5382a1"/>
    <path d="M32 27c3 0 4 2 4 4s-2 4-4 4v-2c1 0 2-1 2-2s-1-2-2-2z" fill="#5382a1"/>
    <path d="M14 36c4 2 16 2 20 0" stroke="#ea2d2e" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </svg>`,

  'slack.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#4a154b"/>
    <path d="M19 15a2.5 2.5 0 0 1-2.5 2.5H14V15a2.5 2.5 0 1 1 5 0z" fill="#36c5f0"/>
    <path d="M14 20h5v5a2.5 2.5 0 0 1-5 0z" fill="#36c5f0"/>
    <path d="M20 19a2.5 2.5 0 0 1 2.5-2.5H25v2.5a2.5 2.5 0 1 1-5 0z" fill="#2eb67d"/>
    <path d="M25 14v5h-5a2.5 2.5 0 0 1 0-5z" fill="#2eb67d"/>
    <path d="M29 33a2.5 2.5 0 0 1 2.5-2.5H34V33a2.5 2.5 0 1 1-5 0z" fill="#e01e5a"/>
    <path d="M34 28h-5v-5a2.5 2.5 0 0 1 5 0z" fill="#e01e5a"/>
    <path d="M28 29a2.5 2.5 0 0 1-2.5 2.5H23v-2.5a2.5 2.5 0 1 1 5 0z" fill="#ecb22e"/>
    <path d="M23 34v-5h5a2.5 2.5 0 0 1 0 5z" fill="#ecb22e"/>
  </svg>`,

  'signal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="10" fill="#3a76f0"/>
    <path d="M24 12c-7 0-12 5-12 11 0 3 1 6 4 8l-1 5 5-2c1 1 3 1 4 1 7 0 12-5 12-11s-5-12-12-12z" fill="#ffffff"/>
    <circle cx="20" cy="23" r="2" fill="#3a76f0"/>
    <circle cx="24" cy="23" r="2" fill="#3a76f0"/>
    <circle cx="28" cy="23" r="2" fill="#3a76f0"/>
  </svg>`
};

console.log(`Generating ${Object.keys(icons).length} batch 3 icons...`);
for (const [filename, content] of Object.entries(icons)) {
  const filePath = path.join(iconsDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf-8');
  console.log(`Created: ${filename}`);
}
console.log('Batch 3 icons successfully generated!');
