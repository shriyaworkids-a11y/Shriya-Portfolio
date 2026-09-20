Add-Type -AssemblyName System.Drawing

$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"
$rawImg = [System.Drawing.Image]::FromFile($rawPath)

# Raw image is 1836 x 3264.
# Crop range: Y = 800, Height = 1550 (captures more height = zoomed out nicely)
$cropY = 800
$cropH = 1550
$cropW = 1836

$targetW = 2750
$targetH = 1550

$bmp = New-Object System.Drawing.Bitmap $targetW, $targetH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$shiftX = $targetW - $cropW # 914px

# 1. Fill base dark tone
$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 20, 22, 26))
$g.FillRectangle($bgBrush, 0, 0, $targetW, $targetH)
$bgBrush.Dispose()

# 2. Left extension: draw window reflections & pillar from raw photo (x: 0..300) extended smoothly
$leftSrcRect = New-Object System.Drawing.Rectangle 0, $cropY, 320, $cropH
$leftDstRect = New-Object System.Drawing.Rectangle 0, 0, ($shiftX + 120), $targetH
$g.DrawImage($rawImg, $leftDstRect, $leftSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Draw the table counter surface on the bottom left (wooden tone)
$tableBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point 0, ($targetH - 400)),
    (New-Object System.Drawing.Point 0, $targetH),
    [System.Drawing.Color]::FromArgb(255, 110, 68, 42),
    [System.Drawing.Color]::FromArgb(255, 45, 25, 15)
)
$g.FillRectangle($tableBrush, 0, [int]($targetH * 0.68), [int]($shiftX + 80), [int]($targetH * 0.32))
$tableBrush.Dispose()

# 3. Draw main raw image shifted right
$mainSrcRect = New-Object System.Drawing.Rectangle 0, $cropY, $cropW, $cropH
$mainDstRect = New-Object System.Drawing.Rectangle $shiftX, 0, $cropW, $targetH
$g.DrawImage($rawImg, $mainDstRect, $mainSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()

# 4. Scale down to 1920 x 1080 (16:9 standard)
$finalBmp = New-Object System.Drawing.Bitmap 1920, 1080
$gFinal = [System.Drawing.Graphics]::FromImage($finalBmp)
$gFinal.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFinal.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gFinal.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gFinal.DrawImage($bmp, (New-Object System.Drawing.Rectangle 0, 0, 1920, 1080), (New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH), [System.Drawing.GraphicsUnit]::Pixel)
$gFinal.Dispose()
$bmp.Dispose()

$outputPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg"
$finalBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$finalBmp.Dispose()
$rawImg.Dispose()

Write-Host "Generated clean zoomed-out hero-shriya-desktop.jpg placed on the right!"
