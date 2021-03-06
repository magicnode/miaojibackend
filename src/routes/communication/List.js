import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定要删除这一条记录吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '主体',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: '短信数',
      dataIndex: 'noteCount',
      key: 'noteCount',
      render: (text) => <span>{text + '次'}</span>,
    }, {
      title: '短信金额',
      dataIndex: 'noteMoney',
      key: 'noteMoney',
      render: (text) => <span>{'￥' + text}</span>,
    }, {
      title: '语音数量',
      dataIndex: 'voiceCount',
      key: 'voiceCount',
      render: (text) => <span>{text + '次'}</span>,
    }, {
      title: '语音通知金额',
      dataIndex: 'voiceMoney',
      key: 'voiceMoney',
      render: (text) => <span>{'￥' + text}</span>,
    }, {
      title: '微信通知数量',
      dataIndex: 'wxCount',
      key: 'wxCount',
      render: (text) => <span>{text + '次'}</span>,
    }, {
      title: '直拨电话数量',
      dataIndex: 'callCount',
      key: 'callCount',
      render: (text) => <span>{text + '次'}</span>,
    }, {
      title: '直拨时长',
      dataIndex: 'callTime',
      key: 'callTime',
      render: (text) => <span>{text + '分'}</span>,
    }, {
      title: '直拨金额',
      dataIndex: 'callMoney',
      key: 'callMoney',
      render: (text) => <span>{'￥' + text}</span>,
    }, {
      title: '回拨次数',
      dataIndex: 'callbackCount',
      key: 'callbackCount',
      render: (text) => <span>{text + '次'}</span>,
    }, {
      title: '回拨金额',
      dataIndex: 'callbackMoney',
      key: 'callbackMoney',
      render: (text) => <span>{'￥' + text}</span>,
    }, {
      title: '回拨时长',
      dataIndex: 'callbackTime',
      key: 'callbackTime',
      render: (text) => <span>{text + '分'}</span>,
    }, {
      title: '总金额',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (text) => <span>{'￥' + text}</span>,
    }, {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },

  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = body => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1250 }}
        columns={columns}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
