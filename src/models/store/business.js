import modelExtend from 'dva-model-extend'
import { message, notification } from 'antd'
import { query } from '../../services/store/business'
import { pageModel } from '../system/common'
import { time, initialCreateTime } from '../../utils'
import { query as queryOperator } from '../../services/store/operatorbyname'
import { download } from '../../services/store/expressfeedetail'


export default modelExtend(pageModel, {
  namespace: 'business',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    expandedRowKeys: [],
    sonlist: [],
    iduser: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/business') {
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
      let newpayload = {}
      if (!payload.startTime) {
        const times = time.yesterTime()
        newpayload = { ...times, ...payload }
      } else {
        newpayload = { ...payload }
      }
      // download是否下载 0表示不下载,进行的是分页查询1表示的是按当前的筛选下载全部数据
      const data = yield call(query, { mailtype: 0, ...newpayload, download: 0 })
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

    *download({ payload }, { call }) {
      notification.success({
        message: '准备中...',
        description: '正在为您准备资源,请稍等!!!',
        duration: 3,
      })
      let newpayload = {}
      if (!payload.startTime) {
        const times = time.yesterTime()
        newpayload = { ...times, ...payload }
      } else {
        newpayload = { ...payload }
      }
      const data = yield call(download, { ...newpayload, tc: 'operation', download: 1 })
      if (data.code === 200 && data.obj) {
        const url = data.obj
        const openUrl = window.open(url)
        if (openUrl === null) {
          notification.warn({
            message: '下载失败',
            description: '请关闭浏览阻止网页弹窗的功能!!!',
            duration: 3,
          })
        } else {
          notification.warn({
            message: '正在下载',
            description: '请等待!!!',
            duration: 3,
          })
        }
      } else {
        throw data.mess || '无法跟服务器建立有效连接'
      }
    },

    *getOperator({ payload }, { call, put, select }) {
      const idusers = yield select(({ business }) => business.iduser)
      console.log('payloaddd', payload)
      if (payload.idUser === idusers || payload.idUser === undefined) {
        yield put({
          type: 'setSiteName',
          payload: {
            expandedRowKeys: [payload.idUser],
          },
        })
        return
      }
      message.success('信息正在加载，请稍等')
      let newpayload = {}
      if (!payload.startTime) {
        const times = time.yesterTime()
        newpayload = { ...times, ...payload }
      } else {
        newpayload = { ...payload }
      }
      // download是否下载 0表示不下载,进行的是分页查询1表示的是按当前的筛选下载全部数据
      const data = yield call(queryOperator, { mailtype: 0, ...newpayload, download: 0 })
      if (data.code === 200) {
        console.log('data', data)
        yield put({
          type: 'setSiteName',
          payload: {
            sonlist: data.obj,
            expandedRowKeys: [payload.idUser],
            iduser: payload.idUser,
          },
        })
      } else {
        message.warning('信息加载失败')
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
