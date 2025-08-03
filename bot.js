const { Telegraf } = require('telegraf');
require('dotenv').config({ path: '.env' });

if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.API_KEY) {
    console.error('Ошибка: Не найдены необходимые переменные окружения!');
    process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

require('./api.js')(bot);

bot.start((ctx) => ctx.reply('Привет! Я бот с искусственным интеллектом. Просто напиши мне что-нибудь.'));
bot.help((ctx) => ctx.reply('ℹЭто бот с интеграцией AI. Просто задай вопрос в чат.'));

bot.launch()
    .then(() => console.log('🤖 Бот успешно запущен!'))
    .catch(err => {
        console.error('🚨 Ошибка запуска бота:', err);
        process.exit(1);
    });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));