# Set up portable paths
$NodeDir = Join-Path $PSScriptRoot "node-portable"
$env:Path = "$NodeDir;$env:Path"

# Check if port 8000 (backend) or 5173 (frontend) is already in use
$BackendPort = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
$FrontendPort = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($BackendPort) {
    Write-Host "Warning: Port 8000 is already in use. Backend might fail to start if another service is running there." -ForegroundColor Yellow
}
if ($FrontendPort) {
    Write-Host "Warning: Port 5173 is already in use. Frontend might start on a different port." -ForegroundColor Yellow
}

Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "                 LAUNCHING AURA MARKET                 " -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

# Start Backend FastAPI
Write-Host "[1/3] Starting Python FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
$BackendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\uvicorn main:app --reload" -PassThru

# Start Frontend React
Write-Host "[2/3] Starting React + TailwindCSS Frontend on http://localhost:5173..." -ForegroundColor Green
$FrontendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd frontend; ..\node-portable\npm.cmd run dev" -PassThru

# Open Browser
Write-Host "[3/3] Launching web app in default browser..." -ForegroundColor Green
Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"

Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "Aura Market is now running!" -ForegroundColor Green
Write-Host "To shut down both servers, press any key in this window." -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "Shutting down servers..." -ForegroundColor Red
Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue

# Also stop any running child node or uvicorn processes to be clean
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*node-portable*" } | Stop-Process -Force
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*ecommerce\backend*" } | Stop-Process -Force

Write-Host "Goodbye!" -ForegroundColor Green
