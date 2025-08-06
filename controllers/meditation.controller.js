const freeSoundService = require('../services/freesound.service');

class MeditationController {
    async sendMeditation(ctx) {
        try {
            await ctx.replyWithChatAction('upload_audio');
            const data = await freeSoundService.searchMeditation();

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
            console.error('Ошибка медитации:', error);
            await this.handleMeditationError(ctx, error);
        }
    }

    async handleMeditationError(ctx, error) {
        if (error.response) {
            await ctx.reply(`Ошибка API: ${error.response.status} ${error.response.statusText}`);
        } else if (error.request) {
            await ctx.reply('Не удалось подключиться к серверу медитаций. Попробуйте позже ⏳');
        } else {
            await ctx.reply('Произошла непредвиденная ошибка 😟');
        }
    }
}

module.exports = new MeditationController();