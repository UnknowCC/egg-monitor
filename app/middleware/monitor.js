'use strict';

// Http错误中间件
module.exports = () => async (ctx, next) => {
  try {
    await next(ctx);
  } catch (err) {
    const level = typeof ctx.status === 'undefined' || ctx.status >= 500 ? 'error' : 'warn';
    const msg = {
      request_id: ctx.track.id,
      request_from: ctx.track.from,
      message: err.message,
      code: err.code,
      stack: err.stack
    };
    try {
      ctx.getLogger('monitor')[level]('[monitor] %j', msg);
    } catch (error) {
      ctx.app.logger[level]('[monitor] %j', msg);
    }

    // 构造响应
    const body = {
      require_id: ctx.track.id,
      msg: err.tips ||  err.message || '服务未知错误',
      from: ctx.app.config.fullname,
    };

    // 错误帮助
    if (err.help) {
      body.help = err.help;
    }

    // 非正式环境，直接显示错误
    if (ctx.app.config.debug) {
      body.err = {
        message: err.message,
        code: err.code,
        stack: err.stack,
      };
    }
    // 响应错误内容
    ctx.status = err.status || 500;
    ctx.body = body;
  }
};
