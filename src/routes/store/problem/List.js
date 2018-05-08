import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import AnimTableBody from '../../../components/DataTable/AnimTableBody'

const List = ({ filter, location, onEditItem, onDeleteItem, ...tableProps }) => {
  const columns = [
    {
      title: '站点ID',
      dataIndex: 'idUser',
      key: 'idUser',
      render: (text) => {
        return <span>{text || '暂无'}</span>
      }
    }, {
      title: '站点名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return <span>{text || '暂无'}</span>
      }
    }, {
      title: '分派数量',
      dataIndex: 'fptotal',
      key: 'fptotal',
      render: (text) => {
        return <span>{text || 0}</span>
      }
    }, {
      title: '分派数量',
      dataIndex: '123',
      key: '123',
      render: (text) => {
        return <span>{text || 0}</span>
      }
    }, {
      title: '分派数量',
      dataIndex: '343',
      key: '343',
      render: (text) => {
        return <span>{text || 0}</span>
      }
    }
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
  filter: PropTypes.object,
}

export default List
