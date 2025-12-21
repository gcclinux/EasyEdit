@echo off
echo Setting up build environment...

REM Add Rust to PATH
set PATH=%PATH%;%USERPROFILE%\.cargo\bin

@REM REM Try to find Visual Studio installation
@REM if exist "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" (
@REM     call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
@REM     goto :build
@REM )

@REM if exist "C:\Program Files\Microsoft Visual Studio\2022\Professional\VC\Auxiliary\Build\vcvars64.bat" (
@REM     call "C:\Program Files\Microsoft Visual Studio\2022\Professional\VC\Auxiliary\Build\vcvars64.bat"
@REM     goto :build
@REM )

@REM if exist "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvars64.bat" (
@REM     call "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
@REM     goto :build
@REM )

@REM echo Visual Studio not found. Please install Visual Studio Build Tools.
@REM echo Download from: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
@REM pause
@REM exit /b 1

:build
@echo off
setlocal
set WEBKIT_DISABLE_DMABUF_RENDERER=1
set WEBKIT_DISABLE_COMPOSITING_MODE=1
echo Building Tauri application for Windows...
npm run tauri build
endlocal
echo Build finished.