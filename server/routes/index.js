const Router = require('koa-router');
const crypto = require('crypto');
const request = require('../utils/apiClient');
const config = require('../config');

const router = new Router();

router.get('/token', async (ctx, next) => {
    const timestamp = Math.ceil((new Date()).getTime())
    const md5Hash = crypto.createHash('md5');
    md5Hash.update(timestamp + config.app.appSecret);

    const signature = md5Hash.digest('hex');

    try {
        const respone = await request.post(`${config.app.server}/${config.app.version}/token`, {
            data: { appId: config.app.appId, signature, timestamp }
        })

        ctx.cookies.set('srvToken', respone.body.token)
        ctx.status = respone.status;
        ctx.body = respone.body;
    } catch (e) {
        ctx.status = e.status
        ctx.body = e.body
    }
})

module.exports = router
