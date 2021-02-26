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
    console.log(code, 'res')

    const res = await axios.get(`https://open.douyin.com/oauth/access_token?client_key=awdh9y4t36b0b4fx&client_secret=d07c7a010d8faab0641a8df70ec1db6e&code=${code}&grant_type=authorization_code`)
    console.log(res, 'res')
    return this.success(res.data.data);
  }
};
