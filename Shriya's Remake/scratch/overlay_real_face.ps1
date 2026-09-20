Add-Type -AssemblyName System.Drawing

$bgPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg"
$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"

# Load without file locking
$bgBytes = [System.IO.File]::ReadAllBytes($bgPath)
$bgMs = New-Object System.IO.MemoryStream(,$bgBytes)
$bgOrig = [System.Drawing.Image]::FromStream($bgMs)
$bg = New-Object System.Drawing.Bitmap $bgOrig
$bgOrig.Dispose()
$bgMs.Dispose()

$rawBytes = [System.IO.File]::ReadAllBytes($rawPath)
$rawMs = New-Object System.IO.MemoryStream(,$rawBytes)
$rawOrig = [System.Drawing.Image]::FromStream($rawMs)
$raw = New-Object System.Drawing.Bitmap $rawOrig
$rawOrig.Dispose()
$rawMs.Dispose()

# In $raw (1836 x 3264):
# Shriya's face:
# Eye level: Y ~ 1440, Nose: Y ~ 1520, Mouth: Y ~ 1590, Chin: Y ~ 1660
# Left ear / hair: X ~ 860, Right ear / hair: X ~ 1240
# Head rectangle in raw: X = 860, Y = 1200, W = 400, H = 500
$srcX = 860
$srcY = 1200
$srcW = 400
$srcH = 500

# In $bg (1376 x 768):
# Head position: X = 1040, Y = 328, W = 108, H = 135
$dstX = 1040
$dstY = 328
$dstW = 108
$dstH = 135

$patch = New-Object System.Drawing.Bitmap $dstW, $dstH
$gPatch = [System.Drawing.Graphics]::FromImage($patch)
$gPatch.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gPatch.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gPatch.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle $srcX, $srcY, $srcW, $srcH
$dstRect = New-Object System.Drawing.Rectangle 0, 0, $dstW, $dstH
$gPatch.DrawImage($raw, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gPatch.Dispose()

# Soft feathering around edge of face patch
$cx = $dstW / 2.0
$cy = $dstH / 2.0
$rx = $dstW / 2.0 - 3
$ry = $dstH / 2.0 - 3

for ($x = 0; $x -lt $dstW; $x++) {
    for ($y = 0; $y -lt $dstH; $y++) {
        $dx = ($x - $cx) / $rx
        $dy = ($y - $cy) / $ry
        $dist = [Math]::Sqrt($dx*$dx + $dy*$dy)
        if ($dist -gt 1.0) {
            $patch.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($dist -gt 0.70) {
            $c = $patch.GetPixel($x, $y)
            $factor = 1.0 - (($dist - 0.70) / 0.30)
            $newA = [int]($c.A * $factor)
            $patch.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $c.R, $c.G, $c.B))
        }
    }
}

$gBg = [System.Drawing.Graphics]::FromImage($bg)
$gBg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gBg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gBg.DrawImage($patch, $dstX, $dstY)
$gBg.Dispose()

$patch.Dispose()
$raw.Dispose()

# Save final result
$bg.Save($bgPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bg.Dispose()

Write-Host "Successfully saved 100% exact raw face overlay to $bgPath!"
