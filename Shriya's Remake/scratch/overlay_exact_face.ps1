Add-Type -AssemblyName System.Drawing

$bgPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg"
$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"

$bg = [System.Drawing.Bitmap]::FromFile($bgPath)
$raw = [System.Drawing.Bitmap]::FromFile($rawPath)

# In $bg (1376 x 768):
# Shriya's head top is around y = 330, chin around y = 430 (height ~100px), center x ≈ 1080 (78.5%)
# In $raw (1836 x 3264):
# Shriya's head top is around y = 1250, chin around y = 1600 (height ~350px), center x ≈ 1050
# Let's crop her head/face from raw:
$headSrcRect = New-Object System.Drawing.Rectangle 800, 1150, 500, 550
$headDstRect = New-Object System.Drawing.Rectangle 1005, 305, 150, 165

# Create a feathered head bitmap
$headBmp = New-Object System.Drawing.Bitmap 150, 165
$gHead = [System.Drawing.Graphics]::FromImage($headBmp)
$gHead.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gHead.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gHead.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gHead.DrawImage($raw, (New-Object System.Drawing.Rectangle 0, 0, 150, 165), $headSrcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gHead.Dispose()

# Feather edges of headBmp
$w = 150
$h = 165
$cx = $w / 2.0
$cy = $h / 2.0
$rx = $w / 2.0 - 5
$ry = $h / 2.0 - 5

for ($x = 0; $x -lt $w; $x++) {
    for ($y = 0; $y -lt $h; $y++) {
        $dx = ($x - $cx) / $rx
        $dy = ($y - $cy) / $ry
        $dist = [Math]::Sqrt($dx*$dx + $dy*$dy)
        if ($dist -gt 1.0) {
            $headBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($dist -gt 0.7) {
            $c = $headBmp.GetPixel($x, $y)
            $factor = 1.0 - (($dist - 0.7) / 0.3)
            $newA = [int]($c.A * $factor)
            $headBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $c.R, $c.G, $c.B))
        }
    }
}

$gBg = [System.Drawing.Graphics]::FromImage($bg)
$gBg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gBg.DrawImage($headBmp, $headDstRect)
$gBg.Dispose()

$headBmp.Dispose()
$raw.Dispose()

$bg.Save("D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop-exact.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bg.Dispose()

Write-Host "Created hero-shriya-desktop-exact.jpg with 100% exact raw face overlay!"
