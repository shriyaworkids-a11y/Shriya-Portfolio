Add-Type -AssemblyName System.Drawing

$inputPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg"
$outputPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg"

$src = [System.Drawing.Bitmap]::FromFile($inputPath)

# Target resolution: 1800 x 768
$targetW = 1800
$targetH = 768
$bmp = New-Object System.Drawing.Bitmap $targetW, $targetH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$shiftX = $targetW - $src.Width # 424px

# In original, x: 0..450 has the window, potted palm, lanterns and wooden counter.
# We will create an extended left section by taking x: 0..450, flipping it horizontally or cloning the ambient cafe lighting/window,
# and applying a smooth 150px alpha blend into the original at shiftX.

# 1. Base fill with the ambient window/counter tone
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 20, 22, 28))
$g.FillRectangle($brush, 0, 0, $targetW, $targetH)
$brush.Dispose()

# 2. Draw the extended left region (from original x: 0..480)
$leftSrc = New-Object System.Drawing.Rectangle 0, 0, 480, $src.Height
$leftDst = New-Object System.Drawing.Rectangle 0, 0, ($shiftX + 150), $targetH
$g.DrawImage($src, $leftDst, $leftSrc, [System.Drawing.GraphicsUnit]::Pixel)

# 3. Draw the original image with Shriya at shiftX..targetW
# To make the transition seamless without a hard edge, we draw the original image onto a temporary bitmap with an alpha mask on its left edge (0..150px)
$tempMain = New-Object System.Drawing.Bitmap $src.Width, $src.Height
$gTemp = [System.Drawing.Graphics]::FromImage($tempMain)
$gTemp.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gTemp.DrawImage($src, 0, 0, $src.Width, $src.Height)
$gTemp.Dispose()

# Now alpha blend the left 140 pixels of tempMain
for ($x = 0; $x -lt 140; $x++) {
    $alpha = [float]($x / 140.0)
    for ($y = 0; $y -lt $src.Height; $y++) {
        $c = $tempMain.GetPixel($x, $y)
        $newA = [int]($c.A * $alpha)
        $tempMain.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $c.R, $c.G, $c.B))
    }
}

# Draw tempMain onto dst
$g.DrawImage($tempMain, $shiftX, 0, $src.Width, $src.Height)
$tempMain.Dispose()

$g.Dispose()
$src.Dispose()

$backupPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop-orig.jpg"
if (-not (Test-Path $backupPath)) {
    Copy-Item $inputPath $backupPath
}

$bmp.Save("D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop-new.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

Copy-Item "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop-new.jpg" $inputPath -Force
Write-Output "Successfully generated seamless wide hero desktop image!"
