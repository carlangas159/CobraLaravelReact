# PowerShell pre-commit hook para ambientes Windows
# Elimina BOMs (UTF-8 BOM) de archivos de texto antes de hacer commit.
# Uso:
# 1) Configura git para usar .githooks como hooks path:
#    git config core.hooksPath .githooks
# 2) El hook se ejecutará automáticamente antes de cada commit.
# 3) También puedes ejecutar manualmente: pwsh .\.githooks\pre-commit.ps1
#
# Ejemplos de uso:
# 1) Ejecutarlo manualmente en PowerShell:
#    cd C:\Work\testing\CobraLaravelReact
#    .\.githooks\pre-commit.ps1
# 2) Ejecutarlo desde cmd.exe (usa PowerShell):
#    powershell -ExecutionPolicy Bypass -File .\.githooks\pre-commit.ps1
# 3) Para inspeccionar si hay BOMs sin modificar archivos, ejecuta la función Check-RepoForBOM

param()

# Directorios a ignorar (nombres de carpeta en la raíz o internos)
$ignores = @('.git','node_modules','dist','public','vendor')
# Extensiones de archivos de texto a procesar
$textExt = @('.js','.ts','.tsx','.jsx','.json','.md','.html','.css','.scss','.conf','.env','.yml','.yaml','.txt','.ini','.ps1','.sh','.dockerfile','.conf')

function IsTextFile([string]$filePath) {
    $name = [System.IO.Path]::GetFileName($filePath)
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    if ($name -ieq 'Dockerfile') { return $true }
    return $textExt -contains $ext
}

function StripBOM([string]$file) {
    try {
        $fs = [System.IO.File]::Open($file, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite)
        $buffer = New-Object byte[] 3
        $read = $fs.Read($buffer, 0, 3)
        if ($read -eq 3 -and $buffer[0] -eq 0xEF -and $buffer[1] -eq 0xBB -and $buffer[2] -eq 0xBF) {
            # Leer el resto del archivo
            $remainingLen = $fs.Length - 3
            $remaining = New-Object byte[] $remainingLen
            $fs.Read($remaining, 0, $remainingLen) | Out-Null
            $fs.SetLength(0) | Out-Null
            $fs.Write($remaining, 0, $remainingLen) | Out-Null
            $fs.Flush()
            $fs.Close()
            Write-Output "Stripped BOM: $file"
            return $true
        }
        $fs.Close()
        return $false
    } catch {
        Write-Output "Error processing $file : $($_.Exception.Message)"
        return $false
    }
}

function Walk-Repo([string]$dir) {
    $items = Get-ChildItem -LiteralPath $dir -Force
    foreach ($item in $items) {
        if ($ignores -contains $item.Name) { continue }
        if ($item.PSIsContainer) {
            Walk-Repo $item.FullName
        } else {
            if (IsTextFile $item.FullName) {
                StripBOM $item.FullName | Out-Null
            }
        }
    }
}

function Check-RepoForBOM([string]$dir) {
    $found = $false
    $items = Get-ChildItem -LiteralPath $dir -Force -Recurse
    foreach ($item in $items) {
        if ($item.PSIsContainer) { continue }
        if ($ignores -contains $item.Directory.Name) { continue }
        if (IsTextFile $item.FullName) {
            $fs = [System.IO.File]::Open($item.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
            $buffer = New-Object byte[] 3
            $read = $fs.Read($buffer, 0, 3)
            $fs.Close()
            if ($read -eq 3 -and $buffer[0] -eq 0xEF -and $buffer[1] -eq 0xBB -and $buffer[2] -eq 0xBF) {
                Write-Output "BOM found: $($item.FullName)"
                $found = $true
            }
        }
    }
    if (-not $found) { Write-Output "No BOMs found." }
}

# Ejecutar limpieza en la raíz del repo (ruta relativa al script)
$repoRoot = (Get-Location).Path
Write-Output "Scanning and stripping BOMs in: $repoRoot"
Walk-Repo $repoRoot

# Re-agregar archivos modificados al índice para incluir las correcciones en el commit
try {
    git add -A
} catch {
    Write-Output "git no disponible o fallo al re-agregar archivos: $($_.Exception.Message)"
}

exit 0
