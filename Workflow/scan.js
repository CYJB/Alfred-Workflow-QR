#! /usr/bin/osascript -l JavaScript

const app = Application.currentApplication();
app.includeStandardAdditions = true;

function require(path) {
  path += '.js';
  const handle = app.openForAccess(path);
  const content = app.read(handle);
  app.closeAccess(path);
  const exports = {};
  (function (__content__, exports) {
    eval(__content__);
  })(content, exports);
  return exports;
}

const { checkDependencies } = require('utils/dependencies');

/**
 * 依赖的命令
 */
const dependencies = [
  {
    name: 'zbarimg',
    installCommand: 'brew install zbar'
  },
]

function run(argv) {
  if (!checkDependencies(app, dependencies)) {
    // 缺少依赖，退出
    return
  }
  // 截屏二维码
  app.doShellScript('screencapture -x -i temp.png')
  try {
    // 识别 QR 文件
    // zbarimg 编译方法：下载 https://github.com/npinchot/zbar
    // python setup.py install
    const result = app.doShellScript('zbarimg temp.png')
    const idx = result.indexOf(':')
    if (idx >= 0) {
      return result.substr(idx + 1)
    } else {
      return result
    }
  } catch (e) {
    return '未识别到二维码'
  } finally {
    // 删除二维码截屏
    app.doShellScript('rm -f temp.png')
  }
}
