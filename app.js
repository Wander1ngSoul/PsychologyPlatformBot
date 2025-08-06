const { Telegraf } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const dbService = require('./services/db.service');
const setupRoutes = require('./routes/bot.routes');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const localSession = new LocalSession({
    database: 'sessions.json',
    property: 'session'
});

bot.use(localSession.middleware());

setupRoutes(bot);

(async () => {
    try {
        await dbService.executeQuery('SELECT 1');
        console.log('Database connection established');

        await bot.launch();
        console.log('Bot started');

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    } catch (err) {
        console.error('Application startup failed:', err);
        process.exit(1);
    }
})();