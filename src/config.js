module.exports = {
  app: {
    server: 'https://enterprise.intoyun.com',
    version: 'v1',
    appId: '70753d5c8f858cdcd0d908b32a9e8e62',
    appSecret: '706068eed4df1c174b63f64dd470b2c4'
  },
  kafka: {
    topic: 'device-data-70753d5c8f858cdcd0d908b32a9e8e62',
    group: '70753d5c8f858cdcd0d908b32a9e8e62',
    brokers: 'dps.intoyun.com:9092',
    sasl_enable: true,
    appId: '70753d5c8f858cdcd0d908b32a9e8e62',
    appSecret: '706068eed4df1c174b63f64dd470b2c4'
  }
}
