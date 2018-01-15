import request from '../utils/request'

export default {
  namespace: 'product',
  state: { list: [], hasFetch: false },
  reducers: {
    fetchAll: (state, { payload }) => ({
      ...state,
      list: payload
    }),
    fetch: (state, { payload }) => {
      let { list } = state
      if (list.find(prod => prod.productId === payload.productId)) {
        list = list.map(prod => prod.productId === payload.productId ? payload : prod)
      } else {
        list = list.concat(payload)
      }

      return { ...state, list }
    }
  }
}

export function fetchAll (f) {
  return async (dispatch, getState) => {
    try {
      const payload = await request('/api/product')
      dispatch({ type: 'product/fetchAll', payload })

      return payload
    } catch (err) {
      console.error(err)
    }

    return false
  }
}

export function fetch (productId) {
  return async (dispatch, getState) => {
    try {
      const { product: { list } } = getState()
      const prod = list.find(prod => prod.productId === productId)
      if ( prod && Object.hasOwnProperty.call(prod, 'datapoints')) {
        return prod
      }

      const payload = await request(`/api/product/${productId}`)
      dispatch({ type: 'product/fetch', payload  })

      return payload
    } catch (err) {
      console.error(err)
    }

    return false
  }
}
