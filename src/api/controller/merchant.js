const Base = require('./base.js');
module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';
    const categoryId = this.get('category_id');
    const isOnSale = this.get('is_on_sale');
    const whereMap = {name: ['like', `%${name}%`]};

    if (categoryId) {
      whereMap['category_id'] = categoryId;
    }

    if (isOnSale) {
      whereMap['is_on_sale'] = isOnSale;
    }
    const model = this.model('goods');
    const data = await model.where(whereMap).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
  }

  async getPageInfoAction() {
    const mid = this.get('m');
    const vid = this.get('vid')
    const model = this.model('merchant_video');
    const data = await model.where({vid, mid}).find();
    if(data.status == 0) { // 运行中 和 次数够用

    }

    await model.where({vid, mid}).update({
      scan_count: data.scan_count+1,
    });

    return this.success(data);
  }

  // 删除轮播图片
  async deleteGoodsGalleryAction() {
    const id = this.post('id');
    await this.model('goods_gallery').where({id: id}).limit(1).delete();
    return this.success();
  }

  async addGoodsGalleryAction() {
    const goodsId = this.post('goods_id');
    const galleryUrl = this.post('gallery_url');

    this.model('goods_gallery').add({goods_id: goodsId, img_url: galleryUrl, sort_order: 5});

    return this.success();
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();

    let product = '';
    if (values.id) {
      product = await this.model('product').where({ goods_id: values.id }).select();
    }

    if (product.length !== 0) {
      await this.model('product').where({goods_id: values['id']}).update({
        goods_sn: values['id'],
        goods_number: values['goods_number'],
        retail_price: values['retail_price']
      });
    } else {
      await this.model('product').add({
        goods_id: values['id'],
        goods_sn: values['id'],
        goods_number: values['goods_number'],
        retail_price: values['retail_price']
      });
    }

    const model = this.model('goods');
    values.is_on_sale = values.is_on_sale ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    values.is_hot = values.is_hot ? 1 : 0;

    if (values['id']) {
      await model.where({id: values['id']}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    await this.model('goods').where({id: id}).limit(1).delete();
    // TODO 删除图片
    await this.model('goods_gallery').where({goods_id: id}).delete();

    return this.success();
  }
};
