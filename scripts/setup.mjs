import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync, writeFileSync } from "node:fs";

const rl = createInterface({ input, output });

function normalizeUrl(url) {
  return (url || "").trim().replace(/\/$/, "");
}

function yes(value) {
  return ["y", "yes", "s", "si"].includes((value || "").trim().toLowerCase());
}

async function ask(question, defaultValue = "") {
  const suffix = defaultValue ? ` (${defaultValue})` : "";
  const answer = await rl.question(`${question}${suffix}: `);
  return answer.trim() || defaultValue;
}

async function run() {
  console.log("\nNext WP Woo Headless Starter - Setup Wizard\n");

  const wpUrl = normalizeUrl(await ask("WP_URL", "https://example.com"));
  const enableWoo = yes(await ask("Enable WooCommerce? [y/N]", "N"));

  let wcConsumerKey = "";
  let wcConsumerSecret = "";

  if (enableWoo) {
    wcConsumerKey = await ask("WC_CONSUMER_KEY");
    wcConsumerSecret = await ask("WC_CONSUMER_SECRET");
  }

  const revalidateSeconds = await ask("REVALIDATE_SECONDS", "60");
  const wpRevalidateSecret = await ask("WP_REVALIDATE_SECRET (optional)", "");
  const siteUrl = normalizeUrl(await ask("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"));

  const env = [
    `WP_URL=${wpUrl}`,
    `WC_CONSUMER_KEY=${wcConsumerKey}`,
    `WC_CONSUMER_SECRET=${wcConsumerSecret}`,
    `REVALIDATE_SECONDS=${revalidateSeconds}`,
    `WP_REVALIDATE_SECRET=${wpRevalidateSecret}`,
    `NEXT_PUBLIC_SITE_URL=${siteUrl}`,
    ""
  ].join("\n");

  if (existsSync(".env.local")) {
    const overwrite = yes(await ask(".env.local exists. Overwrite? [y/N]", "N"));
    if (!overwrite) {
      console.log("Setup canceled. Existing .env.local was not modified.");
      rl.close();
      return;
    }
  }

  writeFileSync(".env.local", env, "utf8");

  console.log("\n.env.local created successfully.");
  console.log("Run: npm run dev\n");

  rl.close();
}

run().catch((error) => {
  console.error("Setup failed:", error);
  rl.close();
  process.exit(1);
});
