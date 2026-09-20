$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$rootDir = "D:\riya\Shriya's Portfolio\Shriya's Remake"

$files = @(
    (Join-Path $rootDir "index.html"),
    (Join-Path $rootDir "about.html"),
    (Join-Path $rootDir "work.html"),
    (Join-Path $rootDir "contact.html"),
    (Join-Path $rootDir "privacy-statement.html")
)

$projDir = Join-Path $rootDir "projecten"
if (Test-Path $projDir) {
    Get-ChildItem -Path $projDir -Filter "*.html" | ForEach-Object {
        $files += $_.FullName
    }
}

foreach ($f in $files) {
    if (Test-Path $f) {
        $rawBytes = [System.IO.File]::ReadAllBytes($f)
        $text = [System.Text.Encoding]::UTF8.GetString($rawBytes)
        $orig = $text

        $text = $text.Replace("â€”", "—")
        $text = $text.Replace("â€“", "–")
        $text = $text.Replace("â€™", "’")
        $text = $text.Replace("â€˜", "‘")
        $text = $text.Replace("â€œ", "“")
        $text = $text.Replace("â€", "”")
        $text = $text.Replace("â†’", "→")
        $text = $text.Replace("â†", "←")
        $text = $text.Replace("â˜…", "★")
        $text = $text.Replace("Â©", "©")
        $text = $text.Replace("â‚¬", "€")
        $text = $text.Replace("102Â°", "102°")

        if ($text -ne $orig) {
            [System.IO.File]::WriteAllText($f, $text, $utf8NoBom)
            Write-Output "Cleaned: $f"
        }
    }
}
Write-Output "All files cleaned!"
