param(
  [string]$RepoPath,
  [string]$BindHost = "127.0.0.1",
  [int]$Port = 8080,
  [string]$Device = "cuda",
  [string]$ShapeModel = "tencent/Hunyuan3D-2",
  [string]$TextureModel = "tencent/Hunyuan3D-2",
  [switch]$EnableTexture
)

$ErrorActionPreference = "Stop"

if (-not $RepoPath) {
  throw "RepoPath is required."
}

$repo = Resolve-Path $RepoPath
$apiServer = Join-Path $repo "api_server.py"

if (-not (Test-Path $apiServer)) {
  throw "api_server.py was not found under $repo"
}

Push-Location $repo
try {
  $args = @(
    $apiServer,
    "--host", $BindHost,
    "--port", "$Port",
    "--model_path", $ShapeModel,
    "--tex_model_path", $TextureModel,
    "--device", $Device
  )

  if ($EnableTexture) {
    $args += "--enable_tex"
  }

  py -3 @args
}
finally {
  Pop-Location
}
