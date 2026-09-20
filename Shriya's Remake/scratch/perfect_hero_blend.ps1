Add-Type -AssemblyName System.Drawing

$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"
$rawImg = [System.Drawing.Image]::FromFile($rawPath)

# 1. Crop raw photo: zoomed out slightly (capturing Y: 750 to 2400)
$cropY = 750
$cropH = 1650
$cropW = 1836

$targetW = 2700
$targetH = 1650

$bmp = New-Object System.Drawing.Bitmap $targetW, $targetH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$shiftX = $targetW - $cropW # 864px

# Draw left window/pillar with horizontal stretch and mirroring for natural perspective
# We stretch the leftmost 350px of the raw image to fill 0..shiftX+100
$leftSrcRect = New-Object System.Drawing.Rectangle 0, $cropY, 320, $cropH
$leftDstRect = New-Object System.Drawing.Rectangle 0, 0, ($shiftX + 150), $targetH
$g.DrawImage($rawImg, $leftDstRect, $leftSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Draw main raw photo at shiftX
$mainSrcRect = New-Object System.Drawing.Rectangle 0, $cropY, $cropW, $cropH
$mainDstRect = New-Object System.Drawing.Rectangle $shiftX, 0, $cropW, $targetH

# Create soft alpha blend across the seam zone (shiftX to shiftX + 180)
# We draw the main image
$g.DrawImage($rawImg, $mainDstRect, $mainSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Now apply a subtle dark vignette / ambient gradient on the far left edge (0..400px)
# to blend seamlessly with the dark page design
$vignetteBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point 0, 0),
    (New-Object System.Drawing.Point ($shiftX + 50), 0),
    [System.Drawing.Color]::FromArgb(180, 10, 10, 12),
    [System.Drawing.Color]::FromArgb(0, 10, 10, 12)
)
$g.FillRectangle($vignetteBrush, 0, 0, ($shiftX + 50), $targetH)
$vignetteBrush.Dispose()

$g.Dispose()

# Final output 1920x1080
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

Write-Host "Generated perfect hero desktop blend!"
