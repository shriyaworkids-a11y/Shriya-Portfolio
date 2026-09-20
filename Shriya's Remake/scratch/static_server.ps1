$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:5500/")
$listener.Start()
Write-Host "Static server listening at http://localhost:5500/"

$baseDir = "d:\riya\Shriya's Portfolio\Shriya's Remake"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        
        $path = $req.Url.AbsolutePath
        $relPath = $path.TrimStart('/').Replace('/', '\')
        if ($relPath -eq "" -or $relPath -eq "\") { $relPath = "index.html" }
        $filePath = Join-Path $baseDir $relPath
        
        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css" { "text/css; charset=utf-8" }
                ".js" { "application/javascript; charset=utf-8" }
                ".mp4" { "video/mp4" }
                ".jpg" { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".jfif" { "image/jpeg" }
                ".png" { "image/png" }
                ".svg" { "image/svg+xml" }
                ".otf" { "font/otf" }
                ".woff2" { "font/woff2" }
                default { "application/octet-stream" }
            }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $res.ContentType = $mime
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            $res.Close()
        } else {
            $res.StatusCode = 404
            $res.Close()
        }
    } catch {
        # continue
    }
}
