module.exports = class extends think.Logic {
  loginAction() {
    this.allowMethods = 'post';
    this.rules = {
      account: { required: true, string: true },
      pwd: { required: true, string: true }
    };
  }
};
