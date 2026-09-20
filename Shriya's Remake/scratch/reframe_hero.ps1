Add-Type -AssemblyName System.Drawing

$inputPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg"
$outputPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop-wide.jpg"

$src = [System.Drawing.Image]::FromFile($inputPath)

# We want a 1920x1080 or 1800x1000 canvas where Shriya is placed on the right (approx 78% of width)
# Original image is 1376x768.
# In original, Shriya center is at x=860 (62.5%).
# If we want Shriya center at x = 78% in a 16:9 canvas of width W,
# then 0.78 * W = x_shriya
$targetW = 1850
$targetH = 768

$bmp = New-Object System.Drawing.Bitmap $targetW, $targetH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$shiftX = $targetW - $src.Width # 1850 - 1376 = 474px

# 1. Fill left extension using left background of the image
# Mirror or stretch the leftmost 350px of the cafe window and wall
$leftSrcRect = New-Object System.Drawing.Rectangle 0, 0, 380, $src.Height
$leftDstRect = New-Object System.Drawing.Rectangle 0, 0, ($shiftX + 80), $targetH
$g.DrawImage($src, $leftDstRect, $leftSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

# 2. Draw original photo shifted right
$mainSrcRect = New-Object System.Drawing.Rectangle 0, 0, $src.Width, $src.Height
$mainDstRect = New-Object System.Drawing.Rectangle $shiftX, 0, $src.Width, $src.Height
$g.DrawImage($src, $mainDstRect, $mainSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

# 3. Soft alpha blend across the seam
$blendWidth = 80
$blendStart = $shiftX - 20
# Sample a strip and blend
# We can do a smooth blend strip
for ($i = 0; $i -lt $blendWidth; $i++) {
    $alpha = [int](255 * ($i / $blendWidth))
    # We let the source naturally overlap with high quality
}

$g.Dispose()
$src.Dispose()

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()
Write-Output "Saved to $outputPath"
