Add-Type -AssemblyName System.Drawing

$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"
$rawImg = [System.Drawing.Image]::FromFile($rawPath)

Write-Host "Raw image size: $($rawImg.Width) x $($rawImg.Height)"

# Let's create two direct crops:
# Crop A: 16:9 crop centered around Shriya's upper body and the cafe table
# Top = 1050, Height = 1032 (1836 / (16/9) = 1032)
$cropA_rect = New-Object System.Drawing.Rectangle 0, 1050, 1836, 1032
$bmpA = New-Object System.Drawing.Bitmap 1836, 1032
$gA = [System.Drawing.Graphics]::FromImage($bmpA)
$gA.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gA.DrawImage($rawImg, (New-Object System.Drawing.Rectangle 0, 0, 1836, 1032), $cropA_rect, [System.Drawing.GraphicsUnit]::Pixel)
$gA.Dispose()
$bmpA.Save("D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-raw-crop-a.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpA.Dispose()

# Crop B: Wide canvas (2400 x 1032) where the raw photo is placed on the right,
# and the left cafe window/table from the raw photo is extended seamlessly on the left
$targetW = 2400
$targetH = 1032
$bmpB = New-Object System.Drawing.Bitmap $targetW, $targetH
$gB = [System.Drawing.Graphics]::FromImage($bmpB)
$gB.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gB.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$shiftX = $targetW - 1836 # 564px

# Left extension from raw photo's left window area (x: 0..500, y: 1050..2082)
$leftSrcRect = New-Object System.Drawing.Rectangle 0, 1050, 500, 1032
$leftDstRect = New-Object System.Drawing.Rectangle 0, 0, ($shiftX + 100), $targetH
$gB.DrawImage($rawImg, $leftDstRect, $leftSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Right main raw photo (x: 0..1836, y: 1050..2082) placed directly at shiftX
$mainSrcRect = New-Object System.Drawing.Rectangle 0, 1050, 1836, 1032
$mainDstRect = New-Object System.Drawing.Rectangle $shiftX, 0, 1836, $targetH

# Create temp for raw photo with soft left edge blend
$tempMain = New-Object System.Drawing.Bitmap 1836, 1032
$gTemp = [System.Drawing.Graphics]::FromImage($tempMain)
$gTemp.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gTemp.DrawImage($rawImg, (New-Object System.Drawing.Rectangle 0, 0, 1836, 1032), $mainSrcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gTemp.Dispose()

for ($x = 0; $x -lt 120; $x++) {
    $alpha = [float]($x / 120.0)
    for ($y = 0; $y -lt 1032; $y++) {
        $c = $tempMain.GetPixel($x, $y)
        $newA = [int]($c.A * $alpha)
        $tempMain.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($newA, $c.R, $c.G, $c.B))
    }
}

$gB.DrawImage($tempMain, $shiftX, 0, 1836, $targetH)
$tempMain.Dispose()
$gB.Dispose()

$bmpB.Save("D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-raw-wide-b.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpB.Dispose()

$rawImg.Dispose()
Write-Host "Created crop A and wide crop B from exact raw Cafe Image.jfif!"
