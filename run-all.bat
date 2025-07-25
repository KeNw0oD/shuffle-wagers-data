@echo off
echo 🔄 Обновляем wager...
node collect.js

echo 🚀 Заливаем на GitHub...
call update-and-push.bat

pause
