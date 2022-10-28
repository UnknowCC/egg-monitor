'use strict';

// Http错误中间件
module.exports = () => async (ctx, next) => {

  let level = 'info';
  let msg = {
    client_ip: ctx.ip
  };

  try {
    await next(ctx);

    const cost = Date.now() - ctx.starttime;
    if (ctx.status >= 400) {
      level = ctx.status >= 500 ? 'error' : 'warn';
      msg = {
        event: 'rep_err',
        res: ctx.body,
        ...msg,
      }
    } else if (cost > 1000) {
      level = 'warn';
      msg = {
        event: 'rsp_slow',
        ...msg,
      }
    }

  } catch (err) {
    level = typeof ctx.status === 'undefined' || ctx.status >= 500 ? 'error' : 'warn';
    msg = {
      event: 'rsp_err',
      err: {name: err.name, message: err.message, stack: err.stack, code: err.code},
      ...msg,
    };

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

  if (['warn', 'error'].indexOf(level) > -1) {
    ctx.custom_log(level, `[response] ${JSON.stringify(msg)}`);
  }
};
