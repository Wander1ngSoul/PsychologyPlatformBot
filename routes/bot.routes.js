const authController = require('../controllers/auth.controller');
const meditationController = require('../controllers/meditation.controller');
const loggerMiddleware = require('../middlewares/logger.middleware');

module.exports = function setupRoutes(bot) {
    bot.use(loggerMiddleware);

    bot.command('start', authController.startRegistration);
    bot.command('register', authController.startRegistration);
    bot.command('meditation', meditationController.sendMeditation);

    bot.hears('🔊 Аудиомедитация', meditationController.sendMeditation);
    bot.on('text', authController.handleRegistrationStep);

    bot.catch((err, ctx) => {
        console.error('Bot error:', err);
        ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
    });
};