import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem, DateRange, Location } from 'components'
import {
  Form, Button, Row, Col, Input, Select,
  // Cascader
} from 'antd'

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
  storeuserList,
  handleCreate,
  auth,
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
    for (let item in fields) {
      if (/^\s*$/g.test(fields[item])) {
        fields[item] = undefined
      }
    }
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
    if (key === 'location') {
      setFieldsValue({
        location: values,
      })
    }
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { name, mobile, location } = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }
  const nameChange = (key) => {
    handleChange('name', key)
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('name', { initialValue: name })(
          <Select
            showSearch
            style={{ width: '100%' }}
            onSelect={nameChange}
            placeholder="按站点名称搜索"

          >
            {storeuserList}
          </Select>
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('mobile', { initialValue: mobile })(<Search placeholder="按账号搜索" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('location', { initialValue: location })(
          <Location handleChange={handleChange.bind(null, 'location')} />
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 12 }}>
        <FilterItem label="">
          {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
            <DateRange style={{ width: '100%' }} onChange={handleChange.bind(null, 'createTime')} />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
            <Button className="margin-right" onClick={handleReset}>重置</Button>
            {auth.add && <Button type="primary" onClick={handleCreate}>新建门店用户</Button>}
          </div>
        </div>
      </Col>
    </Row >
  )
}

Filter.propTypes = {
  handleCreate: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  storeuserList: PropTypes.array,
  auth: PropTypes.object,
}

export default Form.create()(Filter)
