import request from '@/utils/request'
import { config } from '@/constants'

const version = 'v1'

request.defaults.baseURL = `${config.apiURL}/${version}`

export default request
