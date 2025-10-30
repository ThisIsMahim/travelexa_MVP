@echo off
echo Converting MP4 videos to WebM format...
echo.

REM Change to the videos directory
cd /d "e:\Skybridge Digital\travelexa_MVP\public\videos"

REM Check if ffmpeg is available
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: FFmpeg is not installed or not in PATH
    echo Please install FFmpeg from https://ffmpeg.org/download.html
    pause
    exit /b 1
)

echo Converting videos with optimized WebM settings...
echo.

REM Convert each video with high quality WebM settings
echo Converting travel-bg-1-optimized.mp4...
ffmpeg -i "travel-bg-1-optimized.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -row-mt 1 -tile-columns 2 -tile-rows 1 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -g 999999 -aq-mode 0 -an "travel-bg-1-optimized.webm"

echo Converting travel-bg-2-optimized.mp4...
ffmpeg -i "travel-bg-2-optimized.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -row-mt 1 -tile-columns 2 -tile-rows 1 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -g 999999 -aq-mode 0 -an "travel-bg-2-optimized.webm"

echo Converting travel-bg-3-optimized.mp4...
ffmpeg -i "travel-bg-3-optimized.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -row-mt 1 -tile-columns 2 -tile-rows 1 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -g 999999 -aq-mode 0 -an "travel-bg-3-optimized.webm"

echo Converting travel-bg-4-optimized.mp4...
ffmpeg -i "travel-bg-4-optimized.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -row-mt 1 -tile-columns 2 -tile-rows 1 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -g 999999 -aq-mode 0 -an "travel-bg-4-optimized.webm"

echo.
echo Conversion complete!
echo WebM files created with VP9 codec for better compression and faster loading.
echo.
pause