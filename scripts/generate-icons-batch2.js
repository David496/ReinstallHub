const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

const icons = {
  'vcredist.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#5c2d91"/>
    <path d="M14 14l10-4 10 4v10l-10 14-10-14z" fill="#ffffff" opacity="0.15"/>
    <text x="24" y="27" font-size="12" font-family="Segoe UI, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">C++</text>
    <text x="24" y="37" font-size="8" font-family="Segoe UI, sans-serif" font-weight="bold" fill="#ffd166" text-anchor="middle">REDIST</text>
  </svg>`,

  'dotnet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#512bd4"/>
    <circle cx="16" cy="30" r="3" fill="#ffffff"/>
    <text x="28" y="31" font-size="16" font-family="Segoe UI, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">NET</text>
  </svg>`,

  'ddu.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#d90429"/>
    <circle cx="24" cy="24" r="14" stroke="#ffffff" stroke-width="3" fill="none"/>
    <path d="M16 16l16 16m0-16L16 32" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,

  'lockhunter.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#0077b6"/>
    <rect x="15" y="20" width="18" height="16" rx="3" fill="#ffd166"/>
    <path d="M19 20v-5a5 5 0 0 1 10 0v5" stroke="#ffffff" stroke-width="3.5" fill="none"/>
    <circle cx="24" cy="27" r="2" fill="#333333"/>
    <path d="M24 29v3" stroke="#333333" stroke-width="2"/>
  </svg>`,

  'autoruns.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#2b2d42"/>
    <path d="M15 14h18v6H15z" fill="#06d6a0"/>
    <path d="M15 22h18v6H15z" fill="#118ab2"/>
    <path d="M15 30h18v6H15z" fill="#ffd166"/>
    <circle cx="11" cy="17" r="2" fill="#06d6a0"/>
    <circle cx="11" cy="25" r="2" fill="#118ab2"/>
    <circle cx="11" cy="33" r="2" fill="#ffd166"/>
  </svg>`,

  'shutup10.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#1d3557"/>
    <circle cx="24" cy="24" r="13" stroke="#e63946" stroke-width="3.5" fill="none"/>
    <path d="M16 24h16" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,

  'obsidian.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#1e1528"/>
    <path d="M24 10l9 7-4 17-10 4-5-10 4-13z" fill="#7a3ee8"/>
    <path d="M24 10l5 7-4 13-5-2z" fill="#935ff0"/>
  </svg>`,

  'notion.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#000000"/>
    <path d="M14 13l15-2 5 3v20l-16 3-4-3zm5 4v13l8-2V15z" fill="#ffffff"/>
    <text x="24" y="30" font-size="16" font-family="Georgia, serif" font-weight="bold" fill="#000000" text-anchor="middle">N</text>
  </svg>`,

  'calibre.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#4a5568"/>
    <rect x="13" y="12" width="6" height="24" rx="2" fill="#805ad5"/>
    <rect x="21" y="10" width="6" height="26" rx="2" fill="#dd6b20"/>
    <rect x="29" y="14" width="6" height="22" rx="2" fill="#319795"/>
  </svg>`,

  'marktext.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#2d3748"/>
    <circle cx="24" cy="24" r="12" fill="#e2e8f0"/>
    <path d="M18 19h12v2H18zm0 5h12v2H18zm0 5h7v2H18z" fill="#4a5568"/>
  </svg>`,

  'klite.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#1b4332"/>
    <path d="M16 15l16 9-16 9z" fill="#52b788"/>
    <text x="31" y="36" font-size="9" font-family="sans-serif" font-weight="900" fill="#d8f3dc" text-anchor="middle">CODEC</text>
  </svg>`,

  'losslesscut.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#0f172a"/>
    <circle cx="18" cy="18" r="4" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    <circle cx="18" cy="30" r="4" stroke="#38bdf8" stroke-width="2.5" fill="none"/>
    <line x1="21" y1="20" x2="33" y2="30" stroke="#f43f5e" stroke-width="3" stroke-linecap="round"/>
    <line x1="21" y1="28" x2="33" y2="18" stroke="#f43f5e" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  'aimp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#e85d04"/>
    <circle cx="24" cy="24" r="13" fill="#ffffff"/>
    <path d="M20 17l12 7-12 7z" fill="#e85d04"/>
  </svg>`,

  'vivaldi.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#ef3939"/>
    <circle cx="24" cy="24" r="13" fill="#ffffff"/>
    <path d="M19 18l5 12 5-12z" fill="#ef3939"/>
  </svg>`,

  'librewolf.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#005f73"/>
    <circle cx="24" cy="24" r="13" fill="#0a9396"/>
    <path d="M18 16l6 8 6-8-2 13-4 3-4-3z" fill="#ffffff"/>
  </svg>`,

  'tor.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#7d4698"/>
    <circle cx="24" cy="24" r="13" stroke="#ffffff" stroke-width="3" fill="none"/>
    <path d="M24 11c5 4 7 8 7 13s-2 9-7 13" stroke="#ffffff" stroke-width="2.5" fill="none"/>
  </svg>`,

  'afterburner.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#14213d"/>
    <circle cx="24" cy="24" r="13" stroke="#fca311" stroke-width="3.5" stroke-dasharray="16 6" fill="none"/>
    <path d="M24 24l5-6" stroke="#e63946" stroke-width="3" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="3" fill="#fca311"/>
  </svg>`,

  'heroic.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#581c87"/>
    <path d="M15 15h6v18h-6zm12 0h6v18h-6zm-6 6h6v6h-6z" fill="#facc15"/>
  </svg>`,

  'retroarch.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#111827"/>
    <path d="M14 18h20l2 12-4 2-3-4H19l-3 4-4-2z" fill="#9ca3af"/>
    <circle cx="19" cy="23" r="2" fill="#ef4444"/>
    <circle cx="29" cy="23" r="2" fill="#3b82f6"/>
  </svg>`,

  'localsend.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#0d9488"/>
    <circle cx="24" cy="24" r="12" fill="#ffffff"/>
    <path d="M18 24h12m-5-5l5 5-5 5" stroke="#0d9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'ventoy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#1e3a8a"/>
    <path d="M14 14l10 20 10-20h-7l-3 7-3-7z" fill="#60a5fa"/>
  </svg>`,

  'balenaetcher.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#1f2937"/>
    <circle cx="24" cy="24" r="13" stroke="#10b981" stroke-width="3.5" fill="none"/>
    <circle cx="24" cy="24" r="6" fill="#10b981"/>
  </svg>`,

  'jdownloader.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#1e293b"/>
    <circle cx="24" cy="24" r="13" fill="#3b82f6"/>
    <path d="M24 16v12m-5-4l5 5 5-5" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M17 32h14" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  'tailscale.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#0f172a"/>
    <circle cx="18" cy="18" r="3" fill="#ffffff"/>
    <circle cx="24" cy="18" r="3" fill="#ffffff"/>
    <circle cx="30" cy="18" r="3" fill="#ffffff"/>
    <circle cx="24" cy="24" r="3" fill="#ffffff"/>
    <circle cx="30" cy="24" r="3" fill="#ffffff"/>
    <circle cx="30" cy="30" r="3" fill="#ffffff"/>
  </svg>`
};

for (const [filename, content] of Object.entries(icons)) {
  fs.writeFileSync(path.join(iconsDir, filename), content.trim());
  console.log(`Saved ${filename}`);
}

console.log('Batch 2 icons generated successfully!');
