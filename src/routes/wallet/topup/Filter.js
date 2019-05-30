import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem, DateRange } from 'components'
import { Form, Button, Row, Col, Input, Select } from 'antd'

const Search = Input.Search
const { Option } = Select

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime && createTime.length && createTime[0] && createTime[1]) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    } else {
      delete fields.createTime
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { name, status } = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  const inputClear = (e, key) => {
    if (e && e.target && !e.target.value) {
      handleChange(key, '')
    }
  }

  const statusChange = (key) => {
    handleChange('status', key)
  }

  const statusOptionArr = [
    { key: 'success', text: '成功' },
    { key: 'wait', text: '等待' },
    { key: 'cancel', text: '交易取消' },
    { key: 'close', text: '交易关闭' },
    { key: 'false', text: '交易失败' },
  ].map((i) => {
    return <Option key={i.key}>{i.text}</Option>
  })

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 12 }}>
        {getFieldDecorator('name', { initialValue: name })(<Search onChange={e => inputClear(e, 'name')} allowClear placeholder="按充值人搜索" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 12 }}>
        {getFieldDecorator('status', { initialValue: status })(
          <Select
            style={{ width: '100%' }}
            allowClear
            placeholder="按充值状态筛选"
            onChange={statusChange}
          >
            {statusOptionArr}
          </Select>
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 8 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <FilterItem>
          {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
            <DateRange style={{ width: '100%' }} onChange={handleChange.bind(null, 'createTime')} />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 8 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
            <Button onClick={handleReset}>重置</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
