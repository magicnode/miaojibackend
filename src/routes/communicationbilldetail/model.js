import modelExtend from 'dva-model-extend'
import { notification } from 'antd'
import moment from 'moment'
import { detailQuery, detailDownload } from '../communicationbill/service'
import { APIV3, pageModel } from '../../utils'

export default modelExtend(pageModel, {
  namespace: 'communicationbilldetail',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/communicationbilldetail') {
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
      const userId = payload.name && payload.name.split('///')[0]

      if (!userId) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: [],
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: 0,
            },
          },
        })
        throw new Error('没有指定需要查询的门店')
      }
      const record = { ...payload }
      if (record.createTime && record.createTime.length === 2) {
        record.startTime = `${moment(`${record.createTime[0]} 00:00:00`).unix()}000` / 1
        record.endTime = `${moment(`${record.createTime[1]} 23:59:59`).unix()}999` / 1
      }
      const params = {
        startTime: record.startTime,
        endTime: record.endTime,
        userId: record.name ? record.name.split('///')[0] : undefined,
        page: record.page,
        pageSize: record.pageSize,
        isDownload: 0,
      }
      const data = yield call(detailQuery, params)
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
        throw data.mess || '当前网络无法使用'
      }
    },

    *download({ payload = {} }, { call }) {
      const userId = payload.name && payload.name.split('///')[0]

      if (!userId) {
        throw new Error('没有指定需要下载数据的门店')
      }
      const record = { ...payload }
      if (record.createTime && record.createTime.length === 2) {
        record.startTime = `${moment(`${record.createTime[0]} 00:00:00`).unix()}000` / 1
        record.endTime = `${moment(`${record.createTime[1]} 23:59:59`).unix()}999` / 1
      }
      const params = {
        startTime: record.startTime,
        endTime: record.endTime,
        userId: record.name ? record.name.split('///')[0] : undefined,
        page: record.page,
        pageSize: record.pageSize,
        isDownload: 1,
      }
      const data = yield call(detailDownload, { ...params })
      if (data.code === 200) {
        const url = APIV3 + data.obj
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
        throw data.mess || '当前网络无法使用'
      }
    },
  },

  reducers: {},
})