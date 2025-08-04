const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
require('dotenv').config({ override: true });

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const meditationMenu = Markup.keyboard([
    ['🔊 Аудиомедитация']
]).resize();

bot.use((ctx, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] Пользователь ${ctx.from.id} вызвал: ${ctx.message?.text || 'callback'}`);
    return next();
});

bot.command('meditation', (ctx) => {
    ctx.reply("Выберите тип медитации:", meditationMenu);
});

bot.hears('🔊 Аудиомедитация', async (ctx) => {
    try {
        ctx.replyWithChatAction('upload_audio');

        const { data } = await axios.get(
            `https://freesound.org/apiv2/search/text/`,
            {
                params: {
                    query: 'meditation',
                    filter: 'duration:[60 TO 300]',
                    fields: 'id,name,previews,username,license',
                    token: process.env.API_KEY
                },
                timeout: 10000
            }
        );
        if (!data.results || data.results.length === 0) {
            return ctx.reply('К сожалению, не найдено подходящих медитаций 😔');
        }

        const sound = data.results.find(s => s.previews && s.previews['preview-hq-mp3']);

        if (!sound) {
            return ctx.reply('Не удалось найти доступное аудио 😢');
        }

        await ctx.replyWithAudio(sound.previews['preview-hq-mp3'], {
            title: sound.name || 'Медитация',
            performer: sound.username || 'Неизвестный автор',
            caption: `Лицензия: ${sound.license || 'не указана'}`
        });

    } catch (error) {
        console.error('Ошибка при запросе к FreeSound:', error);

        if (error.response) {
            ctx.reply(`Ошибка API: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
            ctx.reply('Не удалось подключиться к серверу медитаций. Попробуйте позже ⏳');
        } else {
            ctx.reply('Произошла непредвиденная ошибка 😟');
        }
    }
});



bot.launch()
    .then(() => console.log('Бот успешно запущен!'))
    .catch(err => console.error('Ошибка запуска бота:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));