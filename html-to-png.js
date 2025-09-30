// html-to-png.js
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function convertHtmlToPng() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // HTML 파일 경로
  const htmlPath = path.join(__dirname, "index.html"); 

  if (!fs.existsSync(htmlPath)) {
    console.error(`HTML 파일을 찾을 수 없습니다: ${htmlPath}`);
    await browser.close();
    return;
  }

  // 파일 URL로 열기
  const fileUrl = `file://${htmlPath}`;

  // viewport 설정
  await page.setViewport({
    width: 840,
    height: 3000,
    deviceScaleFactor: 2,
  });

  // 페이지 로드
  await page.goto(fileUrl, {
    waitUntil: "networkidle0",
  });

  // CSS 추가
  await page.addStyleTag({
    content: `
      body {
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: flex-start !important;
        background: white !important;
      }
      .poster {
        margin: 0 auto !important;
      }
    `,
  });

  // 대기 (새로운 방법)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 포스터 요소 찾기
  const poster = await page.$(".poster");

  if (!poster) {
    console.error("포스터 요소를 찾을 수 없습니다");
    await browser.close();
    return;
  }

  // 포스터 스크린샷
  await poster.screenshot({
    path: "poster_output_v3.png",
    type: "png",
  });

  await browser.close();
  console.log("✅ PNG 생성 완료: poster_output.png");
}

convertHtmlToPng().catch(console.error);
