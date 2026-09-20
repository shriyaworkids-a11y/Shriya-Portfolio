Add-Type -AssemblyName System.Drawing

$srcPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Side Image.jfif"
$outDir = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $src.Width
$h = $src.Height
Write-Output "Source image: $w x $h"

# Crop focused on upper body / face:
# In 1536 x 2048, head is roughly at x=400..900, y=180..800
# Upper body crop:
$cropSize = 900
$cropX = [Math]::Max(0, [int](($w - $cropSize) / 2) - 50)
$cropY = 150

$avatar = New-Object System.Drawing.Bitmap(600, 600, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($avatar)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSize, $cropSize)
$destRect = New-Object System.Drawing.Rectangle(0, 0, 600, 600)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

# Save avatar images
$avatar.Save((Join-Path $outDir "footer-normal.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$avatar.Save((Join-Path $outDir "shriya-side-avatar.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Also update footer frames 1..9 with the same image so no other image flashes on hover
for ($i = 1; $i -le 9; $i++) {
    $avatar.Save((Join-Path $outDir "footer-frame-$i.jpg"), [System.Drawing.Imaging.ImageFormat]::Jpeg)
}

$avatar.Dispose()
$src.Dispose()

Write-Output "Avatar images successfully created from Side Image.jfif!"
