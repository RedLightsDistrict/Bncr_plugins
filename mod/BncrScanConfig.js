module.exports = {
    //不用定时可以注释掉
    Wuxian_Cron: '0 0 */1 * * *', //每1小时扫wuxian
    Shop_Cron: '0 0 */2 * * *', //每2时扫店铺
    
    //扫描到结果是否直接触发bncrspy进行解析运行. 仅dev可用
    Inline: true,
    //禁用任何日志输出 改为true后,不会向社交平台推送任何消息,且2 3开关失效 控制台除外
    DisableAllLogs: false,
	
    /* Vip并发个数    我四拨并发1000基本没问题，自己测试 */ 
    Vip_reqMax: 500,
    /* vip页面一轮间隔时间 单位秒 */
    Vip_waitTime: 5,
    /* Vip页面代理开关 */
    Vip_Proxy: false,
	
    /* 首页并发数  不要超过100，首页尽量使用代理，否则会有很多错误*/
    Home_reqMax: 100,
    /* 首页一轮间隔时间 单位秒 */
    Home_waitTime: 2,
    /* Home页面代理开关 */
    Home_Proxy: true,
	
    /* 使用ck配置,从面板几中取哪几个ck */
    CookieConfig: {
        qlNum: 0 /* 0代表面板1 */,
        ck: [ 0,1 ] /* 排除哪几个ck序号,扫描的时候会剔除排除ck然后随机取一个  0代表ck1*/,
    },
	
    /* 无限城活动白名单 |分割,只有含有该关键词的才会被发送 */
    WuxianActWhiteList: '幸运|加购|关注|锦鲤|生日|积分|组队|分享',
    /* 无线店铺黑名单 |分割 ,当店铺名出现哪些关键字视为垃圾店铺 */
    WuxianShopNameBlacklist: '合田家养生食品专营店|科伦京东自营官方旗舰店|沃隆每日坚果',
	
    /* sign接口 ,建议红灯区自建sign*/
    SignUrl: 'http://192.168.31.192:9090/api/jdsign',
	
    /* 代理提取地址,当为空,不会使用代理 */
    proxyGetUrl:'',
    /* 当proxyUrl存在时,不会提取上面的代理 */
    proxyUrl: '', /* 直连代理,非url提取代理,直接填ip:端口,不要带http:// */
    
    /* 运行日志输出位置,例如错误运行日志/任务运行成功等日志,只能设置1个 */
    runLogsInfo: {
        platform: 'tgBot', //发送平台
        toGroupOrUser: 'groupId', //通知类型,个人userId //群groupId
        Id: '-1001744932665', //id
    },
};
