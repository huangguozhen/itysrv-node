// import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import ifox from 'ifox'
import websocket from './reducers/websocket'

const app = ifox({
  extraReducers: { websocket },
  extraMiddlewares: [ thunk, createLogger({ collapsed: true }) ]
})
app.router(require('./router').default)
app.start('#root')

// registerServiceWorker();
