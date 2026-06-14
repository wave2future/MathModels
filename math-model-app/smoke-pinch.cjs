const puppeteer = require("puppeteer-core");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 700, isMobile: true, hasTouch: true });

  await page.goto("http://localhost:4321/#quadratic", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1000));

  const svgSel = "svg.touch-none";
  await page.waitForSelector(svgSel);

  await page.evaluate(() => {
    window.__touchLog = [];
    const el = document.querySelector("svg.touch-none").parentElement;
    for (const t of ["touchstart", "touchmove", "touchend"]) {
      el.addEventListener(t, (e) => window.__touchLog.push(t + ":" + e.touches.length), { capture: true });
    }
  });

  const center = await page.$eval(svgSel, (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  const client = await page.target().createCDPSession();

  async function dispatchTouch(type, points) {
    await client.send("Input.dispatchTouchEvent", {
      type,
      touchPoints: points.map((p) => ({ x: p.x, y: p.y, id: p.id })),
    });
  }

  const start = [
    { id: 1, x: center.x - 10, y: center.y },
    { id: 2, x: center.x + 10, y: center.y },
  ];
  await dispatchTouch("touchStart", start);
  for (let i = 1; i <= 10; i++) {
    const d = 10 + i * 8;
    await dispatchTouch("touchMove", [
      { id: 1, x: center.x - d, y: center.y },
      { id: 2, x: center.x + d, y: center.y },
    ]);
    await new Promise((r) => setTimeout(r, 16));
  }
  await dispatchTouch("touchEnd", []);
  await new Promise((r) => setTimeout(r, 200));

  const log = await page.evaluate(() => window.__touchLog);
  console.log("touch log:", JSON.stringify(log));

  const allText = await page.evaluate(() =>
    Array.from(document.querySelectorAll("body *"))
      .map((e) => e.textContent?.trim())
      .filter((t) => t && /%/.test(t) && t.length < 10),
  );
  console.log("percent texts:", JSON.stringify(allText));

  await browser.close();
})();
