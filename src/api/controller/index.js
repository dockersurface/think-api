const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const banner = await this.model('ad').where({enabled: 1}).select();
    // const channel = await this.model('channel').order({sort_order: 'asc'}).select();
    const channel = await this.model('category').order({sort_order: 'asc'}).select();
    const newGoods = await this.model('goods').field(['id', 'name', 'primary_pic_url', 'retail_price']).where({is_new: 1}).limit(4).select();
    const hotGoods = await this.model('goods').field(['id', 'name', 'primary_pic_url', 'retail_price', 'goods_brief']).where({is_hot: 1}).limit(3).select();
    const brandList = await this.model('brand').where({is_new: 1}).order({new_sort_order: 'asc'}).limit(4).select();
    const topicList = await this.model('topic').limit(3).select();

    const categoryList = await this.model('category').where({parent_id: 0, name: ['<>', '推荐']}).select();

    return this.success({
      banner,
      channel: channel.filter((item) => item.parent_id !== 0).filter((item, i) => i < 5),
      brandList,
      topicList,
      categoryList,
      newGoodsList: newGoods,
      hotGoodsList: hotGoods
      // newCategoryList
    });
  }
};
