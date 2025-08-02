const { Telegraf } =  require('telegraf')
require('dotenv').config({override: true});

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.start((ctx) => {
    ctx.reply('Привет! Я учебный бот. Используй /help для списка команд')
});

bot.help((ctx) => {
    ctx.reply('Список доступных команд: \nstart - начать общение\nhelp - помощь\n/courses - курсы');
});

bot.on('text', (ctx) => {
    ctx.reply('Пока я понимаю только команды. Попробуй команду /help');
});

bot.launch();
console.log('Bot started');