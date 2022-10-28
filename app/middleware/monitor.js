'use strict';

// Http错误中间件
module.exports = (options) => async (ctx, next) => {

  let level = 'info';
  let msg = {
    event: 'debug',
    req: ctx.request,
    client_ip: ctx.ip
  };

  try {

    await next(ctx);

    if (ctx.status >= 400) {
      level = ctx.status >= 500 ? 'error' : 'warn';
      msg.event = 'req_err';
      msg.res = {res: ctx.body, status: ctx.status};
    } else {
      const cost = Date.now() - ctx.starttime;
      if (cost > 1000) {
        level = 'warn';
        msg.event = 'req_slow';
      }
      msg.res = {body: ctx.body, status: ctx.status}
    }
  } catch (err) {
    level = typeof ctx.status === 'undefined' || ctx.status >= 500 ? 'error' : 'warn';
    msg.event = 'rsp_err';
    msg.err = {name: err.name, message: err.message, stack: err.stack, code: err.code};

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

  if (options.logAllRequest || ['warn', 'error'].indexOf(level) > -1) {
    ctx.custom_log(level, `[response] ${JSON.stringify(msg)}`);
  }
};
