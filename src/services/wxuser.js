import { request, api, pageParams } from 'utils'

const { wxuser } = api

export async function query (params) {
  params = pageParams(params)
  return request({
    url: wxuser.list,
    method: 'get',
    data: params,
  })
}
