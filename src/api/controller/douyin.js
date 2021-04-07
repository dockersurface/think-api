const Base = require('./base.js');
const axios = require('axios');
var FormData = require('form-data');
let request = require('request');
let fs = require('fs');
let Promise = require('bluebird');
let path = require('path');
const fetch = require("node-fetch");
const http = require('http')

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
    // const clientKey = "awdh9y4t36b0b4fx";
    // const clientSecret = "d07c7a010d8faab0641a8df70ec1db6e";
    const clientKey = "awrxyz31awr5mrev";
    const clientSecret = "bded53fde01b85eb99e3c13189ca9a9e";
    const code = this.get('code');

    const res = await axios.get(`https://open.douyin.com/oauth/access_token?client_key=${clientKey}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`)
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
        client_key: userInfo.client_key,
        open_id: userInfo.open_id,
        avatar: userInfo.avatar || '',
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickname,
        province: userInfo.province,
        city: userInfo.city,
        country: userInfo.country,
        union_id: userInfo.union_id,
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


  async publishVideoAction() {
    // const open_id = "920ddb7e-0234-4f89-9f57-f2eadaa6d696";
    // const access_token = "act.f95cba307b939ca6f63509b9b269a24fKfWbLgjMugSNigIfrO8QjRVZkxH7";
    const open_id = this.get("open_id");
    const access_token = this.get("access_token");
    const video = this.get("video")

    const uploadurl = `https://open.douyin.com/video/upload/?open_id=${open_id}&access_token=${access_token}`

    // let blob = await fetch(video).then(r => r.blob());
    const blob = await request.get(video)
    var bodyFormData = new FormData();
    bodyFormData.append('video', blob, {
      filename: '1614230553783779.mp4',
      contentType: 'video/mp4',
    }); 
    const res = await axios({
      method: 'post',
      url: uploadurl,
      data: bodyFormData,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${bodyFormData._boundary}`,
      }
    });

    const { video_id } = res.data.data.video;
    // console.log(bodyFormData, '1234', video_id)

    // 创建
    const createUrl = `https://open.douyin.com/video/create/?open_id=${open_id}&access_token=${access_token}`
    const create_resp = await axios({
      method: 'post',
      url: createUrl,
      data: {
        video_id,
        text: "。。。。。。"
      },
      headers: {
        'Content-Type': `application/json`,
      }
    });

    return this.success(res.data.data);
  }
};
