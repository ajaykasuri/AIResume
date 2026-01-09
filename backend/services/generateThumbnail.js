const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

module.exports = async function generateThumbnail(html, resume_id) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.setViewport({
    width: 794,
    height: 1123,
    deviceScaleFactor: 2,
  });

  const dir = path.join(__dirname, "../public/thumbnails");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${resume_id}.png`);

  await page.screenshot({
    path: filePath,
    fullPage: true,
  });

  await browser.close();

  return `/thumbnails/${resume_id}.png`;
};
