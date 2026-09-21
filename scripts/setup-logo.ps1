Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\USER\.gemini\antigravity\brain\032aaa05-964f-4eee-a23a-a203c7dd4210\.user_uploaded\media_1789957519670.jpg"
$destDir = "d:\PROYECTOS\ReinstallHub\public\icons"
$buildDir = "d:\PROYECTOS\ReinstallHub\build"

if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}
if (!(Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir -Force | Out-Null
}

$srcImage = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source image loaded: $($srcImage.Width) x $($srcImage.Height)"

# 1. Save original full-res as logo.png and icon.png
$destPng = Join-Path $destDir "logo.png"
$iconPng = Join-Path $destDir "icon.png"
$buildPng = Join-Path $buildDir "icon.png"

$srcImage.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)
$srcImage.Save($iconPng, [System.Drawing.Imaging.ImageFormat]::Png)
$srcImage.Save($buildPng, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Saved high-res PNG to $destPng and $iconPng"

# 2. Generate multi-resolution ICO file
# Sizes: 256, 128, 64, 48, 32, 16
$sizes = @(256, 128, 64, 48, 32, 16)
$bitmaps = @()

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $sz, $sz
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImage, 0, 0, $sz, $sz)
    $g.Dispose()
    $bitmaps += $bmp
}

# Helper to write standard Windows ICO file format
function Save-IcoFile($bitmapArray, $outputPath) {
    $ms = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter $ms

    # ICONDIR header: Reserved (2 bytes = 0), Type (2 bytes = 1 for icon), Count (2 bytes)
    $bw.Write([UInt16]0)
    $bw.Write([UInt16]1)
    $bw.Write([UInt16]$bitmapArray.Count)

    $pngBuffers = @()
    foreach ($b in $bitmapArray) {
        $pms = New-Object System.IO.MemoryStream
        $b.Save($pms, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngBuffers += ,$pms.ToArray()
        $pms.Dispose()
    }

    # Offset to image data: header (6 bytes) + entries (16 bytes each)
    $dataOffset = 6 + (16 * $bitmapArray.Count)

    for ($i = 0; $i -lt $bitmapArray.Count; $i++) {
        $b = $bitmapArray[$i]
        $pngBytes = $pngBuffers[$i]
        
        $width = if ($b.Width -ge 256) { [byte]0 } else { [byte]$b.Width }
        $height = if ($b.Height -ge 256) { [byte]0 } else { [byte]$b.Height }

        $bw.Write($width)           # bWidth
        $bw.Write($height)          # bHeight
        $bw.Write([byte]0)          # bColorCount
        $bw.Write([byte]0)          # bReserved
        $bw.Write([UInt16]1)        # wPlanes
        $bw.Write([UInt16]32)       # wBitCount
        $bw.Write([UInt32]$pngBytes.Length) # dwBytesInRes
        $bw.Write([UInt32]$dataOffset)       # dwImageOffset

        $dataOffset += $pngBytes.Length
    }

    foreach ($pngBytes in $pngBuffers) {
        $bw.Write($pngBytes)
    }

    $bw.Flush()
    [System.IO.File]::WriteAllBytes($outputPath, $ms.ToArray())
    $bw.Dispose()
    $ms.Dispose()
}

$destIco = Join-Path $destDir "icon.ico"
$buildIco = Join-Path $buildDir "icon.ico"
Save-IcoFile $bitmaps $destIco
Save-IcoFile $bitmaps $buildIco

Write-Host "Generated multi-res ICO files at $destIco and $buildIco"

# Cleanup
foreach ($b in $bitmaps) {
    $b.Dispose()
}
$srcImage.Dispose()

Write-Host "Logo and icon processing completed successfully."
