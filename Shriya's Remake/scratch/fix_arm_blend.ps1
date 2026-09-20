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

# 1. Draw continuous background across the entire canvas
$g.DrawImage($bg, (New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH), (New-Object System.Drawing.Rectangle 0, 0, $bg.Width, $bg.Height), [System.Drawing.GraphicsUnit]::Pixel)

# 2. Extract Shriya with plenty of margin to the left of her elbow!
# Raw is 1836 x 3264.
# Her elbow is at X ≈ 680.
# We start the crop at X = 280 (400px to the left of her elbow!)
# Y range: 550 to 2850 (height = 2300)
$rawSrcX = 280
$rawSrcY = 550
$rawSrcW = 1836 - $rawSrcX # 1556px
$rawSrcH = 2300

$rawSrcRect = New-Object System.Drawing.Rectangle $rawSrcX, $rawSrcY, $rawSrcW, $rawSrcH

# Scale to fit right side:
# Width: 950px, Height: 1404px
$dstW = 950
$dstH = [int]($dstW * ($rawSrcH / [float]$rawSrcW)) # 1404px
$dstX = $targetW - $dstW                           # 970px
$dstY = 20

# In this 950px section:
# The crop starts at X=280 in raw (which maps to X=0 in rawSection).
# Her elbow is at X=680 in raw (which maps to (680-280)/1556 * 950 = 244px from the left of rawSection!).
# So the blend zone (0..80px) is FAR away from her elbow (244px)!
# Her entire elbow, arm, sleeve, wrist, hand, cardigan, and body are 100% solid and unblended!

$rawSection = New-Object System.Drawing.Bitmap $dstW, $dstH
$gSec = [System.Drawing.Graphics]::FromImage($rawSection)
$gSec.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gSec.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gSec.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gSec.DrawImage($raw, (New-Object System.Drawing.Rectangle 0, 0, $dstW, $dstH), $rawSrcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gSec.Dispose()

# Soft alpha blend only on the first 70px (which is pure counter/window, far to the left of her arm)
$blendWidth = 70
for ($x = 0; $x -lt $blendWidth; $x++) {
    $alpha = [float]($x / [float]$blendWidth)
    # Use smooth hermite curve for silky transition
    $smoothAlpha = $alpha * $alpha * (3.0 - 2.0 * $alpha)
    for ($y = 0; $y -lt $dstH; $y++) {
        $c = $rawSection.GetPixel($x, $y)
        $newA = [int]($c.A * $smoothAlpha)
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

Write-Host "Successfully fixed arm blend! Arm is now 100% solid, crisp, and fully opaque."
