# Servidor local opcional (la web también funciona abriendo index.html con doble clic).
param([int]$Port = 8765)
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "LoL Stats en http://localhost:$Port/"
$types = @{ '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.png' = 'image/png'; '.svg' = 'image/svg+xml'; '.webp' = 'image/webp'; '.json' = 'application/json' }
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
  if (-not $path) { $path = 'index.html' }
  $file = [IO.Path]::GetFullPath((Join-Path $root $path))
  if ($file.StartsWith($root) -and (Test-Path $file -PathType Leaf)) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $type = $types[[IO.Path]::GetExtension($file)]
    if ($type) { $ctx.Response.ContentType = $type }
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
