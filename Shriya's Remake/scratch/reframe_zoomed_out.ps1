Add-Type -AssemblyName System.Drawing

$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"
$rawImg = [System.Drawing.Image]::FromFile($rawPath)

# We want:
# 1. More zoomed out: capture larger vertical range from raw photo (e.g. Y: 850 to 2300, height = 1450)
# 2. Placed more to the right: canvas width 2800, raw photo shifted to the far right.
# 3. Seamless left extension from the raw window & counter.

$cropY = 850
$cropH = 1450
$cropW = 1836 # full width of raw photo

$targetW = 2800
$targetH = 1450

$bmp = New-Object System.Drawing.Bitmap $targetW, $targetH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$shiftX = $targetW - $cropW # 2800 - 1836 = 964px

# 1. Fill base tone
$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 18, 20, 25))
$g.FillRectangle($bgBrush, 0, 0, $targetW, $targetH)
$bgBrush.Dispose()

# 2. Draw extended left window area from raw image (x: 0..600, y: cropY..cropY+cropH)
$leftSrcRect = New-Object System.Drawing.Rectangle 0, $cropY, 600, $cropH
$leftDstRect = New-Object System.Drawing.Rectangle 0, 0, ($shiftX + 150), $targetH
$g.DrawImage($rawImg, $leftDstRect, $leftSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

# 3. Prepare raw photo with smooth alpha blend on its left edge (0..160px)
$tempMain = New-Object System.Drawing.Bitmap $cropW, $cropH
$gTemp = [System.Drawing.Graphics]::FromImage($tempMain)
$gTemp.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$rawSrcRect = New-Object System.Drawing.Rectangle 0, $cropY, $cropW, $cropH
$gTemp.DrawImage($rawImg, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), $rawSrcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gTemp.Dispose()

# Alpha blend left 160px
for ($x = 0; $x -lt 160; $x++) {
    $alpha = [float]($x / 160.0)
    for ($y = 0; $y -lt $cropH; $y++) {
        $c = $tempMain.GetPixel($x, $y)
        $newA = [int]($c.A * $alpha)
        $tempMain.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $c.R, $c.G, $c.B))
    }
}

$g.DrawImage($tempMain, $shiftX, 0, $cropW, $targetH)
$tempMain.Dispose()
$g.Dispose()

# Now scale down to standard 16:9 desktop format: 2000 x 1125 (or 1920 x 1080)
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
Write-Host "Generated hero-shriya-desktop.jpg with zoomed out framing and placed more to the right!"
