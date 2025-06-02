@echo off
echo Killing processes on port 3000...

REM Find process using port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Killing process %%a
    taskkill /F /PID %%a 2>nul
)

echo Done! Port 3000 should now be free.
pause
