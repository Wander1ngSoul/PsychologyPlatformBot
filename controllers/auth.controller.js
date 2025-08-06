const authService = require('../services/auth.service');
const { Markup } = require('telegraf');

class AuthController {
    constructor() {
        this.startRegistration = this.startRegistration.bind(this);
        this.handleRegistrationStep = this.handleRegistrationStep.bind(this);
    }

    async startRegistration(ctx) {
        try {
            ctx.session = ctx.session || {};
            ctx.session.registration = {
                step: 'email',
                telegramId: ctx.from.id
            };
            await ctx.reply('Давайте зарегистрируем вас! Введите ваш email:');
        } catch (err) {
            console.error('Error in startRegistration:', err);
            await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
        }
    }

    async handleRegistrationStep(ctx) {
        try {
            if (!ctx.session?.registration) {
                return await ctx.reply('Пожалуйста, начните регистрацию с помощью команды /start');
            }

            const session = ctx.session.registration;

            if (session.step === 'email') {
                const email = ctx.message?.text;
                if (!this.validateEmail(email)) {
                    return await ctx.reply('Пожалуйста, введите корректный email:');
                }

                ctx.session.registration = {
                    ...session,
                    step: 'password',
                    email
                };
                await ctx.reply('Отлично! Теперь придумайте пароль:');
            }
            else if (session.step === 'password') {
                const password = ctx.message?.text;
                if (!password || password.length < 6) {
                    return await ctx.reply('Пароль должен быть не менее 6 символов. Попробуйте еще раз:');
                }

                const userId = await authService.registerUser(
                    ctx.from.username || `user_${ctx.from.id}`,
                    ctx.session.registration.email,
                    password
                );

                await authService.linkTelegramToUser(userId, ctx.from.id);
                delete ctx.session.registration;

                await ctx.reply('Регистрация завершена! Теперь вы можете войти на сайт.',
                    Markup.keyboard([['🔊 Аудиомедитация']]).resize());
            }
        } catch (err) {
            console.error('Error in handleRegistrationStep:', err);
            await ctx.reply('Произошла ошибка при регистрации. Попробуйте позже.');
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

module.exports = new AuthController();