@echo off
echo Committing KinderQuill to GitHub...
echo.

git init
if errorlevel 1 (
    echo Git init failed or already initialized
)

git remote add origin https://github.com/vivmuk/Childrensbook2.git
if errorlevel 1 (
    echo Remote may already exist, continuing...
)

git add .
if errorlevel 1 (
    echo Failed to add files
    pause
    exit /b 1
)

git commit -m "Initial commit: KinderQuill children's book generator with Venice AI integration"
if errorlevel 1 (
    echo Failed to commit
    pause
    exit /b 1
)

git branch -M main
if errorlevel 1 (
    echo Failed to rename branch
)

echo.
echo Pushing to GitHub...
echo You may be prompted for your GitHub credentials.
git push -u origin main

if errorlevel 1 (
    echo.
    echo Push failed. You may need to:
    echo 1. Set up authentication (Personal Access Token)
    echo 2. Or use GitHub Desktop/VS Code to push
) else (
    echo.
    echo Success! Code has been pushed to GitHub.
)

pause


