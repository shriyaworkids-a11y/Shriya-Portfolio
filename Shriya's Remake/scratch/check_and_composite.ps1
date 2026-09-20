Add-Type -AssemblyName System.Drawing

$extendedPath = "C:\Users\Asus\.gemini\antigravity-ide\brain\acf02474-b62d-4f99-ba1c-97e49b77df56\cafe_extended_bg_1789833790614.jpg"
$rawPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\Shriya's Pics\Cafe Image.jfif"

$extImg = [System.Drawing.Image]::FromFile($extendedPath)
$rawImg = [System.Drawing.Image]::FromFile($rawPath)

Write-Host "Extended image: $($extImg.Width) x $($extImg.Height)"
Write-Host "Raw image: $($rawImg.Width) x $($rawImg.Height)"

# Let's save a copy directly to hero-shriya-desktop.jpg
$outputPath = "D:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\hero-shriya-desktop.jpg"
$extImg.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$extImg.Dispose()
$rawImg.Dispose()

Write-Host "Copied continuous cafe image to $outputPath"
