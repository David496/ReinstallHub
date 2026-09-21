const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

const icons = {
  'office.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#d83b01"/>
    <path d="M12 12h14v24H12z" fill="#f25022"/>
    <path d="M26 18h10v12H26z" fill="#ffb900"/>
    <text x="24" y="31" font-size="18" font-family="Segoe UI, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">O</text>
  </svg>`,

  'onlyoffice.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#ff6f3d"/>
    <circle cx="24" cy="24" r="14" fill="#ffffff" opacity="0.9"/>
    <path d="M18 19h12v3H18zm0 5h12v3H18zm0 5h8v3H18z" fill="#ff6f3d"/>
  </svg>`,

  'adobe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#fa0f00"/>
    <path d="M19.5 12h-8.5v24h4.8l7.5-17.5zm9 0h8.5v24h-4.8l-7.5-17.5zm-4.5 10.5l5.2 13.5h-4.6l-2.4-6.5h-3.6z" fill="#ffffff"/>
  </svg>`,

  'sumatra.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#ffd000"/>
    <path d="M14 12h14l8 8v16H14z" fill="#ffffff"/>
    <path d="M28 12v8h8z" fill="#e0b800"/>
    <text x="23" y="32" font-size="12" font-family="Segoe UI, sans-serif" font-weight="bold" fill="#333333" text-anchor="middle">PDF</text>
  </svg>`,

  'foxit.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#f36f21"/>
    <circle cx="24" cy="24" r="14" fill="#ffffff"/>
    <path d="M18 20c2-3 8-3 12 0l-6 10z" fill="#f36f21"/>
  </svg>`,

  'pdfcreator.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#0083ca"/>
    <path d="M14 12h20v24H14z" fill="#ffffff"/>
    <path d="M18 18h12v3H18zm0 5h12v3H18zm0 5h7v3H18z" fill="#0083ca"/>
    <circle cx="33" cy="33" r="7" fill="#e4312b"/>
    <text x="33" y="37" font-size="10" font-family="sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">+</text>
  </svg>`,

  'brave.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#fb542b"/>
    <path d="M24 10l8 4 2 11-10 13-10-13 2-11z" fill="#ffffff"/>
    <path d="M24 14l5 3 1 7-6 8-6-8 1-7z" fill="#fb542b"/>
  </svg>`,

  'operagx.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#141419"/>
    <circle cx="24" cy="24" r="14" stroke="#fa1e4e" stroke-width="4" fill="none"/>
    <ellipse cx="24" cy="24" rx="7" ry="12" fill="#fa1e4e"/>
  </svg>`,

  'winrar.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#4d5382"/>
    <rect x="12" y="14" width="24" height="6" rx="2" fill="#3a86ff"/>
    <rect x="12" y="21" width="24" height="6" rx="2" fill="#38b000"/>
    <rect x="12" y="28" width="24" height="6" rx="2" fill="#d90429"/>
    <rect x="22" y="11" width="4" height="26" fill="#ffb703"/>
  </svg>`,

  'peazip.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#58a65c"/>
    <circle cx="24" cy="24" r="13" fill="#ffffff"/>
    <path d="M20 18h8a4 4 0 0 1 0 8h-4v4h-4z" fill="#2d6a4f"/>
  </svg>`,

  'everything.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#ff9900"/>
    <circle cx="22" cy="22" r="9" stroke="#ffffff" stroke-width="3.5" fill="none"/>
    <line x1="28.5" y1="28.5" x2="36" y2="36" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,

  'rufus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#800020"/>
    <path d="M19 14h10v14h-10z" fill="#ffffff"/>
    <path d="M21 28h6v6h-6z" fill="#dddddd"/>
    <path d="M22 30h4v2h-4z" fill="#333333"/>
    <circle cx="24" cy="18" r="2" fill="#800020"/>
  </svg>`,

  'crystaldisk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#007acc"/>
    <circle cx="24" cy="24" r="13" fill="#ffffff"/>
    <circle cx="24" cy="24" r="5" fill="#007acc"/>
    <path d="M24 11v6m0 14v6m-13-13h6m14 0h6" stroke="#007acc" stroke-width="2"/>
  </svg>`,

  'treesize.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#2b9348"/>
    <path d="M24 10l-10 14h6v14h8V24h6z" fill="#ffffff"/>
  </svg>`,

  'bleachbit.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#023e8a"/>
    <path d="M16 32l10-18 4 3-10 18z" fill="#00b4d8"/>
    <path d="M14 30l6 6-4 2-4-4z" fill="#90e0ef"/>
  </svg>`,

  'bcuninstaller.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#d90429"/>
    <path d="M16 16l16 16m0-16L16 32" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'revouninstaller.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#003049"/>
    <circle cx="24" cy="24" r="12" stroke="#669bbc" stroke-width="3" fill="none"/>
    <path d="M24 12v6l4-3z" fill="#669bbc"/>
    <path d="M18 24h12" stroke="#fdf0d5" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  'geekuninstaller.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#3f37c9"/>
    <circle cx="19" cy="20" r="5" stroke="#ffffff" stroke-width="2" fill="none"/>
    <circle cx="29" cy="20" r="5" stroke="#ffffff" stroke-width="2" fill="none"/>
    <line x1="24" y1="20" x2="24" y2="20" stroke="#ffffff" stroke-width="2"/>
    <path d="M18 30c2 3 10 3 12 0" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`,

  'hwmonitor.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#4361ee"/>
    <path d="M12 24h6l3-8 6 16 4-8h5" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'gpuz.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#1e1e24"/>
    <rect x="14" y="14" width="20" height="20" rx="3" fill="#76b900"/>
    <text x="24" y="28" font-size="10" font-family="sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">GPU</text>
  </svg>`,

  'audacity.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#000080"/>
    <path d="M14 24c0-6 4-10 10-10s10 4 10 10" stroke="#ffd700" stroke-width="3" fill="none"/>
    <rect x="11" y="22" width="4" height="8" rx="2" fill="#ff4500"/>
    <rect x="33" y="22" width="4" height="8" rx="2" fill="#ff4500"/>
    <path d="M18 24h12" stroke="#00ffff" stroke-width="2"/>
  </svg>`,

  'handbrake.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#9b2226"/>
    <circle cx="24" cy="24" r="12" fill="#ee9b00"/>
    <path d="M21 17v14l10-7z" fill="#ffffff"/>
  </svg>`,

  'foobar2000.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#2b2d42"/>
    <circle cx="24" cy="24" r="12" fill="#ffffff"/>
    <circle cx="20" cy="22" r="2.5" fill="#2b2d42"/>
    <circle cx="28" cy="22" r="2.5" fill="#2b2d42"/>
    <ellipse cx="24" cy="28" rx="3" ry="2" fill="#8d99ae"/>
  </svg>`,

  'sharex.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#1e222d"/>
    <path d="M16 16l16 16" stroke="#4dabf7" stroke-width="4" stroke-linecap="round"/>
    <path d="M32 16l-16 16" stroke="#51cf66" stroke-width="4" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="3" fill="#ff922b"/>
  </svg>`,

  'inkscape.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#000000"/>
    <path d="M24 12l10 14-6 2 4 8-16-10 6-2z" fill="#ffffff"/>
  </svg>`,

  'krita.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#303036"/>
    <circle cx="24" cy="24" r="12" fill="#00b4d8"/>
    <path d="M24 16c-4 0-6 4-6 7s6 9 6 9 6-6 6-9-2-7-6-7z" fill="#f72585"/>
  </svg>`,

  'faststone.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#b5179e"/>
    <rect x="14" y="14" width="20" height="20" rx="3" fill="#ffffff"/>
    <circle cx="20" cy="20" r="2.5" fill="#f72585"/>
    <path d="M14 28l5-5 5 4 4-3 6 5v1h-20z" fill="#4361ee"/>
  </svg>`,

  'telegram.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#24A1DE"/>
    <path d="M35 14L13 22.5l6 4.5 9.5-6.5-7.5 7.5 1 5.5 4.5-4 5.5 4z" fill="#ffffff"/>
  </svg>`,

  'zoom.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#2D8CFF"/>
    <rect x="13" y="17" width="14" height="14" rx="3" fill="#ffffff"/>
    <path d="M28 21l7-4v14l-7-4z" fill="#ffffff"/>
  </svg>`,

  'thunderbird.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#0A84FF"/>
    <circle cx="24" cy="24" r="12" fill="#ffffff"/>
    <path d="M17 21c3-4 11-4 14 0l-7 10z" fill="#0A84FF"/>
  </svg>`,

  'teamviewer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#0E80D8"/>
    <circle cx="24" cy="24" r="12" fill="#ffffff"/>
    <path d="M18 24h12m-6-6l6 6-6 6" stroke="#0E80D8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'bitwarden.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#175DDC"/>
    <path d="M24 12c-5 0-9 4-9 9v4c0 7 9 11 9 11s9-4 9-11v-4c0-5-4-9-9-9z" fill="#ffffff"/>
    <path d="M24 16c-3 0-5 2-5 5v4c0 4 5 7 5 7s5-3 5-7v-4c0-3-2-5-5-5z" fill="#175DDC"/>
  </svg>`,

  'keepassxc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#64A338"/>
    <circle cx="24" cy="24" r="12" fill="#ffffff"/>
    <circle cx="22" cy="22" r="4" stroke="#64A338" stroke-width="2" fill="none"/>
    <path d="M25 25l7 7m-3-1l2 2m-3-1l2 2" stroke="#64A338" stroke-width="2"/>
  </svg>`,

  'malwarebytes.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#00539B"/>
    <path d="M15 32V16l9 9 9-9v16" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'qbittorrent.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#2F679B"/>
    <circle cx="24" cy="24" r="13" fill="#ffffff"/>
    <text x="21" y="29" font-size="14" font-family="sans-serif" font-weight="bold" fill="#2F679B">q</text>
    <text x="27" y="29" font-size="14" font-family="sans-serif" font-weight="bold" fill="#5294E2">B</text>
  </svg>`,

  'transmission.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#AC2A2C"/>
    <circle cx="24" cy="24" r="12" fill="#ffffff"/>
    <path d="M24 16v12m-5-5l5 5 5-5" stroke="#AC2A2C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'winscp.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#003366"/>
    <path d="M14 18l10-6 10 6v12l-10 6-10-6z" stroke="#FFCC00" stroke-width="2.5" fill="none"/>
    <path d="M20 22l8 4m0-4l-8 4" stroke="#ffffff" stroke-width="2"/>
  </svg>`,

  'putty.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#000080"/>
    <rect x="13" y="15" width="22" height="18" rx="2" fill="#ffffff"/>
    <path d="M17 21l4 3-4 3m6 0h4" stroke="#000080" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`,

  'epicgames.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#121212"/>
    <path d="M14 14l10-4 10 4v14l-10 10-10-10z" fill="#ffffff"/>
    <path d="M18 18h12v3H21v3h8v3h-8v4h9v3H18z" fill="#121212"/>
  </svg>`,

  'postman.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#FF6C37"/>
    <circle cx="24" cy="24" r="13" fill="#ffffff"/>
    <path d="M20 21l8 3-8 3z" fill="#FF6C37"/>
  </svg>`,

  'docker.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#0db7ed"/>
    <path d="M12 28c3 4 8 5 15 4 6-1 9-5 9-9 0-4-3-6-3-6s-2 2-3 2c-1 0-2-1-2-1s1 3 0 4c-3 0-5 0-9 2-3 1-5 2-7 4z" fill="#ffffff"/>
    <rect x="14" y="21" width="3" height="3" fill="#ffffff"/>
    <rect x="18" y="21" width="3" height="3" fill="#ffffff"/>
    <rect x="22" y="21" width="3" height="3" fill="#ffffff"/>
    <rect x="18" y="17" width="3" height="3" fill="#ffffff"/>
  </svg>`,

  'dbeaver.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="8" fill="#38220f"/>
    <ellipse cx="24" cy="24" rx="12" ry="10" fill="#a47148"/>
    <circle cx="20" cy="22" r="1.5" fill="#ffffff"/>
    <circle cx="28" cy="22" r="1.5" fill="#ffffff"/>
    <ellipse cx="24" cy="27" rx="3" ry="2" fill="#ffffff"/>
  </svg>`
};

for (const [filename, content] of Object.entries(icons)) {
  fs.writeFileSync(path.join(iconsDir, filename), content.trim());
  console.log(`Saved ${filename}`);
}

console.log('All icons generated successfully!');
