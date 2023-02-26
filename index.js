const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const puppeteer = require("puppeteer");

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/youtube", async (req, res) => {
  const search = req.query.search;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(`https://www.youtube.com/results?search_query=${search}`);

  const aTag = await page.waitForSelector(
    "ytd-app > #content > ytd-page-manager > ytd-search > #container > ytd-two-column-search-results-renderer > #primary > ytd-section-list-renderer > #contents > ytd-item-section-renderer > #contents > ytd-video-renderer:nth-child(1) a"
  );
  const href = await aTag.evaluate((el) => el.href);

  console.log(href);

  if (!href) {
    res.json({
      id: "",
    });
  }

  const matches = href.match(/v=([^&]*)/);

  res.json({
    id: matches[1],
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
