'use strict';

module.exports = {
  /**
   * 实现一个内部调用的curl
   * @returns 
   */
  async custom_curl(url, options = {}) {

    if (!options.headers) {
      options.headers = {};
    }
    if (!options.headers['x-request-id']) {
      options.headers['x-request-id'] = this.track.id;
    }
    if (!options.headers['x-request-from']) {
      options.headers['x-request-from'] = this.track.from;
    }
    if (!options.retry) {
      options.retry = 1;
    }
    if (!options.retryDelay) {
      options.retryDelay = 50;
    }
    if (!options.method || options.method.toUpperCase() !== 'POST' || !options.isRetry) {
      options.isRetry = function(res) {
        return !res.status || res.status < 200 || [408, 502, 504].indexOf(parseInt(res.status)) > -1;
      }
    }
    if (!options.timeout) {
      options.timeout = [1000, 5000];
    }
    if (!options.contentType && options.data && typeof options.data == 'object') {
      options.contentType = 'json';
    }
    if (!options.dataType && options.contentType === 'json') {
      options.dataType = 'json';
    }

    try {
      const res = await this.curl(url, options);
      if (!res.status || res.status >= 400) {
        const level = typeof res.status === 'undefined' || res.status >= 500 ? 'error' : 'warn';
        const msg = {
          event: 'req_err',
          res: res,
          req: {url, ...options}
        };
        this.custom_log(level, `[request] ${JSON.stringify(msg)}`);
      }
      return res;
    } catch (err) {
      const msg = {
        event: 'client_err',
        req: {url, ...options},
        err: {name: err.name, message: err.message, stack: err.stack, code: err.code}

      };
      this.custom_log('error', `[request] ${JSON.stringify(msg)}`);
      throw err;
    }
  },

  custom_log(level, msg, channel = 'monitor') {
    try {
      this.getLogger(channel)[level](msg);
    } catch (error) {
      this.app.logger[level](msg);
    }
  }
};
