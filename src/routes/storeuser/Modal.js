import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, InputNumber, Input, Modal, Radio, Cascader, Button, Spin } from 'antd'
import styles from './List.less'

const RadioGroup = Radio.Group
const FormItem = Form.Item

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
  confirmDirty,
  onEditConfirmDirty,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
  monitorList,
  locationData,
  orgTree,
  contentLoading,
  monitorAddLoading,
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
      if (data.monitorItem) {
        setFieldsValue({
          monitorItem: undefined,
        })
      }
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const compareToFirstPassword = (rule, value, callback) => {
    const password = getFieldValue('password')
    if (value && value !== password) {
      callback('两次输入的密码不一致!')
    } else {
      callback()
    }
  }
  const validateToNextPassword = (rule, value, callback) => {
    if (value) {
      validateFields(['confirm'], { force: true })
    }
    callback()
  }

  if (modalProps.modalType === 'monitor') {
    return (
      <Modal {...{ ...modalOpts, footer: null }} title="监控管理" >
        <Row>
          <Col span={20}>
            <Form layout="horizontal">
              <FormItem label="设备序列号" hasFeedback {...{ ...formItemLayout, wrapperCol: { span: 16 } }}>
                {getFieldDecorator('monitorItem', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入设备序列号',
                    },
                  ],
                })(<Input placeholder="请输入设备序列号" />)}
              </FormItem>
            </Form>
          </Col>
          <Col span={2}>
            <Button loading={monitorAddLoading} onClick={handleOk} style={{ height: '32px' }} type="primary">添加</Button>
          </Col>
        </Row>
        <div className={styles.monitorList}>
          <h2>门店监控设备列表</h2>
          <div>
            <Spin spinning={contentLoading}>
              <div className={styles.monitorListItem}>
                {monitorList.length ? monitorList.map((i, k) => (
                  <p key={k}>
                    <span>{`设备${k + 1}`}</span>
                    <span>:</span>
                    <span>{`${i}`}</span>
                    <span>
                      <Button type="danger" size="small">删除</Button>
                    </span>
                  </p>
                )) : <p>暂无设备记录</p>}
              </div>
            </Spin>
          </div>
        </div>
      </Modal >
    )
  }

  if (modalProps.modalType === 'versionswitch') {
    return (
      <Modal {...modalOpts} title="版本切换">
        <Form layout="horizontal">
          <FormItem label="版本" hasFeedback {...formItemLayout}>
            {getFieldDecorator('isBeta', {
              initialValue: item.isBeta,
              rules: [
                {
                  required: true,
                  message: '请选择版本',
                },
              ],
            })(
              <RadioGroup style={{ width: '100%' }}>
                <Radio value={1}>正式版</Radio>
                <Radio value={0}>简化版</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  const filterLocation = (inputValue, path) => {
    return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
  }

  const filterOrg = (inputValue, path) => {
    return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
  }

  if (modalProps.modalType === 'create') {
    return (
      <Modal {...modalOpts} title="妙寄APP注册">
        <Form layout="horizontal">
          <div style={{ height: '0px', overflow: 'hidden' }}>
            {/* 处理autocomplete属性失效不能阻止浏览器自动填充表单 */}
            <FormItem label="处理浏览器表单自动填充" hasFeedback {...formItemLayout}>
              {getFieldDecorator('useless', {
              })(<Input type="password" />)}
            </FormItem>
          </div>
          <FormItem label="手机号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('siteMobile', {
              rules: [
                {
                  required: true,
                  pattern: /^1[3456789]\d{9}$/,
                  message: '请输入正确的手机号码!',
                },
              ],
            })(<Input placeholder="请输入的手机号码!" />)}
          </FormItem>
          <FormItem label="站点名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('siteName', {
              rules: [
                {
                  required: true,
                  message: '请输入站点名称!',
                },
              ],
            })(<Input
              prefix={'妙寄'}
              suffix={'店'}
              placeholder="请输入站点名称!"
              className={styles.appInput}
            />)}
          </FormItem>
          <FormItem label="所属机构" hasFeedback {...formItemLayout}>
            {getFieldDecorator('org', {
              rules: [
                {
                  required: true,
                  message: '请选择所属机构!',
                },
              ],
            })(<Cascader
              options={orgTree}
              placeholder="请选择所属机构"
              showSearch={{ filterOrg }}
              autocomplete="off"
              changeOnSelect
            />)}
          </FormItem>
          <FormItem label="省市区" hasFeedback {...formItemLayout}>
            {getFieldDecorator('address', {
              rules: [
                {
                  required: true,
                  message: '请选择省市区!',
                },
              ],
            })(<Cascader
              options={locationData}
              placeholder="请选择省市区"
              showSearch={{ filterLocation }}
              autocomplete="off"
            />)}
          </FormItem>
          <FormItem label="街道" hasFeedback {...formItemLayout}>
            {getFieldDecorator('street', {
              rules: [
                {
                  required: false,
                  message: '请输入街道名称!',
                },
              ],
            })(<Input
              autocomplete="off"
              placeholder="请输入街道名称!"
            />)}
          </FormItem>
          <FormItem label="详细地址" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: '请输入详细地址!',
                },
              ],
            })(<Input
              type="textarea"
              placeholder="请输入详细地址!"
            />)}
          </FormItem>
          <FormItem label="密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./])[~!@#$%^&*()_+`\-={}:";'<>?,./0-9a-zA-Z\d]{8,30}$/,
                  message: '密码长度要在8~30之间且至少包含一个大写字母一个小写字母一个数字一个特殊符号!',
                },
                {
                  validator: validateToNextPassword,
                },
              ],
            })(<Input
              type="password"
              autocomplete="off"
              placeholder="请输入密码!"
            />)}
          </FormItem>
          <FormItem label="确认密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请再次输入密码!',
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            })(<Input
              type="password"
              autocomplete="off"
              placeholder="请确认你的密码"
            />)}
          </FormItem>
          <FormItem label="版本" hasFeedback {...formItemLayout}>
            {getFieldDecorator('isBeta', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '请选择版本',
                },
              ],
            })(
              <RadioGroup>
                <Radio value={1}>正式版</Radio>
                <Radio value={0}>简化版</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  const handleConfirmBlur = (e) => {
    const value = e.target.value
    onEditConfirmDirty({ confirmDirty: confirmDirty || !!value })
  }


  if (modalProps.modalType === 'resetPWD') {
    return (
      <Modal {...modalOpts} title="重置密码">
        <Form layout="horizontal">
          <FormItem label="登陆密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('password', {
              initialValue: item.password,
              rules: [
                {
                  required: true,
                  message: '请填写用户登陆密码!',
                },
                {
                  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./])[~!@#$%^&*()_+`\-={}:";'<>?,./0-9a-zA-Z\d]{8,30}$/,
                  message: '密码长度要在8~30之间且至少包含一个大写字母一个小写字母一个数字一个特殊符号!',
                },
                {
                  validator: validateToNextPassword,
                },
              ],
            })(<Input type="password" placeholder="请填写用户登陆密码!" />)}
          </FormItem>
          <FormItem label="确认密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('repass', {
              initialValue: item.repass,
              rules: [
                {
                  required: true,
                  message: '请填写确认密码!',
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
            })(<Input type="password" placeholder="请填写确认密码!" onBlur={handleConfirmBlur} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="通讯费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('fee', {
            initialValue: item.communicateFee,
            rules: [
              {
                required: true,
                message: '请输入通讯费金额',
              },
            ],
          })(<InputNumber placeholder="请输入通讯费金额" style={{ width: '100%' }} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  locationData: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
  orgTree: PropTypes.array,
  monitorList: PropTypes.array,
  contentLoading: PropTypes.bool,
  monitorAddLoading: PropTypes.bool,
  confirmDirty: PropTypes.bool,
  onEditConfirmDirty: PropTypes.func,
}

export default Form.create()(modal)
