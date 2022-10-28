'use strict';

/**
 * egg-monitor default config
 * @member Config#monitor
 * @property {String} SOME_KEY - some description
 */
exports.monitor = {
  logAllRequest: false,
};

exports.customLogger = {
  monitor: {
    file: 'egg-monitor.log'
  }
}