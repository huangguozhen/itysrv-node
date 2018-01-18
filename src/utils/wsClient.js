import io from 'socket.io-client'

export const scope = function (f, scope) {
  return function () {
    return f.apply(scope, arguments)
  }
}

export default class wsClient {
  connected = false;
  onMessage () {};

  constructor (uri, clientId) {
    this.uri = uri;
    this.clientId = clientId;
  }

  connect (connectOptions = {}) {
    if (this.connected) {
      throw new Error('already connected')
    }

    if (this.socket) {
      throw new Error('already connected')
    }

    this.connected = false;
    this.socket = io(this.uri)

    this.socket.on('new connection', data => console.log(data))

    this.socket.on('message', scope(this._on_socket_message, this))
    this.socket.on('connect', scope(this._on_socket_open, this))
    this.socket.on('error', scope(this._on_socket_error, this))
    this.socket.on('disconnect', scope(this._on_socket_close, this))
  }

  send (data) {
    if (!this.connected) {
      throw new Error('not connected')
    }

    this.socket.send(data)
  }

  _on_socket_open () {
    console.log('_on_socket_open')
  }

  _on_socket_close (event) {
    console.log('_on_socket_close')
  }

  _on_socket_error (error) {
    console.log('_on_socket_error')
    console.error(error.data)
  }

  _on_socket_message (data) {
    console.log(data)
    this.onMessage(data)
  }
}
