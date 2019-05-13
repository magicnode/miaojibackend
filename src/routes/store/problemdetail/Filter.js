import React from 'react'
import PropTypes from 'prop-types'
import {
  Form, Button, Row, Col, Input,
} from 'antd'
import { DateRange, FilterItem } from '../../../components'
import { handleFields, defaultTime } from '../../../utils'

const { Search } = Input
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
  // onAdd,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  filter = defaultTime(filter)
  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    // 判断搜索提交的内容是否为空
    // 为空则等于undefined
    for (let item in fields) {
      if (/^\s*$/g.test(fields[item])) {
        fields[item] = undefined
      }
    }
    onFilterChange({ ...filter, ...fields })
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
    filter.endTime = undefined
    filter.startTime = undefined
    filter.page = undefined
    filter.pageSize = undefined
    handleSubmit()
  }

  // 时间选择器change事件
  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    for (let item in fields) {
      if (/^\s*$/g.test(fields[item])) {
        fields[item] = undefined
      }
    }
    onFilterChange({ ...filter, ...fields })
  }

  let { brand, orderSn, createTime } = filter

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 5 }} md={{ span: 5 }} sm={{ span: 12 }}>
        <FilterItem>
          {getFieldDecorator('brand', { initialValue: brand })(
            <Search onSearch={handleSubmit} onPressEnter={handleSubmit} placeholder="按快递品牌搜索" />
          )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 5 }} md={{ span: 5 }} sm={{ span: 12 }}>
        <FilterItem>
          {getFieldDecorator('orderSn', { initialValue: orderSn })(
            <Search onSearch={handleSubmit} onPressEnter={handleSubmit} placeholder="按快递单号搜索" />
          )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 7 }} lg={{ span: 7 }} md={{ span: 12 }} sm={{ span: 16 }} sx={{ span: 24 }}>
        {getFieldDecorator('createTime', { initialValue: createTime })(
          <DateRange onChange={handleChange.bind(null, 'createTime')} />
        )}
      </Col>
      <Col {...TwoColProps} xl={{ span: 6 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div >
            <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
            <Button onClick={handleReset}>刷新</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onDownLoad: PropTypes.func,
}

export default Form.create()(Filter)
