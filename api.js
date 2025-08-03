const axios = require('axios');

function setupDeepSeekBot(bot) {
    bot.on('text', async (ctx) => {
        if (!ctx.message.text.startsWith('/')) {
            try {
                const response = await axios.post('https://api.deepseek.com/v1/chat', {
                    model: "deepseek-chat",
                    messages: [{ role: "user", content: ctx.message.text }],
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                ctx.reply(response.data.choices[0].message.content);
            } catch (error) {
                console.error("DeepSeek API Error:", error.response?.data || error.message);
                ctx.reply("Извините, произошла ошибка при обработке запроса");
            }
        }
    });
}

module.exports = setupDeepSeekBot;