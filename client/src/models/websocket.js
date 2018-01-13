import { CONNECT, DISCONNECT, MESSAGE } from '../reducers/websocket'
import wsClient from '../utils/wsClient'

const client = new wsClient('ws://localhost:3000', 'intoyun-demo-websocket')

client.onMessage = (data) => {
  console.log(data)
}

export const connect = () => (dispatch, getState) => {
  client.connect()
}
