import React from 'react'
import modelExtend from 'dva-model-extend'
import { initialCreateTime, pageModel } from 'utils'
import { message, Select } from 'antd'
import { query, create, update, remove } from './service'
import { query as queryOrangeizeList } from '../org/service'
import { getUserId, password } from '../../utils'
import orgToTree from '../../utils/orgToTree'
import { query as queryRoleList } from '../role/service'

const { Option } = Select
let count = 1
const reloadItem = (item) => {
  if (item.children && item.children.length === 0) {
    delete item.children
  }
  if (item.children && item.children.length > 0) {
    item.children = item.children.map((items) => {
      return reloadItem(items)
    })
  }
  item.key = count++
  return item
}

export default modelExtend(pageModel, {
  namespace: 'adminuser',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    confirmDirty: false,
    roleList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/adminuser') {
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
      const data = yield call(query, payload)
      if (data.code === 200) {
        let list = []
        if (data.obj.length > 0) {
          list = data.obj.map((item) => {
            return reloadItem(item)
          }).map((item) => {
            if (!item.children) return item
            item.role = item.children.map((i) => {
              return i.children[0]
            })
            return { ...item, children: undefined }
          })
        }
        yield put({
          type: 'querySuccess',
          payload: {
            list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    *create({ payload }, { call, put }) {
      const newPayload = {
        accounts: payload.newAccounts,
        createUserId: getUserId(),
        mobile: payload.number,
        name: payload.newName,
        orgId: payload.orgId[payload.orgId.length - 1],
        parentId: getUserId(),
        password: password(payload.password),
        remark: payload.remark,
        roleId: payload.roleId.toString(),
      }
      const data = yield call(create, newPayload)
      if (data.success && data.code === 200) {
        yield put({ type: 'hideModal' })
        message.success('新增成功')
        yield put({ type: 'query' })
      } else {
        throw data.mess || '当前网络无法使用'
      }
    },

    *update({ payload }, { select, call, put }) {
      const item = yield select(({ adminuser }) => adminuser.currentItem)
      delete payload.password
      delete payload.repass
      if (payload.idUser === item.siteName) {
        delete payload.idUser
      } else {
        payload.idUser = payload.idUser ? payload.idUser.split('///')[0] : undefined
      }
      if (payload.orgId === item.orgId) {
        delete payload.orgId
      }
      payload.roleId = payload.roleId.toString()
      const data = yield call(update, { ...payload, id: item.userId })
      if (data.code === 200) {
        yield put({ type: 'hideModal' })
        message.success('更新成功')
        yield put({ type: 'query' })
      } else {
        throw data.mess || '当前网络无法使用'
      }
    },

    *delete({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload })
      if (data.code === 200) {
        message.success('删除成功')
        yield put({ type: 'query' })
      } else {
        throw data.mess || '当前网络无法使用'
      }
    },

    *resetPWD({ payload }, { call, select, put }) {
      const id = yield select(({ adminuser }) => adminuser.currentItem.id)
      payload.password = password(payload.password)
      const data = yield call(update, { password: payload.password, id })
      if (data.code === 200) {
        yield put({ type: 'hideModal' })
        message.success('密码重置成功')
        yield put({ type: 'query' })
      } else {
        throw data.mess || '当前网络无法使用'
      }
    },

    *queryOrangeizeList(_, { call, put }) {
      const data = yield call(queryOrangeizeList, { page: 1, pageSize: 10000 })
      if (data.code === 200) {
        const orgTree = orgToTree(data.obj)
        let option = []
        if (data.obj && data.obj.length > 0) {
          option = data.obj.map((item) => {
            return <Option key={item.id} value={item.id}>{item.orgName}</Option>
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            orgTree,
            orangeizeList: option,
          },
        })
      } else {
        throw data.mess || '当前网络无法使用'
      }
    },

    *queryRoleList(_, { call, put }) {
      const data = yield call(queryRoleList, { page: 1, pageSize: 1000000 })
      if (data.code === 200 && data.obj) {
        const list = data.obj.filter(i => i.ID !== 1)
        // if (getUserId() !== 1) {
        //   list = list.filter(i => i.ID !== 1)
        // }
        const option = list.map((item) => {
          return <Option key={item.ID}>{item.ROLE_NAME}</Option>
        })
        yield put({
          type: 'updateState',
          payload: {
            roleList: option,
          },
        })
      }
    },

  },

  reducers: {

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false, confirmDirty: false }
    },

  },
})