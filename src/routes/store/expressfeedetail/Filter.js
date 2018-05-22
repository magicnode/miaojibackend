import React from 'react'
import PropTypes from 'prop-types'
import {
  Form, Button, Row, Col, Select, Input,
} from 'antd'
import { DateRange } from '../../../components'
import { handleFields, defaultTime } from '../../../utils'

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
  // onAdd,
  onFilterChange,
  filter,
  onDownLoad,
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
    if (fields.payType === '0') {
      fields.payType = undefined
    }
    if (fields.status === '0') {
      fields.status = undefined
    }
    onFilterChange({ ...filter, ...fields })
  }

  let { payType, status, brand, createTime } = filter

  const payTypeChange = (key) => {
    handleChange('payType', key)
  }
  const statusChange = (key) => {
    handleChange('status', key)
  }
  const brandChange = (key) => {
    handleChange('brand', key.target.value)
  }


  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 16 }} sx={{ span: 24 }}>
        <span>快递品牌 : </span>
        {getFieldDecorator('brand', { initialValue: brand })(
          <Input onPressEnter={brandChange} size="large" style={{ width: '70%' }} placeholder="按品牌搜索" />
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 16 }} sx={{ span: 24 }}>
        <span>收款方式 : </span>
        {getFieldDecorator('payType', { initialValue: payType || '0' })(
          <Select onChange={payTypeChange} size="large" style={{ width: '70%' }} placeholder="按支付方式筛选">
            <Option key="0">全部</Option>
            <Option key="1">支付宝</Option>
            <Option key="2">微信</Option>
            <Option key="3">余额</Option>
            <Option key="4">现金</Option>
          </Select>
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 16 }} sx={{ span: 24 }}>
        <span>完成状态 : </span>
        {getFieldDecorator('status', { initialValue: status || '0' })(
          <Select onChange={statusChange} size="large" style={{ width: '70%' }} placeholder="按支付方式筛选">
            <Option key="0">全部</Option>
            <Option key="success">成功</Option>
            <Option key="wait">等待</Option>
            <Option key="close">关闭</Option>
          </Select>
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 7 }} lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 16 }} sx={{ span: 24 }}>
        {getFieldDecorator('createTime', { initialValue: createTime })(
          <DateRange size="large" onChange={handleChange.bind(null, 'createTime')} />
        )}
      </Col>
      <Col {...TwoColProps} xl={{ span: 6 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>
            <Button size="large" className="margin-right" onClick={handleReset}>刷新</Button>
            <Button type="primary" size="large" onClick={onDownLoad}>下载为Excel</Button>
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
