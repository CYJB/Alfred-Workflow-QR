/**
 * 检查命令依赖是否可用。
 */
exports.checkDependencies = function (app, dependencies) {
  const notValidDeps = dependencies.filter(dep => {
    try {
      if (app.doShellScript('command -v ' + dep.name)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return true;
    }
  })
  // 所有依赖都已正常安装
  if (notValidDeps.length == 0) {
    return true;
  }
  // 提示用户自动安装还是手动安装
  const installCommand = notValidDeps.map(dep => dep.installCommand).join('\n');
  const message = `缺少依赖库: ${notValidDeps.map(dep => dep.name).join(', ')}，请问是自动安装还是使用下列命令手动安装依赖？\n${installCommand}`;
  const okButton = '自动安装';
  const cancelButton = '退出，我要手动安装';
  const reply = app.displayAlert('缺少依赖库', {
    message,
    as: "warning",
    buttons: [cancelButton, okButton],
    defaultButton: okButton,
    cancelButton,
  })
  if (reply.buttonReturned == cancelButton) {
    return false;
  }
  // 自动执行安装命令
  const terminal = Application('Terminal');
  terminal.activate();
  terminal.doScript(installCommand);
  const targetWindow = terminal.windows[0];
  const targetTab = targetWindow.tabs[0];
  // 等待命令执行结束
  while (targetTab.busy()) {
    delay(1);
  }
  targetWindow.close();
  return true;
}
