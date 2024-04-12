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

const { normalize } = require('./lib/path');
const { generateQRCode } = require('./lib/qr');

function run(argv) {
  // QR 码的生成路径，在 Workflow Configuration 中配置
  const filePath = normalize(argv[0]);
  // QR 码的文本内容，移除前后的空白
  const text = argv[1].trimStart().trimEnd();
  generateQRCode(filePath, text, text);
  // 使用 finder 打开可能会报无权限的错误，改为使用 open 命令。
  app.doShellScript(`open "${filePath}"`);
}
