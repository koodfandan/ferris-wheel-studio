$ErrorActionPreference = "Stop"

$serviceRoot = Split-Path -Parent $PSScriptRoot
$venvPython = Join-Path $serviceRoot ".venv\\Scripts\\python.exe"
$packageRoot = Join-Path $serviceRoot ".packages"
$probeScript = Join-Path $PSScriptRoot "probe-hunyuan-local.py"

Push-Location $serviceRoot
try {
  if (Test-Path $venvPython) {
    $env:PYTHONPATH = $serviceRoot
    & $venvPython $probeScript
    exit $LASTEXITCODE
  }

  $env:PYTHONPATH = "$packageRoot;$serviceRoot"
  py -3 $probeScript
}
finally {
  Pop-Location
}
