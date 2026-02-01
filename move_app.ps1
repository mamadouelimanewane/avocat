$source = "C:\gravity\Avocat\avocat-lite"
$dest = "C:\gravity\avocat-lite"

Write-Host "Attempting to move $source to $dest"

if (Test-Path $source) {
    if (-not (Test-Path $dest)) {
        Move-Item -Path $source -Destination $dest
        Write-Host "Move successful."
    } else {
        Write-Host "Destination already exists. Aborting."
    }
} else {
    Write-Host "Source subdirectory not found. It might have been moved already."
}
