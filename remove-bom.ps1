<#
remove-bom.ps1
Script para Windows (PowerShell) que recorre recursivamente el repositorio y elimina el BOM UTF-8 (bytes EF BB BF)
al comienzo de cualquier archivo. No depende de Node ni de utilidades externas.

Uso (ejecutar desde la raíz del proyecto):
  powershell -NoProfile -ExecutionPolicy Bypass -File .\remove-bom.ps1

Comentarios y ejemplos (en español):
1) Ejecutar revisión y limpieza por defecto (excluye .git y node_modules):
   powershell -NoProfile -ExecutionPolicy Bypass -File .\remove-bom.ps1
2) Ejecutar en modo "solo informe" (no modifica archivos):
   powershell -NoProfile -ExecutionPolicy Bypass -File .\remove-bom.ps1 -WhatIf
3) Excluir carpetas adicionales (por ejemplo "vendor"):
   powershell -NoProfile -ExecutionPolicy Bypass -File .\remove-bom.ps1 -Exclude '.git','vendor'

El script está diseñado para usarse en Windows (PowerShell 5+ o PowerShell Core).
#>

[CmdletBinding()]
param(
    [Parameter(Position=0, HelpMessage = 'Raíz donde buscar (por defecto: .)')]
    [string]
    $Root = '.',

    [Parameter(HelpMessage = 'Lista de nombres de carpetas a excluir (por defecto: .git,node_modules)')]
    [string[]]
    $Exclude = @('.git','node_modules'),

    [Parameter(HelpMessage = 'Si se especifica, no modifica archivos, solo informa')]
    [switch]
    $WhatIf
)

function Remove-UTF8BOM {
    param(
        [Parameter(Mandatory = $true)]
        [string]
        $Path
    )

    try {
        $bytes = [System.IO.File]::ReadAllBytes($Path)
    } catch {
        Write-Verbose ("No se pudo leer {0}: {1}" -f $Path, $_.Exception.Message)
        return $false
    }

    if ($bytes.Length -lt 3) { return $false }
    if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        if ($WhatIf) {
            Write-Host "[WhatIf] BOM encontrado: $Path"
            return $true
        }
        try {
            Write-Verbose (("Eliminando BOM: {0}") -f $Path)
            $new = New-Object byte[] ($bytes.Length - 3)
            [Array]::Copy($bytes, 3, $new, 0, $new.Length)
            [System.IO.File]::WriteAllBytes($Path, $new)
            return $true
        } catch {
            Write-Warning (("Error al reescribir {0}: {1}") -f $Path, $_.Exception.Message)
            return $false
        }
    }
    return $false
}

function Remove-BOMsInRepo {
    param(
        [string]
        $RootPath = '.',
        [string[]]
        $ExcludeDirs = @('.git','node_modules'),
        [switch]
        $WhatIfMode = $false
    )

    $rootAbsolute = [System.IO.Path]::GetFullPath($RootPath)
    if (-not (Test-Path $rootAbsolute)) {
        Write-Error "La ruta $rootAbsolute no existe"
        return
    }

    $files = Get-ChildItem -LiteralPath $rootAbsolute -Recurse -File -Force -ErrorAction SilentlyContinue
    $count = 0
    $checked = 0

    foreach ($f in $files) {
        $full = $f.FullName
        $skip = $false
        foreach ($ex in $ExcludeDirs) {
            if ($full -like "*\\$ex\\*" -or $full -like "*\/$ex\/*") { $skip = $true; break }
        }
        if ($skip) { continue }

        $checked++
        $had = Remove-UTF8BOM -Path $full
        if ($had) { $count++ }
    }

    Write-Host "Procesados: $checked archivos. BOMs eliminados: $count"
}

# Ejecutar
if ($WhatIf) { Write-Host "Modo informe (WhatIf): no se modificarán archivos" }
Remove-BOMsInRepo -RootPath $Root -ExcludeDirs $Exclude -WhatIfMode:$WhatIf

# Fin del script
