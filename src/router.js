import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'react-router'
import Layout from './components/Layout'
import { MESSAGE } from './reducers/websocket'
import wsClient from './utils/wsClient'
import { fetch as fetchOne } from './models/product'
import { decode } from './utils/protocol'

const client = new wsClient(`ws://localhost:3000`, 'intoyun-demo-websocket')
function routerConfig ({ history, app }) {
  const routes = [{
    path: '/',
    name: 'laptop',
    breadcrumbName: '首页',
    component: Layout,
    onEnter (nextState, replace) {
      try {
        // 连接Websocket
        client.onMessage = async (payload) => {
          try {
            let { collection } = app._store.getState().websocket
            const current = JSON.parse(payload)
            const product = await app._store.dispatch(fetchOne(current.prdId))

            // 转换数据点数据
            const uint8 = []
            const pointStr = atob(current.data)
            for (let i = 0; i < pointStr.length; i++) {
              uint8.push(pointStr.charCodeAt(i))
            }

            const display = {}
            const pointObj = decode(uint8)
            Object.keys(pointObj).forEach(dpId => {
              /* eslint eqeqeq: 0 */
              const datapoint = product.datapoints.find(point => point.dpId == dpId)
              display[datapoint.nameCn] = pointObj[dpId]

              if (datapoint && datapoint.type === 'float') {
                const step = 1 / Math.pow(10, datapoint.resolution)
                display[datapoint.nameCn] = parseInt(((pointObj[dpId] * step) + datapoint.min).toFixed(datapoint.resolution), 10)
              }
            })
            current.data = JSON.stringify(display)
            current.hasBg = true

            if (collection.find(model => model.devId === current.devId)) {
              collection = collection.map(model => model.devId === current.devId ? current : { ...model, hasBg: false })
            } else {
              collection = collection.map(model => ({ ...model, hasBg: false })).concat(current)
            }

            app._store.dispatch({ type: MESSAGE, realtime: current, collection })
          } catch (err) {
            console.error(err)
          }
        }
        client.connect()
      } catch (error) {
        console.log(error)
      }
    },
    indexRoute: {
      onEnter: (nextState, replace) => replace('/gateway')
    },
    childRoutes: (r => r.keys().map(key => r(key).default(app))
    )(require.context('./', true, /^\.\/routes\/((?!\/)[\s\S])+\/route\.js$/))
  }]

  return <Router history={history} routes={routes} />
}

routerConfig.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object
}

export default routerConfig
