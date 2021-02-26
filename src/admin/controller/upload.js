const Base = require('./base.js');
const fs = require('fs');

const isDev = think.env === 'development';
const imgHost = isDev ? 'http://127.0.0.1:8360' : 'https://www.lunaflower.club';

module.exports = class extends Base {
  // 轮播图上传地址
  async galleryPicAction() {
    const galleryFile = this.file('gallery_url');
    if (think.isEmpty(galleryFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/upload/gallery/' + think.uuid(32) + '.jpg';
    const is = fs.createReadStream(galleryFile.path);
    const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'gallery_url',
      fileUrl: imgHost + filename
    });
  }

  // 商品主图上传地址
  async primaryPicAction() {
    const primaryFile = this.file('primary_url');
    if (think.isEmpty(primaryFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/upload/primaryPic/' + think.uuid(32) + '.jpg';
    const is = fs.createReadStream(primaryFile.path);
    const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'primary_url',
      fileUrl: imgHost + filename
    });
  }

  // 分类banner上传地址
  async categoryWapBannerPicAction() {
    const imageFile = this.file('wap_banner_url');
    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/upload/category/' + think.uuid(32) + '.jpg';

    const is = fs.createReadStream(imageFile.path);
    const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'wap_banner_url',
      fileUrl: imgHost + filename
    });
  }

  // 富文本图片上传地址
  async goodsDescPicAction() {
    const goodsDescFile = this.file('goods_desc_pic');
    if (think.isEmpty(goodsDescFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/upload/goodsDesc/' + think.uuid(32) + '.jpg';

    const is = fs.createReadStream(goodsDescFile.path);
    const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'goods_desc_pic',
      fileUrl: imgHost + filename
    });
  }

  // 富文本图片上传地址
  async swiperPicAction() {
    const swiperFile = this.file('swiper_pic');
    if (think.isEmpty(swiperFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/upload/swiper/' + think.uuid(32) + '.jpg';

    const is = fs.createReadStream(swiperFile.path);
    const os = fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'swiper_pic',
      fileUrl: imgHost + filename
    });
  }
};
