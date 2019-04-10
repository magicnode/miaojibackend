import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from './List.less'
import AnimTableBody from '../../components/DataTable/AnimTableBody'

const replText = {
  0: '未对接',
  1: '对接成功',
  2: '对接失败',
  3: '对接中',
}
const color = {
  0: '#DB9019',
  1: '#62bd00',
  2: '#FF534D',
  3: '#25C6FC',
}

const filtersTest = Object.values(replText).map((i, index) => ({ text: i, value: index }))
const Text = ({ children }) => {
  return <span style={{ color: color[children] }}>{replText[children]}</span>
}

Text.propTypes = {
  children: PropTypes.string,
}

const List = ({ location, ...tableProps }) => {
  const { stoDatastatus, ztoDatastatus, ytoDatastatus, beDatastatus, ydDatastatus } = location.query
  const columns = [
    {
      title: '站点ID',
      dataIndex: 'idUser',
      key: 'idUser',
    }, {
      title: '站点名称',
      dataIndex: 'name',
      key: 'name',

    }, {
      title: '站点地址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '圆通',
      dataIndex: 'stoDatastatus',
      key: 'stoDatastatus',
      filters: filtersTest,
      filterMultiple: false,
      filteredValue: stoDatastatus ? [stoDatastatus] : [],
      render: (text) => {
        return <Text>{text}</Text>
      },
    }, {
      title: '中通',
      dataIndex: 'ztoDatastatus',
      key: 'ztoDatastatus',
      filters: filtersTest,
      filterMultiple: false,
      filteredValue: ztoDatastatus ? [ztoDatastatus] : [],
      render: (text) => {
        return <Text>{text}</Text>
      },
    }, {
      title: '申通',
      dataIndex: 'ytoDatastatus',
      key: 'ytoDatastatus',
      filters: filtersTest,
      filterMultiple: false,
      filteredValue: ytoDatastatus ? [ytoDatastatus] : [],
      render: (text) => {
        return <Text>{text}</Text>
      },
    }, {
      title: '百世汇通',
      dataIndex: 'beDatastatus',
      key: 'beDatastatus',
      filters: filtersTest,
      filterMultiple: false,
      filteredValue: beDatastatus ? [beDatastatus] : [],
      render: (text) => {
        return <Text>{text}</Text>
      },
    }, {
      title: '韵达',
      dataIndex: 'ydDatastatus',
      key: 'ydDatastatus',
      filters: filtersTest,
      filterMultiple: false,
      filteredValue: ydDatastatus ? [ydDatastatus] : [],
      render: (text) => {
        return <Text>{text}</Text>
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    rows: tableProps.pagination.rows,
  }

  const getBodyWrapper = (body) => { return <AnimTableBody {...getBodyWrapperProps} body={body} /> }

  return (
    <div>
      <Table
        {...tableProps}
        className={styles.table}
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