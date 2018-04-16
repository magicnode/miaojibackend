import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Row, Col, Input, Cascader } from 'antd'
import city from '../../utils/city'
import { DateRange } from '../../components'
import { time } from '../../utils'

const Search = Input.Search

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
  const { wxName, address, subscribe } = filter

  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      const repairTime = time.repairTime(fields.createTime)
      fields.startTime = repairTime.startTime
      fields.endTime = repairTime.endTime
    }
    delete fields.createTime
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields.subscribe = subscribe
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
    filter.endTime = undefined
    filter.startTime = undefined
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }


  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('wxName', { initialValue: wxName })(<Search placeholder="按微信名搜索" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('address', { initialValue: address })(
          <Cascader
            size="large"
            style={{ width: '100%' }}
            options={city}
            placeholder="地理所属门店"
            onChange={handleChange.bind(null, 'address')}
          />)}
      </Col>
      <Col {...ColProps} xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 16 }} sm={{ span: 16 }} sx={{ span: 24 }}>
        {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
          <DateRange size="large" onChange={handleChange.bind(null, 'createTime')} />
        )}
      </Col>
      <Col {...TwoColProps} style={{ marginBottom: '0px' }} xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>
            <Button size="large" onClick={handleReset}>刷新</Button>
          </div>
        </div>
      </Col>
    </Row >
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
