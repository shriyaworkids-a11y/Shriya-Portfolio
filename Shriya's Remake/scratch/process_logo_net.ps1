Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\Asus\.gemini\antigravity-ide\brain\acf02474-b62d-4f99-ba1c-97e49b77df56\.user_uploaded\media_1789929159096.jpg"
$outDir = "d:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$w = $bmp.Width
$h = $bmp.Height

# 1. Find bounding box
$minX = $w; $maxX = 0; $minY = $h; $maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 130 -and $c.G -gt 130 -and $c.B -gt 130) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$pad = 6
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX + 1) + ($pad * 2))
$cropH = [Math]::Min($h - $cropY, ($maxY - $minY + 1) + ($pad * 2))

Write-Output "Cropped area: $cropW x $cropH (from $cropX, $cropY)"

# 2. Create Transparent White PNG
$whitePng = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$blackPng = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# 2D boolean grid for contour tracing
$grid = New-Object 'bool[,]' $cropW, $cropH

for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $srcX = $cropX + $x
        $srcY = $cropY + $y
        if ($srcX -lt $w -and $srcY -lt $h) {
            $c = $bmp.GetPixel($srcX, $srcY)
            $brightness = ($c.R + $c.G + $c.B) / 3.0
            if ($brightness -gt 130) {
                # Smooth alpha based on edge
                $alpha = [int][Math]::Min(255, [Math]::Max(0, ($brightness - 100) * (255.0 / 120.0)))
                $whitePng.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
                $blackPng.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 18, 18, 18))
                $grid[$x, $y] = $true
            } else {
                $whitePng.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                $blackPng.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                $grid[$x, $y] = $false
            }
        }
    }
}

$bmp.Dispose()

# Save PNGs
$whitePng.Save((Join-Path $outDir "shriya-butterfly-logo-cropped.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$whitePng.Save((Join-Path $outDir "shriya-butterfly-white.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$blackPng.Save((Join-Path $outDir "shriya-butterfly-black.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$whitePng.Dispose()
$blackPng.Dispose()

Write-Output "PNGs successfully saved to $outDir"
