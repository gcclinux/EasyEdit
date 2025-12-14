@echo off
echo Setting up build environment...

REM Add Rust to PATH
set PATH=%PATH%;%USERPROFILE%\.cargo\bin

REM Try to find Visual Studio installation
if exist "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" (
    call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
    goto :build
)

if exist "C:\Program Files\Microsoft Visual Studio\2022\Professional\VC\Auxiliary\Build\vcvars64.bat" (
    call "C:\Program Files\Microsoft Visual Studio\2022\Professional\VC\Auxiliary\Build\vcvars64.bat"
    goto :build
)

if exist "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvars64.bat" (
    call "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
    goto :build
)

echo Visual Studio not found. Please install Visual Studio Build Tools.
echo Download from: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
pause
exit /b 1

:build
echo Building Tauri app...
npm run tauri:build