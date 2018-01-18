const Kafka = require('node-rdkafka');
const crypto = require('crypto');
const bcd = require('./utils/bcd');

module.exports = function (app, options) {
  let counter = 0;
  let numMessages = 5;

  const m0 = crypto.createHash('md5');
  m0.update(options.appSecret);
  const m1 = crypto.createHash('md5');
  m1.update(options.appId + m0.digest('hex'));

  const sasl_password = m1.digest('hex');

  const consumer = new Kafka.KafkaConsumer({
    'metadata.broker.list': options.brokers,
    'group.id': options.appId,
    'enable.auto.commit': false,
    'security.protocol': 'SASL_PLAINTEXT',
    'auto.offset.reset': 'earliest',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': options.appId,
    'sasl.password': sasl_password
  });

  // event log
  consumer.on('event.log', function(log) {
    console.log('event log');
    console.log(log);
  });

  // event error
  consumer.on('event.error', function(err) {
    console.error('Error from consumer');
    console.error(err);
  });

  // consumer ready
  consumer.on('ready', function(arg) {
    console.log('consumer ready.' + JSON.stringify(arg));
    consumer.subscribe([`device-data-${options.appId}`]);

    //start consuming messages
    consumer.consume();
  });

  consumer.on('data', function(m) {
    counter++;

    //committing offsets every numMessages
    if (counter % numMessages === 0) {
        consumer.commit(m);
    }

    // Output the actual message contents
    console.log(m.value.toString());

    // 处理消费数据
    try {
      let buffer;
      const data = JSON.parse(m.value.toString());
      if (typeof Buffer.from === 'function') {
        buffer = Buffer.from(data.body, 'base64');
      } else {
        buffer = new Buffer(data.body, 'base64');
      }

      const iv = buffer.slice(0, 16);
      const aesKey = bcd.encode(options.appSecret);

      let decipher = crypto.createDecipheriv('AES-128-CBC', aesKey, iv);
      let decryptedData = decipher.update(buffer.slice(16), 'hex', 'utf8');
      decryptedData += decipher.final('utf8');

      // const rxData = JSON.parse(decryptedData).data
      // if (typeof Buffer.from === 'function') {
      //   decryptedDataBuffer = Buffer.from(rxData, 'base64');
      // } else {
      //   decryptedDataBuffer = new Buffer(rxData, 'base64');
      // }

      console.log(decryptedData);
      app.ws.sockets.emit('message', decryptedData);
    } catch (e) {
      console.log(e);
    }
  });

  consumer.on('disconnected', function(arg) {
    console.log('consumer disconnected. ' + JSON.stringify(arg));
  });

  return consumer;
}
