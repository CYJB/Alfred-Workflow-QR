#! /usr/bin/osascript -l JavaScript

ObjC.import("AppKit");
ObjC.import("Cocoa");
ObjC.import("CoreImage");
ObjC.import("Foundation");

require('./ciimage');

/** 标签的文本大小。 */
const labelFontSize = 28;
/** 二维码的边距。 */
const margin = 10;
/** 二维码的放大倍数。 */
const scale = 8;

/**
 * 生成二维码
 * @version macOS 10.15+
 * @param {string} path 二维码的保存路径。
 * @param {string} text 要生成二维码的文本。
 * @param {string | undefined} label 二维码的标签。
 */
function generateQRCode(path, text, label) {
  const qrImage = scaleImage(generateQRImage(text), scale);
  const qrSize = qrImage.extent.size.width;
  let imageWidth = qrSize + margin * 2;
  let imageHeight = imageWidth;
  let labelImage;
  if (label) {
    labelImage = generateLabel(label, qrSize, labelFontSize);
    imageHeight += labelImage.extent.size.height + margin;
  }

  // 准备绘图
  const colorSpace = $.CGColorSpaceCreateDeviceGray();
  const bitmapContext = $.CGBitmapContextCreate(undefined, imageWidth, imageHeight, 8, 0, colorSpace, $.kCGImageAlphaNone);
  const context = $.CIContext.contextWithCGContextOptions(bitmapContext, undefined);

  // 绘制背景颜色
  const backgroundColor = $.CIColor.colorWithRedGreenBlue(1, 1, 1);
  const backgroundImage = $.CIImage.imageWithColor(backgroundColor);
  const fillRect = $.CGRectMake(0, 0, imageWidth, imageHeight);
  context.drawImageInRectFromRect(backgroundImage, fillRect, fillRect);
  // 绘制二维码
  context.drawImageInRectFromRect(qrImage, $.CGRectMake(margin, margin, qrSize, qrSize), qrImage.extent);
  // 绘制标签
  if (label) {
    const labelSize = labelImage.extent.size;
    context.drawImageInRectFromRect(labelImage, $.CGRectMake(margin, qrSize + margin * 2, labelSize.width, labelSize.height), labelImage.extent);
  }

  // 保存结果
  const cgImage = $.CGBitmapContextCreateImage(bitmapContext);
  $.CGContextRelease(bitmapContext);

  const image = $.NSImage.alloc.initWithCGImageSize(cgImage, $.NSMakeSize(imageWidth, imageHeight));
  const bitmapRep = $.NSBitmapImageRep.imageRepWithData(image.TIFFRepresentation);
  const pngData = bitmapRep.representationUsingTypeProperties($.NSPNGFileType, $());

  pngData.writeToFileAtomically(path, true);
}

/**
 * 识别二维码。
 * @version macOS 10.10+
 * @param {string} path 二维码的保存路径。
 * @returns 检测结果。
 */
function detectQRCode(path) {
  const data = $.NSData.dataWithContentsOfFile(path);
  if (!data.js) {
    return;
  }
  const nsImage = $.NSImage.alloc.initWithData(data);
  if (!nsImage.js) {
    return;
  }
  const image = $.CIImage.imageWithData(nsImage.TIFFRepresentation)
  const context = $.CIContext.context;
  const options = $.NSMutableDictionary.dictionary;
  options.setObjectForKey($.CIDetectorAccuracyHigh, $.CIDetectorAccuracy);
  const detector = $.CIDetector.detectorOfTypeContextOptions($.CIDetectorTypeQRCode, context, options);
  const features = detector.featuresInImage(image).js;
  if (features.length == 0) {
    return;
  }
  return features[0].messageString.js;
}

/**
 * 生成二维码图片。
 * @param {string} text 要生成二维码的文本。
 * @returns {CGImage} 图片。
 */
function generateQRImage(text) {
  const filter = $.CIFilter.filterWithName('CIQRCodeGenerator');
  filter.setDefaults;
  const data = $.NSString.stringWithString(text).dataUsingEncoding($.NSUTF8StringEncoding);
  filter.setInputMessage(data);
  filter.setInputCorrectionLevel('H');
  return filter.outputImage;
}

/**
 * 缩放指定的图片。
 * @param {CIImage} image 要缩放的图片。
 * @param {number} scale 缩放比例。
 * @returns {CIImage} 缩放后的图片。
 */
function scaleImage(image, scale) {
  return image.imageByApplyingTransform($.CGAffineTransformScale($.CGAffineTransformIdentity, scale, scale));
}

/**
 * 生成图片的标签。
 * @param {string} label 图片标签文本。
 * @param {number} maxWidth 标签的最大宽度。
 * @param {number} fontSize 标签的文本大小。
 * @returns {CIImage} 标签图片。
 */
function generateLabel(label, maxWidth, fontSize) {
  const attributes = $.NSMutableDictionary.dictionary;
  attributes.setObjectForKey($.NSFont.systemFontOfSize(fontSize), $.NSFontAttributeName);
  attributes.setObjectForKey($.NSColor.blackColor, $.NSForegroundColorAttributeName);
  // 允许换行 & 居中
  const paragraphStyle = $.NSMutableParagraphStyle.alloc.init;
  paragraphStyle.setLineBreakMode($.NSLineBreakByCharWrapping);
  paragraphStyle.setAlignment($.NSTextAlignmentNatural);
  attributes.setObjectForKey(paragraphStyle, $.NSParagraphStyleAttributeName);
  const string = $.NSString.stringWithString(label);
  // 计算标签尺寸。
  const size = string.boundingRectWithSizeOptionsAttributes($.CGSizeMake(maxWidth, Infinity),
    $.NSStringDrawingUsesLineFragmentOrigin, attributes).size;

  // 绘制到 NSImage
  const image = $.NSImage.alloc.initWithSize(size);
  image.lockFocus;
  string.drawWithRectOptionsAttributes($.CGRectMake(0, 0, size.width, size.height), $.NSStringDrawingUsesLineFragmentOrigin, attributes);
  image.unlockFocus;

  // 转换为 CIImage
  const result = $.CIImage.imageWithData(image.TIFFRepresentation)
  // CIImage 的宽度可能与 NSImage 不同（受视网膜屏影响），这里先简单的缩放下。
  return scaleImage(result, size.width / result.extent.size.width);
}

module.exports = { generateQRCode, detectQRCode };
