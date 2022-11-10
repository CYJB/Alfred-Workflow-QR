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
const { standardizingPath } = require('utils/path');

/**
 * 依赖的命令
 */
const dependencies = [
  {
    name: 'node',
    installCommand: 'brew install node',
  },
  {
    name: 'magick',
    installCommand: 'brew install imagemagick',
  },
];

function run(argv) {
  if (!checkDependencies(app, dependencies)) {
    // 缺少依赖，退出
    return;
  }
  // QR 码的生成路径，在 Workflow Configuration 中配置
  const filePath = standardizingPath(app, argv[0]);

  const finder = Application('Finder');
  const fileExists = finder.exists(Path(filePath));

  // QR 码的文本内容，移除前后的空白
  const text = argv[1].trimStart().trimEnd();
  // qrcode 需要使用 stdin 输入 text
  // printf 是要把 % 转义
  app.doShellScript(`printf "${text.replace(/%/g, '%%')}" | npx qrcode -o "${filePath}"`);
  // 按 48 个字符每行作为标题
  let title = '';
  let idx = 0;
  let rowCount = 1;
  for (; text.length - idx > 48; idx += 48, rowCount++) {
    title += text.substr(idx, 48) + '\\n';
  }
  title += text.substr(idx);
  const titleHeight = rowCount * 20;
  // 将标题插入到图片上方
  app.doShellScript(`echo \'${title}\' | magick "${filePath}" -trim -font ArialUnicode label:@- -background White -size 0x${titleHeight} -trim -bordercolor White -border 5x5 +swap -gravity Center -append "${filePath}" `);
  // 打开 QR 文件
  if (fileExists) {
    // 文件之前已存在，直接打开即可
    finder.open(Path(filePath));
  } else {
    // 文件之前不存在，可能会报无权限的错误，因此改用 open 命令。
    app.doShellScript(`open "${filePath}"`);
  }
}
