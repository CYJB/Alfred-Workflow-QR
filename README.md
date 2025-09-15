# Alfred-Workflow-QR

生成和识别 QR 码的 Alfred Workflow。

**需要 macOS 10.15+。**

- [⤓ 下载 Workflow (Alfred 5.5+)](https://github.com/CYJB/Alfred-Workflow-QR/releases/latest/download/qr.alfredworkflow)
- [⤓ 下载 Workflow (Alfred 旧版本)](https://github.com/CYJB/Alfred-Workflow-QR/releases/download/v1.0.1/qr.alfredworkflow)

## 使用方法

使用 `qr` 关键字生成指定文本的二维码，会直接使用 Image View（需要 Alfred 5.5 或更高）显示二维码，使用 `Esc` 隐藏，也可以使用回车或 `⌘` `o` 在默认应用中打开图片。

![Alfred workflow qr](images/qr.png)

生成的二维码路径和文件名可以在 Alfred 配置中修改，默认会生成在临时目录。

![Alfred workflow 配置](images/configuration.png)

使用 `qrs` 关键字截屏二维码部分，识别结果会复制到剪贴板，并给出提示。
