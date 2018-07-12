import modelExtend from 'dva-model-extend'
import { query } from 'src/services/wallet/withdraw'
import { config, initialCreateTime } from 'utils'
import { pageModel } from '../system/common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'withdraw',

  state: {
    currentItem: {},
    selectedRowKeys: [],
    isMotion: false,
  },

  subscriptions: {

    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/withdraw') {
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
      payload = initialCreateTime(payload)
      let data = yield call(query, payload)
      if (data.code === 200) {
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
      } else {
        throw data.mess || '网络不行了!!!'
      }
    },

  },

  reducers: {

    switchIsMotion(state) {
      localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})