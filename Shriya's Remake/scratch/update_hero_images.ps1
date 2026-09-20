Add-Type -AssemblyName System.Drawing

$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"
$rawImg = [System.Drawing.Image]::FromFile($rawPath)

# Desktop: Save hero-raw-wide-b.jpg as images/shriya/hero-shriya-desktop.jpg
Copy-Item "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-raw-wide-b.jpg" "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg" -Force

# Mobile: Crop from raw image directly (upper-to-mid body with Shriya centered/framed nicely)
# Raw image is 1836 x 3264.
# A 9:16 mobile crop: width = 1836, height = 3264 (the entire raw image is already 9:16!)
$bmpMob = New-Object System.Drawing.Bitmap 1080, 1920
$gMob = [System.Drawing.Graphics]::FromImage($bmpMob)
$gMob.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gMob.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gMob.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Focus on upper body (y: 600..3000)
$mobSrcRect = New-Object System.Drawing.Rectangle 0, 600, 1836, 2600
$mobDstRect = New-Object System.Drawing.Rectangle 0, 0, 1080, 1920
$gMob.DrawImage($rawImg, $mobDstRect, $mobSrcRect, [System.Drawing.GraphicsUnit]::Pixel)
$gMob.Dispose()

$bmpMob.Save("D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-mobile.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpMob.Dispose()
$rawImg.Dispose()

Write-Host "Updated both desktop and mobile hero images with 100% exact raw Cafe Image.jfif!"
