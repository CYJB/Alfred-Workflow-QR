#! /usr/bin/osascript -l JavaScript

const app = Application.currentApplication();
app.includeStandardAdditions = true;

// 引入 require 方法。
let require;
{
  const requirePath = './lib/require.js';
  const handle = app.openForAccess(requirePath);
  const content = app.read(handle);
  app.closeAccess(requirePath);
  require = eval(content)(app);
}

const { detectQRCode } = require('./lib/qr');

function run(argv) {
  // 截屏二维码
  app.doShellScript('screencapture -x -i temp.png')
  // 识别 QR 文件
  const result = detectQRCode('temp.png');
  // 删除二维码截屏
  app.doShellScript('rm -f temp.png')
  if (result) {
    return result;
  } else {
    return '未识别到二维码'
  }
}
