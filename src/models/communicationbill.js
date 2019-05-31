import { message, notification } from 'antd'
import modelExtend from 'dva-model-extend'
import { config, initialCreateTime, filterStoreSelect } from '../utils'
import { query, download } from '../services/communicationbill'
import { pageModel } from './system/common'

const { APIV3 } = config

export default modelExtend(pageModel, {
  namespace: 'communicationbill',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/communicationbill') {
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
      let record = { ...payload }
      record = initialCreateTime(record, true)
      filterStoreSelect(record)
      if (record.name) {
        record.idUser = record.name.split('///')[0]
        delete record.name
      }
      const locationrecord = {}
      if (record.location && record.location.length > 0) {
        // 不要对传进来的record直接修改,会直接影响原数据
        let location = record.location.split(',')
        switch (location.length) {
          case 1:
            locationrecord.province = location[0]
            break
          case 2:
            locationrecord.city = location[1]
            break
          case 3:
            locationrecord.district = location[2]
            break
          default:
            break
        }
      }
      const data = yield call(query, {
        ...record,
        ...locationrecord,
        isDownload: 0,
        location: undefined,
      })
      if (data.code === 200) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.obj || [],
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      } else {
        message.error(data.mess || '网络错误')
      }
    },

    *download({ ...props }, { call }) {
      let { payload } = props
      notification.success({
        message: '准备中...',
        description: '正在为您准备资源,请稍等!!!',
        duration: 3,
      })
      payload = initialCreateTime(payload, true)
      filterStoreSelect(payload)
      if (payload.idUser) {
        payload.userIds = String(payload.idUser)
        delete payload.idUser
      }
      const locationPayload = {}
      if (payload.location && payload.location.length > 0) {
        // 不要对传进来的payload直接修改,会直接影响原数据
        let location = payload.location.split(',')
        switch (location.length) {
          case 1:
            locationPayload.province = location[0]
            break
          case 2:
            locationPayload.city = location[1]
            break
          case 3:
            locationPayload.district = location[2]
            break
          default:
            break
        }
      }
      const newpayload = {
        startTime: payload.startTime,
        endTime: payload.endTime,
        userIds: payload.userIds,
        idBrand: payload.idBrand,
        isDownload: 1,
        ...locationPayload,
      }
      const data = yield call(download, { ...newpayload, download: 1 })
      if (data.code === 200 && data.obj) {
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
        throw data.mess || '无法跟服务器建立有效连接'
      }
    },

  },

  reducers: {

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },

  },
})