import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const WithDraw = ({ app, location, dispatch, withdraw, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, examineBalance } = withdraw
  const { pageSize } = pagination
  const { user: { sourceMenuList } } = app
  const auth = sourceMenuList['/withdraw'] || {}

  const modalProps = {
    type: modalType,
    examineBalance,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    confirmLoading: loading.effects['withdraw/update'],
    examineBalanceLoading: loading.effects['withdraw/showBalance'],
    title: `${modalType === 'create' ? '提现审核' : '提现审核'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: `withdraw/${modalType}`,
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'withdraw/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['withdraw/query'],
    pagination,
    location,
    auth,
    onChange(page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onWithdrawalClick(record) {
      dispatch({
        type: 'withdraw/showBalance',
        payload: {
          name: record.name,
          id: record.userId,
        },
      })
      dispatch({
        type: 'withdraw/showModal',
        payload: {
          modalType: 'cashWithdraw',
          currentItem: { ...record },
        },
      })
    },
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange(value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

WithDraw.propTypes = {
  withdraw: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  app: PropTypes.object,
}

export default connect(({ app, withdraw, loading }) => ({ app, withdraw, loading }))(WithDraw)
