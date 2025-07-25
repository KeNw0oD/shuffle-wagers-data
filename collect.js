const fs = require('fs');
const fetch = require('node-fetch');

// Загружаем пользователей из файла
const users = fs.readFileSync('users.txt', 'utf-8')
  .split('\n')
  .map(name => name.trim())
  .filter(Boolean);

const outputFile = 'wagers.json';

// Форматирует число с $ и запятыми
function formatUSD(value) {
  return `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function fetchWager(username) {
  try {
    const res = await fetch('https://shuffle.com/main-api/graphql/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName: 'user',
        variables: { username },
        query: `
          query user($username: String!) {
            user(username: $username) {
              username
              usdWagered
            }
          }
        `
      })
    });

    const data = await res.json();
    return data?.data?.user || null;

  } catch (err) {
    console.error(`Ошибка для ${username}:`, err.message);
    return null;
  }
}

async function collectAll() {
  const results = [];

  for (const username of users) {
    console.log(`🔍 Проверяем: ${username}`);
    const user = await fetchWager(username);

    if (user) {
      results.push({
  user: user.username,
  wager: formatUSD(user.usdWagered)
});
      console.log(`✅ ${user.username}: ${formatUSD(user.usdWagered)}`);
    } else {
      console.log(`❌ ${username} не найден или ошибка`);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n📦 Готово! Сохранено в ${outputFile}`);
}

collectAll();
