module.exports = {
  app: {
    server: 'http://ghgylenterprise.intoyun.com',
    version: 'v1',
    appId: 'b0a5b389c2811e5b0509584942a245df',
    appSecret: '698c253d37bca988a99870da466c94f1'
  },
  kafka: {
    topic: 'device-data-b0a5b389c2811e5b0509584942a245df',
    group: 'b0a5b389c2811e5b0509584942a245df',
    brokers: 'ghgyldps.intoyun.com:9092',
    sasl_enable: true,
    appId: 'b0a5b389c2811e5b0509584942a245df',
    appSecret: '698c253d37bca988a99870da466c94f1'
  }
}
