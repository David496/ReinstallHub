const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, '../public/icons/logo.png');
const svgPath = path.join(__dirname, '../public/icons/icon.svg');

if (fs.existsSync(pngPath)) {
  const b64 = fs.readFileSync(pngPath).toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <clipPath id="rounded-clip">
      <rect width="512" height="512" rx="90" ry="90" />
    </clipPath>
  </defs>
  <image href="data:image/png;base64,${b64}" width="512" height="512" clip-path="url(#rounded-clip)" />
</svg>
`;
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log('Successfully updated public/icons/icon.svg with embedded logo.');
} else {
  console.error('logo.png not found at ' + pngPath);
}
