module.exports = (ctx, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] Пользователь ${ctx.from.id} (${ctx.from.username || 'без username'}) вызвал: ${ctx.message?.text || 'callback'}`);
    return next();
};