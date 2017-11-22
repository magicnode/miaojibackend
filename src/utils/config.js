const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

let APIV3
// 本地测试
// APIV3 = 'http://192.168.0.185:8080/quandiExpressSiteManager'
// 仝舟本地测试
// APIV3 = 'http://192.168.1.112:8080'
// 线上
APIV3 = 'http://app.quandikeji.com:8288/quandiExpressSiteManager'

// 生产环境时api固定为线上url
if (process.env.NODE_ENV !== 'development') {
  APIV3 = 'http://app.quandikeji.com:8288/quandiExpressSiteManager'
}

let APIV4 = 'http://app.quandikeji.com/WeChatService'

module.exports = {
  name: '妙寄后台管理系统',
  prefix: '妙寄后台',
  footerText: '妙寄 后台 © 2017 圈嘀科技',
  localPrefix: 'miaojipc_',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7000'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  api: {
    userLogin: `${APIV3}/signIn`, // 登陆
    userLogout: `${APIV1}/user/logout`, // 登出

    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,

    wxuser: `${APIV3}/received`, // 微信用户明细
    wxusers: `${APIV3}/wechatuser`, // 微信用户

    storeusers: `${APIV3}/store`, // 门店用户

    communications: `${APIV3}/communicationdata`, // 通信数据

    income: `${APIV3}/income`, // 收入
    expend: `${APIV3}/expenditure`, // 支出
    normal: `${APIV3}/regularMail?expresstype=0`, // 普通件
    collect: `${APIV3}/regularMail?expresstype=1`, // 到付件
    collection: `${APIV3}/regularMail?expresstype=2`, // 代收件

    posts: `${APIV1}/posts`,
    user: `${APIV1}/user/:id`,
    dashboard: `${APIV1}/dashboard`,

    topups: `${APIV3}/rechargeRecord`, // 充值记录
    withdraws: `${APIV3}/extractionamount`, // 提现记录

    orders: `${APIV3}/expressStatus`, // 运单管理
    order: `${APIV3}/expressStatus`,

    // 二维码推广接口
    qr: {
      create: `${APIV4}/api/qr/createQr`,
      all: `${APIV4}/api/qr/getQrAll`,
      show: `${APIV4}/api/selectQrById`,
      update: `${APIV4}/api/qr/modWxQrById`,
      del: `${APIV4}/api/delQrById`,
    },
    // 充值消费接口
    consume: {
      query: `${APIV3}/paymentOrder`, // 分页查询
    },

    // 黑名单接口
    blacklist: {
      all: `${APIV3}/blackList`,
      add: `${APIV3}/insertBlackList`,
      update: `${APIV3}/updateBlackList`,
      showSiteName: `${APIV3}/idUser`,
    },

  },
}
