import modelExtend from 'dva-model-extend'
import { query } from '../../services/store/storeSign'
import { pageModel } from '../common'
import { time } from '../../utils'

export default modelExtend(pageModel, {
  namespace: 'storeSign',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/storeSign') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query({ payload = {} }, { call, put }) {
      console.log('感觉这是一个bug')
      let newpayload = {}
      if (!payload.startTime) {
        const times = time.yesterTime()
        newpayload = { ...times, ...payload }
      } else {
        newpayload = { ...payload }
      }
      // download是否下载 0表示不下载,进行的是分页查询1表示的是按当前的筛选下载全部数据
      const data = yield call(query, { ...newpayload, download: 0 })
      if (data.obj) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.obj,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

  },

  reducers: {

    setSiteName(state, { payload }) {
      return { ...state, ...payload }
    },

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },

  },
})