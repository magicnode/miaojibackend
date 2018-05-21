import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { initialCreateTime } from 'utils'
import { query, create, update, remove } from '../services/qr'
import { pageModel } from './system/common'

export default modelExtend(pageModel, {
  namespace: 'qr',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/qr') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      payload = initialCreateTime(payload)
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.obj.obj,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.obj.total,
            },
          },
        })
      }
    },

    *create ({ payload }, { call, put }) {
      const newQr = {
        param: payload.parameter,
        name: payload.name,
        remark: payload.remark,
      }
      const data = yield call(create, newQr)
      if (data.success && data.code === 200) {
        yield put({ type: 'hideModal' })
        message.success(data.mess)
        yield put({ type: 'query' })
      } else {
        throw data.mess || data
      }
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ qr }) => qr.currentItem.id)
      const newQr = {
        name: payload.name,
        remark: payload.remark,
        id,
      }
      const data = yield call(update, newQr)
      if (data.code === 200) {
        yield put({ type: 'hideModal' })
        message.success('更新成功')
        yield put({ type: 'query' })
      } else {
        throw data.mess || data
      }
    },

    *delete ({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload })
      if (data.code === 200) {
        message.success('删除成功')
        yield put({ type: 'query' })
      } else {
        throw data.mess || data
      }
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
