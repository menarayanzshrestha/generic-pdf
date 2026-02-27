import puppeteer from "puppeteer";

// global browser instance for reuse
let browser : puppeteer.Browser | null = null;

export const getBrowser = async () => {
  if (!browser || !browser.isConnected()) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--disable-background-networking",
        "--disable-extensions",
      ],
    });

    process.on("exit", async () => {
      if (browser && browser.isConnected()) await browser.close();
    });
  }
  return browser;
};
