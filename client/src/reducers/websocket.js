export const CONNECT = 'WEBSOCKET_CONNECT'
export const DISCONNECT = 'WEBSOCKET_DISCONNECT'
export const MESSAGE = 'WEBSOCKET_MESSAGE'
export const TOKEN = 'WEBSOCKET_TOKEN'

export default function websocket (state = { collection: [] }, action) {
  const { type, ...rest } = action

  return /^WEBSOCKET_/.test(type) ? { ...state, ...rest } : state
}
