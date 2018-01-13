const superagent = require('superagent')

const methods = ['get', 'post', 'put', 'patch', 'del']

class ApiClient {
  constructor (req) {
    /* eslint no-return-assign: 0 */
    methods.forEach((method) =>
      this[method] = (path, { params, data, headers } = {}) => new Promise((resolve, reject) => {
        headers = headers || {}
        const request = superagent[method](path).set({
          'Accept':'application/json',
          'Content-Type': 'application/json',
          ...headers
        })
        if (params) {
          request.query(params)
        }
        if (typeof __SERVER__ !== 'undefined' && __SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'))
        }
        if (data) {
          request.send(data)
        }
        request.end((err, respone = {}) => err ? reject(respone || err) : resolve(respone))
      }))
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty () {}
}

module.exports = new ApiClient();
