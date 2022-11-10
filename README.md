# Alfred-Workflow-QR

生成和识别 QR 码的 Alfred Workflow。

[⤓ 下载 Workflow](https://github.com/CYJB/Alfred-Workflow-QR/releases/latest/download/qr.alfredworkflow)

## 使用方法

使用 `qr` 关键字生成指定文本的二维码，并使用默认方式打开。

![Alfred workflow qr](images/qr.png)

使用 `qrs` 关键字截屏二维码部分，识别结果会复制到剪贴板，并给出提示。

## 相关依赖

生成二维码依赖 [node](https://nodejs.org/)（>=10.13.0）和 [imagemagick](https://www.imagemagick.org/)，识别二维码依赖 [zbar](https://zbar.sourceforge.net/)。

可以参见官方网站的安装方式，或者使用 [Homebrew](https://brew.sh/) 安装：

```bash
brew install node
brew install imagemagick
brew install zbar
```
