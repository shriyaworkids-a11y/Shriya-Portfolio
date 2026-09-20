$projectenDir = "D:\riya\Shriya's Portfolio\Shriya's Remake\projecten"
$files = Get-ChildItem -Path $projectenDir -Filter "*.html"

$avatarBlock = @'
        <div class="footer-top-wrapper" style="margin-bottom: 2.5rem;">
          <div class="footer-img-wrapper">
            <img src="../images/shriya/footer-normal.jpg" alt="Shriya Sharma portrait" class="footer-img-normal"/>
          </div>
          <div class="footer-title-wrapper">
            <div class="text-size-large" style="font-size: clamp(1.6rem, 3.5vw, 2.5rem); font-weight: 500; color: var(--light-bg); line-height: 1.2;">Let's build something extraordinary together.</div>
          </div>
        </div>
'@

foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName)
    
    # Replace encoding artifacts
    $content = $content.Replace("Â©", "©")
    $content = $content.Replace("â€”", "—")
    
    # If footer-top-wrapper doesn't exist, insert before footer-bottom-wrapper
    if (-not $content.Contains("footer-top-wrapper") -and $content.Contains('<div class="footer-bottom-wrapper"')) {
        $content = $content.Replace('<div class="footer-bottom-wrapper"', "$avatarBlock`n        <div class=\"footer-bottom-wrapper\"")
        [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Output "Added avatar footer to $($f.Name)"
    } else {
        [System.IO.File]::WriteAllText($f.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Output "Cleaned $($f.Name)"
    }
}

# Clean main pages
$mainPages = @('index.html', 'about.html', 'work.html', 'contact.html', 'privacy-statement.html')
foreach ($mp in $mainPages) {
    $full = Join-Path "D:\riya\Shriya's Portfolio\Shriya's Remake" $mp
    if (Test-Path $full) {
        $c = [System.IO.File]::ReadAllText($full)
        $c = $c.Replace("Â©", "©")
        $c = $c.Replace("â€”", "—")
        [System.IO.File]::WriteAllText($full, $c, [System.Text.Encoding]::UTF8)
        Write-Output "Cleaned $mp"
    }
}

Write-Output "COMPLETE!"
