const { execSync } = require('child_process');
const fs = require('fs');

// 1. Собираем новые данные
console.log("🧠 Запуск сбора данных...");
execSync("node collect.js", { stdio: 'inherit' });

// 2. Git commit & push
console.log("🚀 Обновляем GitHub...");
execSync("git add wagers.json", { stdio: 'inherit' });
execSync('git commit -m "📊 auto-update wagers.json"', { stdio: 'inherit' });
execSync("git push", { stdio: 'inherit' });

console.log("✅ Готово! Сайт обновится через минуту.");
