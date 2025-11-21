# PowerShell script to commit and push to GitHub
# Run this script from the project root directory

# Navigate to project directory
$projectPath = "C:\Users\vivga\OneDrive\AI\AI Projects\Children's Book 2"
Set-Location $projectPath

# Initialize git if not already done
if (-not (Test-Path .git)) {
    git init
}

# Add remote if not exists
$remoteExists = git remote | Select-String -Pattern "origin"
if (-not $remoteExists) {
    git remote add origin https://github.com/vivmuk/Childrensbook2.git
}

# Add all files
git add .

# Commit
git commit -m "Initial commit: KinderQuill children's book generator with Venice AI integration"

# Set main branch
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub. You may be prompted for credentials."
git push -u origin main

Write-Host "Done! Your code has been pushed to GitHub."

