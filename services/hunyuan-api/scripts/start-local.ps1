param(
  [string]$BindHost = "127.0.0.1",
  [int]$Port = 8000,
  [switch]$SkipInstall,
  [switch]$Reload,
  [switch]$UseRealPipeline,
  [string]$GeneratorProvider = "",
  [string]$HunyuanRepoPath = ""
)

$ErrorActionPreference = "Stop"

$serviceRoot = Split-Path -Parent $PSScriptRoot
$venvRoot = Join-Path $serviceRoot ".venv"
$venvPython = Join-Path $venvRoot "Scripts\\python.exe"
$packageRoot = Join-Path $serviceRoot ".packages"
$envFile = Join-Path $serviceRoot ".env"
$envExample = Join-Path $serviceRoot ".env.example"
$requirementsFile = Join-Path $serviceRoot "requirements.txt"
$useSharedPython = $false

function Test-PythonRuntime {
  param(
    [string]$PythonExecutable
  )

  if (-not (Test-Path $PythonExecutable)) {
    return $false
  }

  $previousErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = "Continue"
    & $PythonExecutable -c "import fastapi, uvicorn" 1> $null 2> $null
    return $LASTEXITCODE -eq 0
  }
  finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }
}

function Test-SharedPythonRuntime {
  param(
    [string]$PackageDirectory
  )

  if (-not (Test-Path $PackageDirectory)) {
    return $false
  }

  $previousErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = "Continue"
    & py -3 -c "import sys; sys.path.insert(0, r'$PackageDirectory'); import fastapi, uvicorn" 1> $null 2> $null
    return $LASTEXITCODE -eq 0
  }
  finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }
}

if (-not (Test-Path $venvPython)) {
  try {
    Write-Host "Creating virtual environment at $venvRoot"
    py -3 -m venv $venvRoot
  }
  catch {
    Write-Warning "venv creation failed, falling back to shared Python + local .packages"
    $useSharedPython = $true
  }
}

if (-not (Test-Path $envFile) -and (Test-Path $envExample)) {
  Copy-Item -Path $envExample -Destination $envFile
}

if (-not $SkipInstall) {
  Write-Host "Installing backend dependencies"
  if ($useSharedPython) {
    New-Item -ItemType Directory -Force -Path $packageRoot | Out-Null
    py -3 -m pip install -r $requirementsFile --target $packageRoot
  }
  else {
    & $venvPython -m pip install --upgrade pip
    & $venvPython -m pip install -r $requirementsFile
  }
}
elseif (-not (Test-PythonRuntime -PythonExecutable $venvPython)) {
  $useSharedPython = $true
}

if ($useSharedPython -and -not (Test-SharedPythonRuntime -PackageDirectory $packageRoot)) {
  throw "Shared Python runtime is not ready. Run the script once without -SkipInstall, or install requirements into .packages first."
}

$env:APP_HOST = $BindHost
$env:APP_PORT = "$Port"
$env:PUBLIC_BASE_URL = "http://$($BindHost):$Port"
$env:ENABLE_MOCK_PIPELINE = $(if ($UseRealPipeline) { "false" } else { "true" })

if ($GeneratorProvider) {
  $env:GENERATOR_PROVIDER = $GeneratorProvider
}
else {
  Remove-Item Env:GENERATOR_PROVIDER -ErrorAction SilentlyContinue
}

if ($HunyuanRepoPath) {
  $env:HUNYUAN_REPO_PATH = $HunyuanRepoPath
}
else {
  Remove-Item Env:HUNYUAN_REPO_PATH -ErrorAction SilentlyContinue
}

if (-not $env:DATABASE_URL) {
  $env:DATABASE_URL = "sqlite+pysqlite:///:memory:"
}

Push-Location $serviceRoot
try {
  $uvicornArgs = @("-m", "uvicorn", "app.main:app", "--host", $BindHost, "--port", "$Port")
  if ($Reload) {
    $uvicornArgs += "--reload"
  }

  if ($useSharedPython) {
    $env:PYTHONPATH = "$packageRoot;$serviceRoot"
    & py -3 @uvicornArgs
  }
  else {
    & $venvPython @uvicornArgs
  }
}
finally {
  Pop-Location
}
