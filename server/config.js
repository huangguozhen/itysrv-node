module.exports = {
  app: {
    server: 'http://ghgylenterprise.intoyun.com',
    version: 'v1',
    appId: '5751976dcc9a78a36796bb3af0938005',
    appSecret: '39484bb40d9c3ebd75fc01226574e375'
  },
  kafka: {
    topic: 'device-data-5751976dcc9a78a36796bb3af0938005',
    group: '5751976dcc9a78a36796bb3af0938005',
    brokers: 'ghgyldps.intoyun.com:9092',
    sasl_enable: true,
    appId: '5751976dcc9a78a36796bb3af0938005',
    appSecret: '39484bb40d9c3ebd75fc01226574e375'
  }
}
