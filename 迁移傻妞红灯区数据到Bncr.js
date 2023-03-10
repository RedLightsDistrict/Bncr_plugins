/**
 * @author Aming
 * @name 迁移红灯区数据到bncr
 * @origin 红灯区
 * @version 1.0.0
 * @description 迁移傻妞红灯区数据到bncr
 * @rule ^(迁移红灯区数据到bncr|pinDB数据转换)$
 * @admin true
 * @public false
 * @priority 1000
 */



//插件入口
module.exports = async s => {

    /* 转换数据配置 下面的数据换成你自己的 */
    const sillyGirlpinDbToBncr = {
        wx: 'wxQianxun', // 傻妞 pinDB wx平台要转成的bncr平台
        qq: 'qq',        // 傻妞 pinDB qq平台要转成bncr平台
        tg: 'tgBot',     // 傻妞 pinDB tg平台要转成bncr平台
        pgm: 'HumanTG'   // 傻妞 pinDB pgm平台要转成bncr平台
    };


    /* 迁移数据配置 */
    /* 你傻妞的地址 结尾不要带/ */
    const sillyUrl = 'http://192.168.31.192:8081';
    /* 你在傻妞设置的服务端token */
    const token = '1234123213';



    if (s.param(1) === 'pinDB数据转换') {
        let arr = Object.keys(sillyGirlpinDbToBncr);
        let arr1 = [];
        arr.forEach(e => arr1.push(`${e} > ${sillyGirlpinDbToBncr[e]}`));
        if (!arr1.length) return s.reply('没有数据要转换');

        await s.reply(`‘确认’转换数据？\n${arr1.join('\n')}`);
        let input = await s.waitInput(() => { }, 60);
        if (!input || input.getMsg() !== '确认') return s.reply('已取消转换');
        try {
            const pinDB = new BncrDB('pinDB');
            const pinDBKeyArr = await pinDB.keys() || [];
            for (const e of pinDBKeyArr) {
                let [a, b] = e.split(':');
                if (!sillyGirlpinDbToBncr[a]) continue;
                let k = `${sillyGirlpinDbToBncr[a]}:${b}`;
                let v = await pinDB.get(e);
                v.Form = sillyGirlpinDbToBncr[a];
                await pinDB.set(k, v);
                await pinDB.del(e)
            }
        } catch (e) {
            console.error(e);
            return await s.reply('转换时出现意外情况,', e);
        }
        return await s.reply('转换完成');
    }


    if (s.param(1) === '迁移红灯区数据到bncr') {
        const promisify = require('util').promisify;
        const request = promisify(require('request'));


        if (!token || !sillyUrl) return s.reply('未设置傻妞url或token');

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
    }
};
