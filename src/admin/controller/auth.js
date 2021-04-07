const Base = require('./base.js');

module.exports = class extends Base {
  async loginAction() {
    const username = this.post('account');
    const password = this.post('pwd');

    const admin = await this.model('admin').where({ username: username }).find();
    if (think.isEmpty(admin)) {
      return this.fail('用户名不存在', '');
    }

    if (think.md5(password + '' + admin.password_salt) !== admin.password) {
      return this.fail('密码不正确', '');
    }

    // 更新登录信息
    await this.model('admin').where({ id: admin.id }).update({
      last_login_time: parseInt(Date.now() / 1000),
      last_login_ip: this.ctx.ip
    });

    const TokenSerivce = this.service('token', 'admin');
    const sessionKey = await TokenSerivce.create({
      user_id: admin.id
    });

    if (think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }

    // const userInfo = {
    //   userid: admin.id,
    //   name: admin.username,
    //   avatar: admin.avatar,
    //   admin_role_id: admin.admin_role_id
    // };

    return this.success({ token: sessionKey, currentAuthority: "admin" });
  }

  async registerAction() {
    const username = this.post('username');
    const password = this.post('password');

  }
};
