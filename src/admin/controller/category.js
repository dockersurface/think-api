const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const model = this.model('category');
    const data = await model.where({is_show: 1}).order(['sort_order ASC']).page(page, size).select();
    const categoryList = data.filter((item) => (
      item.parent_id === 0
    )).map((item) => ({
      ...item,
      children: data.filter((subitem) => subitem.parent_id === item.id)
    }));
    return this.success(categoryList);
  }

  async topCategoryAction() {
    const model = this.model('category');
    const data = await model.where({parent_id: 0}).order(['id ASC']).select();

    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('category');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();

    const model = this.model('category');
    // values.is_show = values.is_show ? 1 : 0;
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
    await this.model('category').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }
};
