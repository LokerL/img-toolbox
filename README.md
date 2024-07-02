<div align="center">
  <h1>Img Toolbox</h1>
</div>

# 功能 Feature

- [x] 格式转换
- [x] 添加水印
- [x] 图片调整
- [ ] 图片裁剪
- [ ] 图片旋转
- [ ] 图片拼接
- [ ] 图片分割
- [ ] OCR
- [ ] ...

# 安装 Install

## 安装包

[Releases](https://github.com/LokerL/img-toolbox/releases)

[Action](https://github.com/LokerL/img-toolbox/actions) Mac和linux系统可以从这里找到安装包

## 源码

```bash
git clone https://github.com/LokerL/img-toolbox.git

cd img-toolbox

npm install

npm run dev
```

## 使用 Usage

### 格式转换

1. 点击`选择`按钮选择需要转换的图片
2. `下拉选择`需要转换的格式
3. 点击`输出文件夹`选择转换后的图片保存位置
4. 点击`转换`按钮

### 添加水印

1. 点击`选择`按钮选择需要添加水印的图片
2. 点击`水印`按钮选择水印图片
3. 点击`输出文件夹`选择添加水印后的图片保存位置
4. 点击`处理`按钮

> 水印：
> 1. 点击左上角➕添加一个水印，点击右上角`删除按钮`删除全部水印
> 2. `启用`：启用水印后才可以使用该水印
> 3. `类型`：分为`图片水印`和`文字水印`
> 4. `资源`：图片水印**选择**作为水印的图片路径，文字水印**输入**作为水印的文字
> 5. `上边距`：水印距离图片上边的距离
> 6. `左边距`：水印距离图片左边的距离
> 7. `位置`：水印在图片中的位置。可选：`左上` `右上` `左下` `右下` `居中`（选择上下边距时此项不会生效）
> 8. `大小`：文字水印的字体大小DPI，图片水印的长度和宽度

### 使用截图
![微信截图_20240628125616](https://github.com/LokerL/img-toolbox/assets/44148627/076bb40e-37e6-4348-830e-14459b286cbb)
![微信截图_20240628125635](https://github.com/LokerL/img-toolbox/assets/44148627/0254abda-b50d-4482-adcf-f0f1dbfe69ad)
