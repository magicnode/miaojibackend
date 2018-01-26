import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Table, Modal, Icon, message, Button } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import { DropOption } from '../../components'
import { time } from '../../utils'

const confirm = Modal.confirm
// const wx_qr_prefix = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='

const List = ({ location, onEditItem, onDeleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    switch (e.key) {
      case '1':
        onEditItem(record)
        break
      case '2':
        confirm({
          title: '确定要删除吗?',
          onOk () {
            onDeleteItem(record.id)
          },
        })
        break
      default:
        break
    }
  }

  const copyUrl = (record, e) => {
    const href = `http://miaoji.didalive.net/qrdetail?ticket=${record.ticket}&name=${record.name}&parameter=${record.parameter}`
    window.prompt('请使用Ctrl+C复制到剪切板', href)
  }

  const columns = [
    {
      title: '门店姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '扫描关注人数',
      dataIndex: 'sourceCount',
      key: 'sourceCount',
    }, {
      title: '二维码参数',
      dataIndex: 'parameter',
      key: 'parameter',
    }, {
      title: '二维码图片',
      dataIndex: 'ticket',
      key: 'ticket',
      render: (text, record) => {
        const href = `/qrdetail?ticket=${text}&name=${record.name}&parameter=${record.parameter}&remark=${record.remark}`
        return <a href={href} target="_blank">点击查看</a>
      },
    }, {
      title: '复制图片路径',
      key: 'copy',
      render: (text, record) => {
        return <Button type="primary" size="large" onClick={e => copyUrl(record, e)}>复制到剪切板</Button>
      },
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => {
        const createTime = time.formatTime(text.toString())
        return <span>{createTime}</span>
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '更新' }]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    rows: tableProps.pagination.rows,
  }

  const getBodyWrapper = body => { return <AnimTableBody {...getBodyWrapperProps} body={body} /> }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
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
  location: PropTypes.object,
}

export default List