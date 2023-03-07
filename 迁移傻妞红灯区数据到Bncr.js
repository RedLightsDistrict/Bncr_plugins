/**
 * @author Aming
 * @name 迁移红灯区数据到bncr
 * @origin 红灯区
 * @version 1.0.0
 * @description 迁移傻妞红灯区数据到bncr
 * @rule ^(迁移红灯区数据到bncr)$
 * @admin true
 * @public false
 * @priority 1000
 */

//插件入口
module.exports = async s => {
    // console.log(' 执行');
    const promisify = require('util').promisify;
    const request = promisify(require('request'));
    /* 你傻妞的地址 结尾不要带/ */
    const sillyUrl = 'http://192.168.31.192:8081';
    /* 你在傻妞设置的服务端token */
    const token = '1234123213';

    if (!token || !sillyUrl) {
        return s.reply('未设置傻妞url或token');
    }

    let res = await requestSillyGirl();
    if (res.code !== 200) return await s.reply(`迁移红灯区数据失败：${res.msg}`);
    if (Array.isArray(res.data)) {
        for (const e of res.data) {
            let form = e.key;
            let newForm = new BncrDB(form);
            for (const s of e.val) {
                let key = s.key;
                let val = '';
                try {
                    val = JSON.parse(s.val);
                } catch (e) {
                    val = s.val;
                }
                // console.log('form', form);
                // console.log('key', key);
                // console.log('val', val);
                await newForm.set(key, val);
            }
        }

        return await s.reply(`迁移红灯区数据成功`);
    }
    return await s.reply(`迁移红灯区数据失败：${res.msg}`);


    async function requestSillyGirl() {
        return (
            await request({
                url: `${sillyUrl}/api/moveBncr`,
                method: 'post',
                body: { token: token },
                json: true
            })
        ).body;
    }
};
