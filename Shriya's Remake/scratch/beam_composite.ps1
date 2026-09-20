Add-Type -AssemblyName System.Drawing

$bgPath = "C:\Users\Asus\.gemini\antigravity-ide\brain\acf02474-b62d-4f99-ba1c-97e49b77df56\cafe_extended_bg_1789833790614.jpg"
$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"

$bgBytes = [System.IO.File]::ReadAllBytes($bgPath)
$bgMs = New-Object System.IO.MemoryStream(,$bgBytes)
$bg = [System.Drawing.Image]::FromStream($bgMs)

$rawBytes = [System.IO.File]::ReadAllBytes($rawPath)
$rawMs = New-Object System.IO.MemoryStream(,$rawBytes)
$raw = [System.Drawing.Image]::FromStream($rawMs)

# Target resolution: 1920 x 1080
$targetW = 1920
$targetH = 1080

$finalBmp = New-Object System.Drawing.Bitmap $targetW, $targetH
$g = [System.Drawing.Graphics]::FromImage($finalBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# 1. Draw the extended cafe background across the canvas
$g.DrawImage($bg, (New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH), (New-Object System.Drawing.Rectangle 0, 0, $bg.Width, $bg.Height), [System.Drawing.GraphicsUnit]::Pixel)

# 2. Extract Shriya's entire right section from RAW Cafe Image.jfif:
# In $raw (1836 x 3264):
# X: 580 to 1836 (width: 1256)
# Y: 700 to 2900 (height: 2200)
$rawSrcRect = New-Object System.Drawing.Rectangle 580, 700, 1256, 2200

# We place this onto the right side of the 1920x1080 canvas:
# Width in 1080 height: 1080 * (1256 / 2200) = 616px
# X position: 1920 - 616 = 1304 (or shifted to align with the vertical black beam around X = 1200..1300)
# Let's scale and position so Shriya aligns naturally:
$dstW = [int](1080.0 * (1256.0 / 2200.0) * 1.35) # approx 830px
$dstH = [int](1080.0 * 1.35)                     # approx 1458px
$dstX = $targetW - $dstW                         # 1920 - 830 = 1090
$dstY = -60

$rawDstRect = New-Object System.Drawing.Rectangle $dstX, $dstY, $dstW, $dstH

# Create raw section with vertical black beam edge
$rawSection = New-Object System.Drawing.Bitmap $dstW, $dstH
$gSec = [System.Drawing.Graphics]::FromImage($rawSection)
$gSec.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gSec.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gSec.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gSec.DrawImage($raw, (New-Object System.Drawing.Rectangle 0, 0, $dstW, $dstH), $rawSrcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gSec.Dispose()

# Soft alpha blend on the left 40px along the black vertical beam
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

Write-Host "Created seamless authentic raw hero image at $outputPath!"
