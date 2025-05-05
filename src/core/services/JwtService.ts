import { createCookiesItem } from './cookies-store'

const PREFIX = import.meta.env.VITE_APP_NAME || '__VUE_TEMPLATE'
const ACCESS_TOKEN = `${PREFIX}_ACCESS_TOKEN`
const REFRESH_TOKEN = `${PREFIX}_REFRESH_TOKEN`

const {
  setItem: setToken,
  getItem: getToken,
  clearItem: removeToken,
} = createCookiesItem<string | undefined>(ACCESS_TOKEN, undefined)

const {
  setItem: setRefreshToken,
  getItem: getRefreshToken,
  clearItem: removeRefreshToken,
} = createCookiesItem<string | undefined>(REFRESH_TOKEN, undefined)

type DataTokens = {
  token: string
  refreshToken: string
}
// TODO: Replace with token data type
function saveTokens(data: DataTokens) {
  setToken(data.token)
  setRefreshToken(data.refreshToken)
}

function destroyTokens() {
  removeToken()
  removeRefreshToken()
}

export { getToken, destroyTokens, getRefreshToken }
