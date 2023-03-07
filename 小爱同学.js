/**
 * @author Aming
 * @name 小爱同学
 * @origin 红灯区
 * @version 1.0.5
 * @description 召唤小爱同学陪聊，干啥都行
 * @rule ^小爱([^\n]+)$
 * @rule ^([^\n]+)小爱$
 * @admin true
 * @public false
 * @priority 1000
 */

//插件入口
module.exports = async sender => {
    console.log(' 执行');
    const s = sender;
    const promisify = require('util').promisify;
    const request = promisify(require('request'));

    let msg = await xiaoAiApi(s.param(1));
    await s.reply(msg)
    //异步等待删除，会继续向下运行代码，并且5秒后删除该消息
    s.delMsg(s.getMsgId(), { wait: 5 });
    //继续向下匹配
    return 'next';

    async function xiaoAiApi(str) {
        /** Code Encryption Block[be188605b2af9d5e9f0e7db22a9634fcbff7e73315f69e010668d6852c12ec93a52be56c955f4628947a7ba86008e3d01243681f5af737e76e6b69ecc13bccddbe7d93235eec8ab803ced8db61c473c397182a4c825493e3255551821cd25775a5ad8d600619e523329bc19cfa36630e5fe90bfc1645ebb59d12783d119461a4307cfd71ba2f04acf0844e85eb5f69f5f0a81616bdafa34b82f0a7b678d1b80ff787b1da52e9bd1c5d77cb567aefbeb23e6c826c5d0cf8744002353551afa25f0a0c6d5f16777826dc6fc9510602cfbe] */
    }
};
