import fetch from '../utils/request'

export default {
  namespace: 'device',
  state: { list: [], hasToken: false },
  reducers: {
    fetchAll: (state, { payload }) => ({
      ...state,
      list: payload
    }),
    token: (state, { hasToken }) => ({
      ...state,
      hasToken
    })
  }
}

export function fetchAll () {
  return async (dispatch, getState) => {
    try {
      const { device: { hasToken } } = getState()
      if (!hasToken) {
        await fetch('/token')
        dispatch({ type: 'device/token', hasToken: true })
      }

      const respone = await fetch('/api/device')
      dispatch({ type: 'device/fetchAll', payload: respone })
      return respone
    } catch (error) {
      console.error(error)
    }

    return false
  }
}
