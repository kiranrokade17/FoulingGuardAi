# PowerShell script to copy GLB files to public directory
# Run this from the client directory: powershell -ExecutionPolicy Bypass -File copy-models.ps1

$sourceDir = "..\assets\3d species model"
$destDir = ".\public\assets\3d species model"

Write-Host "🎨 Copying 3D GLB models to public directory..."

if (Test-Path $sourceDir) {
    if (!(Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force
    }
    
    Get-ChildItem -Path $sourceDir -Filter "*.glb" | ForEach-Object {
        $sourcePath = $_.FullName
        $destPath = Join-Path $destDir $_.Name
        
        Write-Host "📁 Copying: $($_.Name)"
        Copy-Item -Path $sourcePath -Destination $destPath -Force
    }
    
    Write-Host "✅ All GLB models copied successfully!"
    Write-Host "📍 Models available at: $destDir"
} else {
    Write-Host "❌ Source directory not found: $sourceDir"
    Write-Host "Please run this script from the client directory"
}