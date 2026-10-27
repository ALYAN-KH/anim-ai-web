# Rebuild the local, display-sized GPT Image 2 gallery assets from the source URLs.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Net.Http

$projectRoot = Split-Path -Parent $PSScriptRoot
$dataFile = Join-Path $projectRoot 'src/data/gptImageExamples.ts'
$outputDir = Join-Path $projectRoot 'public/gpt-image-2'
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$source = Get-Content -LiteralPath $dataFile -Raw
$urls = [regex]::Matches($source, 'sourceImage: "(https://[^"]+)"') | ForEach-Object { $_.Groups[1].Value }
if ($urls.Count -ne 12) { throw "Expected 12 GPT Image 2 source images, found $($urls.Count)." }

$client = New-Object System.Net.Http.HttpClient
$client.Timeout = [TimeSpan]::FromSeconds(60)
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]84)

try {
  for ($index = 0; $index -lt $urls.Count; $index++) {
    $destination = Join-Path $outputDir ('{0:D2}.jpg' -f ($index + 1))
    if (Test-Path -LiteralPath $destination) { continue }

    $bytes = $client.GetByteArrayAsync($urls[$index]).GetAwaiter().GetResult()
    $stream = New-Object System.IO.MemoryStream(, $bytes)
    try {
      $original = [System.Drawing.Image]::FromStream($stream)
      try {
        $width = [Math]::Min(850, $original.Width)
        $height = [int][Math]::Round($original.Height * $width / $original.Width)
        $bitmap = New-Object System.Drawing.Bitmap($width, $height)
        try {
          $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
          try {
            $graphics.Clear([System.Drawing.Color]::White)
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.DrawImage($original, 0, 0, $width, $height)
          } finally { $graphics.Dispose() }
          $bitmap.Save($destination, $jpeg, $encoderParams)
        } finally { $bitmap.Dispose() }
      } finally { $original.Dispose() }
    } finally { $stream.Dispose() }

    $size = [Math]::Round((Get-Item -LiteralPath $destination).Length / 1KB)
    Write-Output "$(Split-Path -Leaf $destination): ${width}x${height}, ${size} KB"
  }
} finally {
  $encoderParams.Dispose()
  $client.Dispose()
}
