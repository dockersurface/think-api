const Base = require('./base.js');
const axios = require('axios');

module.exports = class extends Base {
  /**
   * 获取收货地址的详情
   * @return {Promise} []
   */
  async clientTokenAction() {
    const client_key = this.get('client_key');
    const client_secret = this.get('client_secret');
    const grant_type = this.get('grant_type');

    const res = await axios.get(`https://open.douyin.com/oauth/client_token?client_key=${client_key}&client_secret=${client_secret}&grant_type=${grant_type}`)
    return this.success(res.data.data);
  }

  async getTicketAction() {
    const access_token = this.get('access_token');

    const res = await axios.get(`https://open.douyin.com/js/getticket?access_token=${access_token}`)
    return this.success(res.data.data);
  }

  async getAccessTokenAction() {
    const code = this.get('code');

    const res = await axios.get(`https://open.douyin.com/oauth/access_token?client_key=awdh9y4t36b0b4fx&client_secret=d07c7a010d8faab0641a8df70ec1db6e&code=${code}&grant_type=authorization_code`)
    return this.success(res.data.data);
  }

  async getUserInfoAction() {
    const open_id = this.get('open_id');
    const access_token = this.get("access_token");

    const res = await axios.get(`https://open.douyin.com/oauth/userinfo?open_id=${open_id}&access_token=${access_token}`)
    return this.success(res.data.data);
  }

  async getUserInfoAction() {
    const open_id = this.get('open_id');
    const access_token = this.get("access_token");
    const clientIp = this.ctx.ip;

    const res = await axios.get(`https://open.douyin.com/oauth/userinfo?open_id=${open_id}&access_token=${access_token}`)
    const userInfo = res.data.data;
    if (think.isEmpty(userInfo)) {
      return this.fail('登录失败');
    }

    // 根据openid查找用户是否已经注册
    let userId = await this.model('user_douyin').where({ open_id: userInfo.open_id }).getField('id', true);
    if (think.isEmpty(userId)) {
      // 注册
      userId = await this.model('user_douyin').add({
        register_time: parseInt(new Date().getTime() / 1000),
        register_ip: clientIp,
        mobile: '',
        open_id: userInfo.open_id,
        avatar: userInfo.avatar || '',
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickname,
        province: userInfo.province,
        city: userInfo.city,
        country: userInfo.country,
        union_id: userInfo.union_id,
        client_key: userInfo.client_key
      });
    }

    // 查询用户信息
    const newUserInfo = await this.model('user_douyin').field(['id', 'nickname', 'gender', 'avatar']).where({ id: userId }).find();
    // 更新登录信息
    await this.model('user_douyin').where({ id: userId }).update({
      last_login_time: parseInt(new Date().getTime() / 1000),
      last_login_ip: clientIp
    });

    if (think.isEmpty(newUserInfo)) {
      return this.fail('登录失败');
    }

    return this.success(res.data.data);
  }

};
