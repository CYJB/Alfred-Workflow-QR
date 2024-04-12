const app = Application.currentApplication();
app.includeStandardAdditions = true;

/**
 * 标准化指定路径。
 * @param {string} path 要标准化的路径
 */
function normalize(path) {
  // 替换环境变量
  console.log('path', path)
  path = path.replace(/\$([\w_][\w\d_]*)/, (_, name) => app.systemAttribute(name) || '');
  // 标准化字符串
  return $(path).stringByStandardizingPath.js;
}

module.exports = { normalize };
