# egg-monitor

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-monitor.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-monitor
[travis-image]: https://img.shields.io/travis/eggjs/egg-monitor.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-monitor
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-monitor.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-monitor?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-monitor.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-monitor
[snyk-image]: https://snyk.io/test/npm/egg-monitor/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-monitor
[download-image]: https://img.shields.io/npm/dm/egg-monitor.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-monitor

<!--
Description here.
-->
## feature
1、新增全局中间件，会记录异常的请求，主要是400以上的错误日志
2、封装了一个curl请求

## Install

```bash
$ npm i egg-monitor --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.monitor = {
  enable: true,
  package: 'egg-monitor',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.monitor = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
