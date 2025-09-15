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

const { normalize, join } = require('./lib/path');
const { generateQRCode } = require('./lib/qr');

function run(argv) {
  // QR 码的生成路径，在 Workflow Configuration 中配置
  ObjC.import('stdlib');
  let filePath;
  if ($.getenv('directory') && $.getenv('filename')) {
    // 优先使用 configuration 中的配置
    filePath = join(normalize($.getenv('directory')) + '/' + $.getenv('filename'));
  } else {
    filePath = normalize($.getenv('qrPath'));
  }
  // QR 码的文本内容，移除前后的空白
  const text = argv[0].trimStart().trimEnd();
  generateQRCode(filePath, text, text);
  return filePath;
}
