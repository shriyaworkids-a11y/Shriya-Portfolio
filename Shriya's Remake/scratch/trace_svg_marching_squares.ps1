Add-Type -AssemblyName System.Drawing

$inputPng = "d:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\shriya-butterfly-white.png"
$bmp = [System.Drawing.Bitmap]::FromFile($inputPng)
$w = $bmp.Width
$h = $bmp.Height

Write-Output "Image size: $w x $h"

# Create binary grid
$grid = New-Object 'bool[,]' $w, $h
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        $grid[$x, $y] = ($pixel.A -gt 128)
    }
}
$bmp.Dispose()

# Find boundary contours using Moore-Neighbor tracing
$visitedEdges = @{}
$paths = [System.Collections.Generic.List[string]]::new()

# Directions: N, NE, E, SE, S, SW, W, NW
$dx = @(0, 1, 1, 1, 0, -1, -1, -1)
$dy = @(-1, -1, 0, 1, 1, 1, 0, -1)

# Helper function to check if cell is inside and solid
function IsSolid($x, $y) {
    if ($x -lt 0 -or $x -ge $w -or $y -lt 0 -or $y -ge $h) { return $false }
    return $grid[$x, $y]
}

# Find all external and internal boundary contours
$visitedStarts = @{}

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $isCurrentSolid = $grid[$x, $y]
        $isPrevSolid = if ($x -gt 0) { $grid[$x - 1, $y] } else { $false }

        # Check for outer boundary start (transition from air to solid) OR inner boundary start (transition from solid to air)
        $isOuterStart = ($isCurrentSolid -and -not $isPrevSolid)
        $isInnerStart = (-not $isCurrentSolid -and $isPrevSolid)

        if ($isOuterStart -or $isInnerStart) {
            $key = "$x,$y"
            if ($visitedStarts.ContainsKey($key)) { continue }

            # Start boundary trace
            $startX = if ($isOuterStart) { $x } else { $x - 1 }
            $startY = $y
            
            # Trace clockwise contour
            $currX = $startX
            $currY = $startY
            $currDir = 0
            $contourPoints = [System.Collections.Generic.List[System.Drawing.Point]]::new()
            $contourPoints.Add((New-Object System.Drawing.Point($currX, $currY)))
            $visitedStarts["$currX,$currY"] = $true

            $maxSteps = 50000
            $steps = 0
            $foundCycle = $false

            while ($steps -lt $maxSteps) {
                $steps++
                $foundNext = $false
                
                # Check 8 neighbors starting from back-dir
                $checkStartDir = ($currDir + 5) % 8
                for ($i = 0; $i -lt 8; $i++) {
                    $dir = ($checkStartDir + $i) % 8
                    $nx = $currX + $dx[$dir]
                    $ny = $currY + $dy[$dir]
                    if (IsSolid $nx $ny) {
                        $currX = $nx
                        $currY = $ny
                        $currDir = $dir
                        $foundNext = $true
                        break
                    }
                }

                if (-not $foundNext) { break }

                if ($currX -eq $startX -and $currY -eq $startY) {
                    $foundCycle = $true
                    break
                }

                $contourPoints.Add((New-Object System.Drawing.Point($currX, $currY)))
                $visitedStarts["$currX,$currY"] = $true
            }

            if ($foundCycle -and $contourPoints.Count -gt 15) {
                # Simplify polygon with Douglas-Peucker or step subsampling
                $stepSize = [Math]::Max(1, [int]($contourPoints.Count / 120))
                $simplified = [System.Collections.Generic.List[string]]::new()
                
                for ($p = 0; $p -lt $contourPoints.Count; $p += $stepSize) {
                    $pt = $contourPoints[$p]
                    $simplified.Add("$($pt.X) $($pt.Y)")
                }

                if ($simplified.Count -gt 5) {
                    $d = "M " + ($simplified -join " L ") + " Z"
                    $paths.Add($d)
                }
            }
        }
    }
}

Write-Output "Extracted $($paths.Count) contour paths."

$combinedD = $paths -join " "
$svg = @"
<svg class="brand-logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $w $h" fill="currentColor" fill-rule="evenodd">
  <path d="$combinedD" />
</svg>
"@

$svgOut = "d:\riya\Shriya's Portfolio\Shriya's Remake\images\shriya\shriya-butterfly-logo.svg"
[System.IO.File]::WriteAllText($svgOut, $svg)
[System.IO.File]::WriteAllText("d:\riya\Shriya's Portfolio\Shriya's Remake\scratch\latest_svg.txt", $svg)

Write-Output "Saved SVG to $svgOut"
