@echo off
cd /d "%~dp0"
echo Запуск автообновления Shuffle Wagers...
node update-and-push.js
pause