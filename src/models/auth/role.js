import React from 'react'
import modelExtend from 'dva-model-extend'
import { initialCreateTime } from 'utils'
import { message, Select } from 'antd'
import { query, create, update, remove, queryMenu, getLocation } from '../../services/auth/role'
import { pageModel } from '../system/common'
import {
  reloadItem, handleArrData, renderTreeNodes, editLocation,
  filterRoleList,
} from '../../utils/processing'

const { Option } = Select

export default modelExtend(pageModel, {
  namespace: 'role',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    menuList: [],
    locationList: [],
    roleList: [],
    menuListSpare: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/role') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query({ payload = {} }, { call, put, select }) {
      const menuListSpare = yield select(({ role }) => role.menuListSpare)
      console.log('menuListSpare1234', menuListSpare)
      const menuList = yield select(({ role }) => role.menuList)
      const locationList = yield select(({ role }) => role.locationList)

      if (!menuList.length) {
        yield put({
          type: 'queryMenuList',
        })
      }
      if (!locationList.length) {
        yield put({
          type: 'queryLocation',
        })
      }
      payload = initialCreateTime(payload)
      const data = yield call(query, payload)
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

    *create({ payload }, { call, put, select }) {
      if (!payload.menus || payload.menus === []) {
        message.warn('还没有选择菜单呢')
        return
      }
      const menuList = yield select(({ role }) => role.menuList)
      payload.menuGroup = handleArrData({
        list: menuList,
        arr: payload.menus,
      })
      const data = yield call(create, { ...payload })
      if (data.success && data.code === 200) {
        yield put({ type: 'hideModal' })
        message.success(data.mess)
        yield put({ type: 'query' })
      } else {
        throw data.mess || '当前网络无法使用'
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ role }) => role.currentItem.ID)
      if (payload.menus) {
        const menuList = yield select(({ role }) => role.menuList)
        payload.menuGroup = handleArrData({
          list: menuList,
          arr: payload.menus,
        })
      }
      const data = yield call(update, { ...payload, id })
      if (data.code === 200) {
        yield put({ type: 'hideModal' })
        message.success('更新成功')
        yield put({ type: 'query' })
      } else {
        throw data.mess || '当前网络无法使用'
      }
    },

    *delete({ payload }, { call, put }) {
      const data = yield call(remove, [payload])
      if (data.code === 200) {
        message.success('删除成功')
        yield put({ type: 'query' })
      } else {
        throw data.mess || '当前网络无法使用'
      }
    },

    *queryMenuList(_, { call, put }) {
      const data = yield call(queryMenu, { parentMenuId: 0, page: 1, pageSize: 10000 })
      if (data.code === 200 && data.obj) {
        let option = []
        const menuListSpare = [].concat(data.obj)
        const dataList = JSON.parse(JSON.stringify(data.obj))
        if (dataList instanceof Array) {
          option = dataList.map((item) => {
            return reloadItem(item)
          })
          option = renderTreeNodes(option)
        }
        console.log('menuListSpare', menuListSpare)
        yield put({
          type: 'updateState',
          payload: {
            menuList: option,
            menuListSpare,
          },
        })
      }
    },

    *queryLocation(_, { call, put }) {
      const data = yield call(getLocation)
      let option = []
      if (data.code === 200 && data.obj) {
        option = data.obj.map((item) => {
          return editLocation(item)
        })
        yield put({
          type: 'updateState',
          payload: {
            locationList: option,
          },
        })
      }
    },

    *queryRoleList(_, { call, put }) {
      const data = yield call(query, { page: 1, pageSize: 1000000 })
      let option = []
      if (data.code === 200 && data.obj) {
        option = data.obj.map((item) => {
          return <Option key={JSON.stringify(item)}>{item.ROLE_NAME}</Option>
        })
        yield put({
          type: 'updateState',
          payload: {
            roleList: option,
          },
        })
      }
    },

    *filterRoleList({ payload }, { select, put }) {
      const menuListSpare = yield select(({ role }) => role.menuListSpare)
      console.log('menuListSparefilter', menuListSpare)
      console.log('payload.MENU_GROUP_ID', payload.MENU_GROUP_ID)
      const datalist = filterRoleList([...menuListSpare], eval(payload.MENU_GROUP_ID))
      const data = [].concat(datalist)
      console.log('data22', data)
      let option = []
      if (data instanceof Array) {
        option = data.map((item) => {
          return reloadItem(item)
        })
        option = renderTreeNodes(option)
      }
      console.log('option', option)
      yield put({
        type: 'updateState',
        payload: {
          menuList: option,
        },
      })
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
