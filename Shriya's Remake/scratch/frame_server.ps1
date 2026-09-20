$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8989/")
$listener.Start()
Write-Host "Server started at http://localhost:8989/"

$baseDir = "d:\riya\Shriya's Portfolio\Shriya's Remake"
$mockupDir = Join-Path $baseDir "Works\Mockups"

$count = 0
while ($listener.IsListening -and $count -lt 4) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    
    $path = $req.Url.AbsolutePath
    
    if ($req.HttpMethod -eq "POST" -and $path -eq "/save") {
        $reader = New-Object System.IO.StreamReader($req.InputStream)
        $body = $reader.ReadToEnd()
        $json = $body | ConvertFrom-Json
        
        $name = $json.name
        $b64 = $json.data -replace '^data:image\/[^;]+;base64,', ''
        $bytes = [System.Convert]::FromBase64String($b64)
        
        $outPath = Join-Path $mockupDir "$name.jpg"
        [System.IO.File]::WriteAllBytes($outPath, $bytes)
        Write-Host "Saved: $outPath ($($bytes.Length) bytes)"
        
        $count++
        $responseBytes = [System.Text.Encoding]::UTF8.GetBytes("OK: $count/4")
        $res.ContentType = "text/plain"
        $res.OutputStream.Write($responseBytes, 0, $responseBytes.Length)
        $res.Close()
    } else {
        # Serve static file
        $relPath = $path.TrimStart('/').Replace('/', '\')
        if ($relPath -eq "") { $relPath = "index.html" }
        $filePath = Join-Path $baseDir $relPath
        
        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html" }
                ".css" { "text/css" }
                ".js" { "application/javascript" }
                ".mp4" { "video/mp4" }
                ".jpg" { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".png" { "image/png" }
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
    }
}

$listener.Stop()
Write-Host "Server stopped after saving 4 frames."
