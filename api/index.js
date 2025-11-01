import fetch from "node-fetch";
import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_KEY = "iTeraPlay2025";
const bot = new Telegraf(BOT_TOKEN);

// Command: /start
bot.start((ctx) =>
  ctx.reply("👋 Hi! Send me your Terabox link and I’ll give you a playable video link 🎬")
);

// Handle any text message
bot.on("text", async (ctx) => {
  const text = ctx.message.text;
  const match = text.match(/https?:\/\/[^\s]+terabox\.com[^\s]+/);

  if (!match) {
    return ctx.reply("⚠️ Please send a valid Terabox link!");
  }

  const link = match[0];
  const encoded = encodeURIComponent(link);
  const videoUrl = `https://iteraplay.com/api/play.php?url=${encoded}&key=${API_KEY}`;

  await ctx.reply(
    `🎬 *Your Video is Ready!*\n\n▶️ [Watch Video](${videoUrl})\n📥 [Open in Terabox](${link})`,
    { parse_mode: "Markdown", disable_web_page_preview: false }
  );
});

// Export handler for Vercel
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body);
    } catch (err) {
      console.error("Bot error:", err);
    }
    return res.status(200).send("OK");
  }

  res.status(200).send("Bot running via Vercel ✅");
}
