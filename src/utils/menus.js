export default [
  {
    id: '1',
    icon: 'laptop',
    name: '首页',
    route: '/dashboard',
  },
  {
    id: '2',
    bpid: '1',
    name: '测试页面',
    icon: 'user',
    route: '/user',
  },
  {
    id: '201',
    mpid: '-1',
    bpid: '2',
    name: '用户详情',
    route: '/user/:id',
  },
  {
    id: '3',
    bpid: '1',
    name: '微信用户',
    icon: 'message',
    route: '/wxuser',
  },
  // {
  //   id: '4',
  //   bpid: '1',
  //   name: '门店用户',
  //   icon: 'shop',
  //   route: '/storeuser',
  // },
  // -- //
  {
    id: '4',
    bpid: '1',
    name: '门店管理',
    icon: 'shop',
  },
  {
    id: '401',
    bpid: '1',
    mpid: '4',
    name: '门店用户',
    route: '/storeuser',
  },
  {
    id: '402',
    bpid: '401',
    mpid: '-1',
    name: '门店操作人详情',
    route: '/storeuserDetail',
  },
  {
    id: '403',
    bpid: '402',
    mpid: '-1',
    name: '操作人寄件汇总',
    route: '/operator',
  },
  {
    id: '404',
    bpid: '1',
    mpid: '4',
    name: '门店寄件',
    route: '/expressfee',
  },
  {
    id: '405',
    bpid: '404',
    mpid: '-1',
    name: '门店单号汇总',
    route: '/expressfeedetail',
  },
  {
    id: '406',
    bpid: '1',
    mpid: '4',
    name: '门店操作',
    route: '/business',
  },
  {
    id: '407',
    bpid: '406',
    mpid: '-1',
    name: '操作人',
    route: '/operatorbyname',
  },
  {
    id: '408',
    bpid: '407',
    mpid: '-1',
    name: '快件详情',
    route: '/orderbyuser',
  },
  {
    id: '4011',
    bpid: '1',
    mpid: '4',
    name: '门店签收',
    route: '/storeSign',
  },
  {
    id: '4012',
    bpid: '4011',
    mpid: '-1',
    name: '签收订单详情',
    route: '/storeSignDetail',
  },
  {
    id: '4013',
    bpid: '1',
    mpid: '4',
    name: '门店分派',
    route: '/selectfenpai',
  },
  {
    id: '4014',
    bpid: '4013',
    mpid: '-1',
    name: '操作人分派详情',
    route: '/selectpjjeDetails',
  },
  {
    id: '4015',
    bpid: '1',
    mpid: '4',
    name: '门店问题件',
    route: '/problem',
  },
  // //
  {
    id: '5',
    bpid: '1',
    name: '收支数据',
    icon: 'eye-o',
  },
  {
    id: '501',
    mpid: '5',
    bpid: '5',
    name: '收入',
    route: '/income',
  },
  {
    id: '502',
    mpid: '5',
    bpid: '5',
    name: '支出',
    route: '/expend',
  },
  {
    id: '7',
    bpid: '1',
    name: '钱包管理',
    icon: 'wallet',
    route: '/articles',
  },
  {
    id: '701',
    mpid: '7',
    bpid: '7',
    name: '充值记录',
    route: '/topup',
  },
  {
    id: '702',
    mpid: '7',
    bpid: '7',
    name: '提现记录',
    route: '/withdraw',
  },
  {
    id: '8',
    bpid: '1',
    name: '运单管理',
    icon: 'export',
    route: '/order',
  },
  {
    id: '9',
    bpid: '1',
    name: '推广管理',
    icon: 'global',
    route: '/qr',
  },
  {
    id: '901',
    bpid: '9',
    mpid: '-1',
    name: '二维码图片',
    route: '/qrdetail',
  },
  {
    id: '10',
    bpid: '1',
    name: '充值消费',
    icon: 'credit-card',
    route: '/consume',
  },
  {
    id: '11',
    bpid: '1',
    name: '黑名单',
    icon: 'code',
    route: '/blacklist',
  },
  {
    id: '12',
    bpid: '1',
    name: '黑名单订单详情',
    icon: 'code-o',
    route: '/blacklistdetail',
  },
  {
    id: '13',
    bpid: '1',
    name: '京东单号管理',
    icon: 'export',
    route: '/jd',
  },
  {
    id: '14',
    bpid: '1',
    name: '单号规则配置',
    icon: 'setting',
    route: '/ordernumber',
  },
  {
    id: '6',
    bpid: '1',
    name: '推送消息',
    icon: 'edit',
  },
  {
    id: '601',
    mpid: '6',
    bpid: '6',
    name: '文章管理',
    route: '/articles',
  },
  {
    id: '602',
    mpid: '6',
    bpid: '6',
    name: '发布消息',
    route: '/publish',
  },
]
