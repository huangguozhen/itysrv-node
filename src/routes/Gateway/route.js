import register from '../../utils/register'

export default function createRoute (app) {
  return {
    path: 'gateway',
    name: 'wifi',
    breadcrumbName: '网关管理',
    getComponent (nextState, cb) {
      register(app, require('../../models/device').default)
      register(app, require('../../models/product').default)
      import(/* webpackChunkName: "gateway" */'./')
        .then(module => cb(null, module.default))
    }
  }
}
