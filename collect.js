const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const users = fs.readFileSync("users.txt", "utf-8").split("\n").map(u => u.trim()).filter(Boolean);

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--start-maximized"],
    defaultViewport: null
  });

  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9"
  });

  const results = [];

  for (const user of users) {
    const url = `https://shuffle.com/?modal=user&md-name=${user}`;
    console.log(`🔍 Читаем: ${user}`);

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 5000)); // Пауза

      const wager = await page.$eval("span.ValueWithIcon_root__eGsJu", el => el.textContent.trim());
      results.push({ user, wager });
      console.log(`✅ ${user}: ${wager}`);
    } catch (err) {
      console.warn(`⚠️ Попытка повторно загрузить: ${user}`);
      try {
        await page.reload({ waitUntil: "domcontentloaded" });
        await new Promise(resolve => setTimeout(resolve, 5000)); // Пауза
        const wager = await page.$eval("span.ValueWithIcon_root__eGsJu", el => el.textContent.trim());
        results.push({ user, wager });
        console.log(`✅ (повторно) ${user}: ${wager}`);
      } catch (err2) {
        console.log(`❌ Не удалось прочитать ${user}: ${err2.message}`);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Пауза между пользователями
  }

  await browser.close();
  fs.writeFileSync("wagers.json", JSON.stringify(results, null, 2));
  console.log("✅ Все данные сохранены в wagers.json");
})();
