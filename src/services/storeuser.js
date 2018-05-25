import { request, api, pageParams } from 'utils'

const { storeuser } = api

export async function query(params) {
  params = pageParams(params)
  return request({
    url: storeuser.list,
    method: 'get',
    params,
  })
}

export async function updateFee(params) {
  return request({
    url: storeuser.updateFee,
    method: 'post',
    params,
  })
}
