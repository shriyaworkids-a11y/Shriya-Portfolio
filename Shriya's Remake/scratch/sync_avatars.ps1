$projectenDir = "D:\riya\Shriya's Portfolio\Shriya's Remake\projecten"
$files = Get-ChildItem -Path $projectenDir -Filter "*.html"

$avatarBlock = @"
        <div class="footer-top-wrapper" style="margin-bottom: 2.5rem;">
          <div class="footer-img-wrapper">
            <img src="../images/shriya/footer-normal.jpg" alt="Shriya Sharma portrait" class="footer-img-normal"/>
          </div>
          <div class="footer-title-wrapper">
            <div class="text-size-large" style="font-size: clamp(1.6rem, 3.5vw, 2.5rem); font-weight: 500; color: var(--light-bg); line-height: 1.2;">Let's build something extraordinary together.</div>
          </div>
        </div>
"@

$targetStr = '<div class="footer-bottom-wrapper"'

foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $hasTop = $c.IndexOf("footer-top-wrapper") -ge 0
    $hasBottom = $c.IndexOf($targetStr) -ge 0
    
    if (-not $hasTop -and $hasBottom) {
        $rep = $avatarBlock + [Environment]::NewLine + "        " + $targetStr
        $c = $c.Replace($targetStr, $rep)
        [System.IO.File]::WriteAllText($f.FullName, $c, [System.Text.Encoding]::UTF8)
        Write-Output ("Added to " + $f.Name)
    }
}

Write-Output "ALL CASE STUDY FOOTERS SYNCHRONIZED!"
