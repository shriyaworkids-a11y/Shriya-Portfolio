$rootDir = "d:\riya\Shriya's Portfolio\Shriya's Remake"
$svgPath = Join-Path $rootDir "images\shriya\shriya-butterfly-logo.svg"
$newSvg = (Get-Content -Path $svgPath -Raw).Trim()

$htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -Recurse | Where-Object { 
    $_.FullName -notmatch '\\scratch\\' -and $_.FullName -notmatch '\\node_modules\\'
}

Write-Output "Found $($htmlFiles.Count) HTML files to process."

$svgPattern = '(?s)<svg class=["'']brand-logo-icon["''].*?<\/svg>'

$updated = 0
foreach ($f in $htmlFiles) {
    $content = Get-Content -Path $f.FullName -Raw
    if ($content -match $svgPattern) {
        $content = [regex]::Replace($content, $svgPattern, $newSvg)
        [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        $updated++
        Write-Output "Updated: $($f.FullName)"
    } else {
        Write-Output "No brand-logo-icon in: $($f.FullName)"
    }
}

Write-Output "FINISHED: Updated $updated files successfully with new butterfly logo."
