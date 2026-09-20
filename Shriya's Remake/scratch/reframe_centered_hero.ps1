Add-Type -AssemblyName System.Drawing

$bgPath = "C:\Users\Asus\.gemini\antigravity-ide\brain\acf02474-b62d-4f99-ba1c-97e49b77df56\cafe_extended_bg_1789833790614.jpg"
$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"

$bgBytes = [System.IO.File]::ReadAllBytes($bgPath)
$bgMs = New-Object System.IO.MemoryStream(,$bgBytes)
$bg = [System.Drawing.Image]::FromStream($bgMs)

$rawBytes = [System.IO.File]::ReadAllBytes($rawPath)
$rawMs = New-Object System.IO.MemoryStream(,$rawBytes)
$raw = [System.Drawing.Image]::FromStream($rawMs)

$targetW = 1920
$targetH = 1080

$finalBmp = New-Object System.Drawing.Bitmap $targetW, $targetH
$g = [System.Drawing.Graphics]::FromImage($finalBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# 1. Draw continuous background across full width
$g.DrawImage($bg, (New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH), (New-Object System.Drawing.Rectangle 0, 0, $bg.Width, $bg.Height), [System.Drawing.GraphicsUnit]::Pixel)

# 2. Extract Shriya from RAW Cafe Image.jfif:
# Raw is 1836 x 3264.
# Crop Shriya with plant, counter, door, hair, cardigan:
# X: 580 to 1836 (width: 1256)
# Y: 700 to 2900 (height: 2200)
$rawSrcRect = New-Object System.Drawing.Rectangle 580, 700, 1256, 2200

# Place her on the right so her head center is at X ≈ 1580px (82.3% of 1920):
# Width: 760px, Height: 1330px, positioned at X = 1920 - 760 = 1160, Y = -50
$dstW = 760
$dstH = 1330
$dstX = $targetW - $dstW  # 1160
$dstY = -50

$rawSection = New-Object System.Drawing.Bitmap $dstW, $dstH
$gSec = [System.Drawing.Graphics]::FromImage($rawSection)
$gSec.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gSec.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gSec.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gSec.DrawImage($raw, (New-Object System.Drawing.Rectangle 0, 0, $dstW, $dstH), $rawSrcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gSec.Dispose()

# Alpha blend left 40px along the vertical window beam
for ($x = 0; $x -lt 40; $x++) {
    $alpha = [float]($x / 40.0)
    for ($y = 0; $y -lt $dstH; $y++) {
        $c = $rawSection.GetPixel($x, $y)
        $newA = [int]($c.A * $alpha)
        $rawSection.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $c.R, $c.G, $c.B))
    }
}

$g.DrawImage($rawSection, $dstX, $dstY)
$rawSection.Dispose()
$g.Dispose()

$outputPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg"
$finalBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$finalBmp.Dispose()

$bg.Dispose()
$bgMs.Dispose()
$raw.Dispose()
$rawMs.Dispose()

Write-Host "Created hero image with Shriya positioned at right (~82.5%) for centered SHRIYA.S text!"
