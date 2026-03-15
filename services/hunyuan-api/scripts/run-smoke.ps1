param(
  [string]$BaseUrl = "http://127.0.0.1:8000",
  [string]$ApiPrefix = "/api",
  [switch]$IncludeFailureCases
)

$ErrorActionPreference = "Stop"

$serviceRoot = Split-Path -Parent $PSScriptRoot
$venvPython = Join-Path $serviceRoot ".venv\\Scripts\\python.exe"
$scriptPath = Join-Path $PSScriptRoot "smoke-import.py"

if (Test-Path $venvPython) {
  $args = @($scriptPath, "--base-url", $BaseUrl, "--api-prefix", $ApiPrefix)
  if ($IncludeFailureCases) {
    $args += "--include-failure-cases"
  }
  & $venvPython @args
  exit $LASTEXITCODE
}

$args = @($scriptPath, "--base-url", $BaseUrl, "--api-prefix", $ApiPrefix)
if ($IncludeFailureCases) {
  $args += "--include-failure-cases"
}
py -3 @args
