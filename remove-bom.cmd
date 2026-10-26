@echo off
REM Wrapper para ejecutar remove-bom.ps1 desde cmd.exe (Windows)
REM Uso: remove-bom.cmd [--whatif] [--verbose] [exclude1 exclude2 ...]

REM Cambiar al directorio del script para que los paths relativos funcionen
pushd "%~dp0"

REM Ejecutar PowerShell (prefiere pwsh si está disponible)
where pwsh >nul 2>&1
if %ERRORLEVEL%==0 (
  pwsh -NoProfile -ExecutionPolicy Bypass -File ".\remove-bom.ps1" %*
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File ".\remove-bom.ps1" %*
)

REM Volver al directorio previo
popd

EXIT /B %ERRORLEVEL%
