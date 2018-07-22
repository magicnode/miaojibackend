import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Cascader } from 'antd'

const FormItem = Form.Item
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  storeuserList,
  roleList,
  locationList,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  type,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const handleChange = (key) => {
    console.log('key', key)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="机构名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: false,
                message: '请输入机构名称!',
              },
            ],
          })(<Input placeholder="请输入机构名称!" />)}
        </FormItem>
        <FormItem label="角色信息" hasFeedback {...formItemLayout}>
          {getFieldDecorator('role', {
            initialValue: item.role,
            rules: [
              {
                required: false,
                message: '请输入角色信息!',
              },
            ],
          })(<Select
            showSearch
            style={{ width: '100%' }}
            placeholder="请输入站点信息!"
            onChange={handleChange}
          >
            {roleList}
          </Select>)}
        </FormItem>
        <FormItem label="站点信息" hasFeedback {...formItemLayout}>
          {getFieldDecorator('store', {
            initialValue: item.store,
            rules: [
              {
                required: false,
                type: 'array',
                message: '请输入站点信息!',
              },
            ],
          })(<Select
            // mode="tags"
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请输入站点信息!"
            onChange={handleChange}
          >
            {storeuserList}
          </Select>)}
        </FormItem>
        <FormItem label="地区信息" hasFeedback {...formItemLayout}>
          {getFieldDecorator('location', {
            initialValue: item.location || [],
            rules: [
              {
                required: false,
                message: '请输入地区信息!',
              },
            ],
          })(<Cascader options={locationList} onChange={handleChange} placeholder="请输入地区信息" />)}
        </FormItem>
        <FormItem label="备注信息" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: false,
                message: '字数不能超过100!',
                max: 100,
              },
            ],
          })(<TextArea placeholder="请输入备注信息!" style={{ height: '50', width: '100%' }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  modalMenuLevel: PropTypes.number,
  storeuserList: PropTypes.array,
  roleList: PropTypes.array,
  locationList: PropTypes.array,
}

export default Form.create()(modal)
