/**
 * 标准化路径。
 */
exports.standardizingPath = function (app, path) {
  // 替换环境变量
  path = path.replace(/\$([\w_][\w\d_]*)/, (_,name) => app.systemAttribute(name) || '');
  // 标准化字符串
  return $(path).stringByStandardizingPath.js;
}
