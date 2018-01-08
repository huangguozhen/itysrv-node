const Koa = require('koa');
const createConsumer = require('./kafkaConsumer');

const request = require('./utils/apiClient');
const config = require('./config');
const websockify = require('./websocket');

// 启动Websocket服务
const app = websockify(new Koa());

// http路由实现
const router = require('./routes/index');
app.use(router.routes()).use(router.allowedMethods());

// http代理，代理uri为/api开头的请求
const proxy = require('koa-proxy');
app.use(proxy({
    host: config.app.server,
    map: function (path) {
        return path.replace('api', config.app.version)
    },
    match: /^\/api/
}))

try {
  // 创建Kafka消费者
  const consumer = createConsumer(app, config.kafka)
  //starting the consumer
  consumer.connect();
} catch (e) {
  console.log(e)
}

const server = app.listen(3000);
console.log('listen 3000.')
