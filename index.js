const Koa = require('koa');
const Router = require('koa-router');
const request = require('./apiClient');
const WebSocket = require('ws');
const url = require('url');
const proxy = require('koa-proxy');
const crypto = require('crypto');

const app = new Koa();
const router = new Router();
let X_IntoYun_SrvToken = '';
const requestData = {
    appId: '70753d5c8f858cdcd0d908b32a9e8e62',
    appSecret: '706068eed4df1c174b63f64dd470b2c4_'
}

router.get('/', (ctx, next) => {
    ctx.body = '<h1>Hello, Guozhen Huang & Molmc!</h1>'
})

router.get('/token', async (ctx, next) => {
    const timestamp = Math.ceil((new Date()).getTime())
    const md5Hash = crypto.createHash('md5');
    md5Hash.update(timestamp + requestData.appSecret);

    const signature = md5Hash.digest('hex');

    try {
        const respone = await request.post('https://enterprise.intoyun.com/v1/token', {
            data: { appId: requestData.appId, signature, timestamp }
        })

        ctx.cookies.set('srvToken', respone.body.token)
        ctx.status = respone.status;
        ctx.body = respone.body;
    } catch (e) {
        ctx.status = e.status
        ctx.body = e.body
    }
})

app.use(router.routes()).use(router.allowedMethods());
app.use(proxy({
    host: 'https://enterprise.intoyun.com',
    map: function (path) {
        return path.replace('api', 'v1')
    },
    match: /^\/api/
}))

const server = app.listen(3000);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      ws.send('echo: ' + message);
    });

    ws.send('something');
});

console.log('listen 3000.')
