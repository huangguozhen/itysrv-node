const Koa = require('koa');
const path = require('path');
const createConsumer = require('./kafkaConsumer');

const config = require('./config');
const websockify = require('./websocket');

// 启动Websocket服务
const app = websockify(new Koa());

// 捕获异常
app.onFinished = (err, res) => {
  console.log(`err = ${err}`);
}

// 适应HTML但页面应用(SPA)
const history = require('koa2-connect-history-api-fallback');
app.use(history({
  whiteList: ['/token', '/api']
}))


// 加载静态页面
const static = require('koa-static');
app.use(static(path.join(__dirname, '../client/build')));

// http路由实现
const router = require('./routes/index');
app.use(router.routes()).use(router.allowedMethods());

// http代理，代理uri为/api开头的请求
const proxy = require('koa-proxy');
app.use(proxy({
    host: config.proxy,
    map: function (path) {
      return path.replace('api', config.version)
    },
    match: /^\/api/
}))

try {
  // 创建Kafka消费者
  const consumer = createConsumer(app, config)
  //starting the consumer
  consumer.connect();
} catch (e) {
  console.log(e)
}

const server = app.listen(3000);
console.log('listen 3000.')
