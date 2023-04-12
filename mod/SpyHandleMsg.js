/**
 * @name SpyHandleMsg
 * @version v1.0.0
 * @author Aming
 * @origin 红灯区
 * @create_at 2033-10-27 11:12:09
 * @description 当触发的消息中没有 export线报时,触发的消息会经过此模块解析
 * @module true
 * @public false
 */


const request = require('util').promisify(require('request'));

module.exports = async msg => {
    /*
     当触发的消息中没有 export格式变量时,触发的消息会经过此模块解析
     因此,你可以在此模块中添加你对export以外的消息进行解析,返回一个export线报
    */
    const urlReg = /https:\/\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\*\+,%;\=]*/g;
    const codeReg = /[(|)|#|@|$|%|¥|￥|!|！][0-9a-zA-Z]{10,14}[(|)|#|@|$|%|¥|￥|!|！]/g;
    const urlArr = msg.match(urlReg)?.map(url => decodeURIComponent(url)) ?? [];
    const codeArr = msg.match(codeReg) ?? [];
    for (const [i, code] of codeArr.entries()) {
        const res = await nolanDecode(code);
        res ? (codeArr[i] = res) : codeArr.slice(i, 1);
    }
    let result = '';
    for (const link of [...urlArr, ...codeArr])
        urlToExport(link)?.forEach(e => (result += `export ${e.name}="${e.value}"\n`));
    /*
    如果该导出的函数返回值不是一个string或不是一个 export格式的线报时,该msg会被放弃
    如果该模块中的代码报错 将强制返回空字符串
    */
    return result ? `外部模块解析结果:\n${result}` : '';
};

/* 解析列表 取于白眼*/
function ListS() {
    return [
        /******************KR库********************** */
        {
            keyword: /cjhy(dz)?-isv\.isvjcloud\.com\/wxTeam\/activity/,
            name: 'CJ组队瓜分',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhy_activityId',
                },
            ],
        },

        {
            keyword: /lzkj(dz)?-isv\.isvj(clou)?d.com\/wxTeam\/activity/,
            name: 'LZ组队瓜分',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_zdjr_activityId',
                },
            ],
        },

        {
            keyword: /cjhy(dz)?-isv\.isvjcloud\.com\/microDz\/invite\/activity/,
            name: 'CJ微定制',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wdz_activityId',
                },
            ],
        },

        {
            keyword: /cjhy(dz)?-isv\.isvjcloud\.com\/microDz\/invite\/openLuckBag/,
            name: 'CJ微定制福袋',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wdzfd_activityId',
                },
            ],
        },

        {
            keyword: /lzkj(dz)?-isv\.isvjcloud.com\/wxCollectCard/,
            name: 'LZ集卡抽奖',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxCollectCard_activityId', //kr
                },
            ],
        },

        {
            keyword: 'wxCollectionActivity/activity',
            name: '加购有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_wxCollectionActivity_activityUrl', //kr
                },
            ],
        },
        {
            keyword: /wxDrawActivity|lzclient/,
            name: '幸运抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'LUCK_DRAW_URL', //kr
                },
            ],
        },
        {
            keyword: /lzkj(dz)?-isv\.isvj(clou)?d.com\/wxgame/,
            name: 'LZ店铺游戏',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxgame_activityId', //kr
                },
            ],
        },
        {
            keyword: /lzkj(dz)?-isv\.isvj(clou)?d\.com\/wxSecond/,
            name: 'LZ读秒拼手速',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxSecond_activityId', //kr
                },
            ],
        },

        {
            keyword: 'wxCartKoi/cartkoi',
            name: 'LZ购物车锦鲤',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxCartKoi_activityId',
                },
            ],
        },

        {
            keyword: 'wxShopFollowActivity',
            name: '店铺关注有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_wxShopFollowActivity_activityUrl',
                },
            ],
        },

        {
            keyword: /https:\/\/lzkj-isv.isvj(clou)?d.com\/drawCenter/,
            name: 'LZ刮刮乐',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_drawCenter_activityId',
                },
            ],
        },

        {
            keyword: /lzkjdz-isv.isvj(clou)?d.com\/wxFansInterActionActivity/,
            name: 'LZ粉丝互动',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxFansInterActionActivity_activityId',
                },
            ],
        },

        {
            keyword: /lzkj(dz)?-isv.isvj(clou)?d.com\/wxShareActivity/,
            name: 'LZ分享有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxShareActivity_activityId',
                },
            ],
        },

        {
            keyword: 'https://jdjoy.jd.com/module/task/v2/doTask',
            name: 'JoyJD任务',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'comm_activityIDList',
                },
            ],
        },

        {
            keyword: 'https://cjhy-isv.isvjcloud.com/sign/signActivity',
            name: 'CJ超级店铺无线签到',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'CJHY_SIGN',
                },
            ],
        },
        {
            keyword: /cjhy-isv.isvj(clou)?d.com\/sign\/sevenDay\/signActivity/,
            name: 'CJ超级店铺无线签到',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'CJHY_SEVENDAY',
                },
            ],
        },
        {
            keyword: /lzkj-isv.isvj(clou)?d.com\/sign\/signActivity/,
            name: 'LZ超级店铺无线签到',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'LZKJ_SIGN',
                },
            ],
        },
        {
            keyword: /lzkj-isv.isvj(clou)?d.com\/sign\/sevenDay/,
            name: 'LZ超级店铺无线签到',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'LZKJ_SEVENDAY',
                },
            ],
        },

        {
            keyword: /lzkjdz-isv.isvj(clou)?d.com\/wxUnPackingActivity/,
            name: 'LZ让福袋飞',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxUnPackingActivity_activityId',
                },
            ],
        },

        {
            keyword: 'https://cjhy-isv.isvjcloud.com/wx/completeInfoActivity/view/activity',
            name: 'CJ完善信息有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_completeInfoActivity_activityId',
                },
                {
                    ori: 'venderId',
                    redi: 'jd_completeInfoActivity_venderId',
                },
            ],
        },

        {
            keyword: 'https://cjhy-isv.isvjcloud.com/mc/wxMcLevelAndBirthGifts/activity',
            name: 'CJ生日礼包和会员等级礼包',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxMcLevelAndBirthGifts_activityId',
                },
            ],
        },

        {
            keyword: /https:\/\/lzkj-isv.isvj(clou)?d.com\/wxBuildActivity/,
            name: 'LZ盖楼有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_wxBuildActivity_activityId', //kr
                },
            ],
        },

        {
            keyword: /wxKnowledgeActivity/,
            name: '知识超人',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_wxKnowledgeActivity_activityUrl', //KR
                },
            ],
        },

        {
            keyword: 'https://cjhy-isv.isvjcloud.com/wxKnowledgeActivity/activity',
            name: 'CJ知识超人',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjwxKnowledgeActivity_activityId', //kr
                },
            ],
        },
        {
            keyword: 'https://cjhy-isv.isvjcloud.com/activity/daily/',
            name: 'cjhy每日抢',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjdaily_activityId',
                },
            ],
        },

        {
            keyword: /(lzkj-isv.isvj(clou)?d.com\/wxShopGift)|(cjhy-isv\.isvjcloud\.com\/wxShopGift)/,
            name: '特效店铺有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_wxShopGift_activityUrl', //kr
                },
            ],
        },

        {
            keyword: 'https://txzj-isv.isvjcloud.com/cart_item',
            name: '收藏大师-加购有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_cart_item_activityUrl', //kr
                },
            ],
        },
        {
            keyword: 'https://txzj-isv.isvjcloud.com/collect_item',
            name: '收藏大师-关注有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_collect_item_activityUrl', //kr
                },
            ],
        },
        {
            keyword: 'https://txzj-isv.isvjcloud.com/collect_shop',
            name: '收藏大师-关注商品',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_collect_shop_activityUrl', //kr
                },
            ],
        },
        {
            keyword: 'https://txzj-isv.isvjcloud.com/lottery',
            name: '收藏大师-幸运抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_lottery_activityUrl', //kr
                },
            ],
        },

        {
            keyword: 'https://cjhy-isv.isvjcloud.com/wxInviteActivity/openCard/invitee',
            name: 'CJ开卡入会有礼',
            trans: [
                {
                    ori: 'venderId',
                    redi: 'VENDER_ID',
                },
            ],
        },

        {
            keyword: /pro(dev)?\.m\.jd\.com\/mall\/active\/dVF7gQUVKyUcuSsVhuya5d2XD4F/,
            name: '邀好友赢大礼',
            trans: [
                {
                    ori: 'code',
                    redi: 'yhyauthorCode',
                },
            ],
        },

        {
            keyword: 'https://jinggengjcq-isv.isvjcloud.com',
            name: '大牌联合开卡',
            trans: [
                {
                    ori: 'actId',
                    redi: 'DPLHTY',
                },
            ],
        },

        {
            keyword: 'https://mpdz-dz.isvjcloud.com',
            name: '大牌联合开卡',
            trans: [
                {
                    ori: 'actId',
                    redi: 'DPLHTY',
                },
            ],
        },

        {
            keyword: /jinggeng-isv\.isvj(clou)?d\.com\/ql\/front\/showInviteJoin/,
            name: '邀请入会赢好礼 · 京耕',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_showInviteJoin_activityUrl', //kr
                },
            ],
        },
        {
            keyword: /shop\.m\.jd.com\/shop\/lottery/,
            name: '店铺刮刮乐',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_shopDraw_activityUrl', //kr
                },
            ],
        },
        {
            keyword: /(interactsaas|interact)\/index\?activityType=(10006|10070)/,
            name: '邀请入会有礼（lzkj_loreal）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_lzkj_loreal_invite_url', //kr
                },
            ],
        },
        {
            keyword: /interactsaas\/index\?activityType=(10020|10021|10026|10080)/,
            name: '店铺抽奖（超级无线欧莱雅）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_lzkj_loreal_draw_url', //kr
                },
            ],
        },
        {
            keyword: /(interactsaas|interact)\/index\?activityType=10024/,
            name: '加购有礼（超级无线欧莱雅）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_lzkj_loreal_cart_url', //kr
                },
            ],
        },
        {
            keyword: /(interactsaas|interact)\/index\?activityType=10069/,
            name: '关注店铺有礼（超级无线欧莱雅',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_lzkj_loreal_followShop_url', //kr
                },
            ],
        },

        /*******************环境保护库********************** */
        {
            keyword: /cjhy(dz)?-isv\.isvjcloud\.com\/wxTeam\/activity/,
            name: 'CJ组队瓜分',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhydz_wxTeam_Id',
                },
            ],
        },

        {
            keyword: /lzkj(dz)?-isv\.isvj(clou)?d.com\/wxTeam\/activity/,
            name: 'LZ组队瓜分',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkjdz_wxTeam_Id',
                },
            ],
        },

        {
            keyword: /cjhy(dz)?-isv\.isvjcloud\.com\/microDz\/invite\/activity/,
            name: 'CJ微定制',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhydz_microDz_Id',
                },
            ],
        },

        {
            keyword: /cjhy(dz)?-isv\.isvjcloud\.com\/microDz\/invite\/openLuckBag/,
            name: 'CJ微定制福袋',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_openLuckBag_Id',
                },
            ],
        },
        // {
        // 	keyword: /https:\/\/lzkj-isv\.isvj(clou)?d\.com\/wxShopFollowActivity/,
        // 	name: "LZ店铺关注抽奖",
        // 	trans: [{
        // 		ori: "activityId",
        // 		redi: "jd_lzkj_wxShopFollowActivity_activityId"
        // 	}]
        // },
        // {
        // 	keyword: "https://cjhy-isv.isvjcloud.com/wxShopFollowActivity/activity",
        // 	name: "CJ店铺关注抽奖",
        // 	trans: [{
        // 		ori: "activityId",
        // 		redi: "jd_cjhy_wxShopFollowActivity_activityId"
        // 	}]
        // },

        // {
        // 	keyword: "https://lzkj-isv.isvjcloud.com/wxCollectionActivity/activity2",
        // 	name: "LZ加购有礼",
        // 	trans: [{
        // 		ori: "activityId",
        // 		redi: "jd_lzkj_wxCollectionActivityId"//环保
        // 	}]
        // },

        // {
        // 	keyword: "https://cjhy-isv.isvjcloud.com/wxCollectionActivity/activity",
        // 	name: "CJ加购有礼",
        // 	trans: [{
        // 		ori: "activityId",
        // 		redi: "jd_cjhy_wxCollectionActivityId"//环保
        // 	}]
        // },
        // {
        // 	keyword: /https:\/\/lzkj-isv\.isvj(cloud)?\.com\/lzclient/,
        // 	name: "LZ幸运抽奖",
        // 	trans: [{
        // 		ori: "activityId",
        // 		redi: "jd_lzkj_wxDrawActivity_Id"//环保
        // 	}]
        // },
        // {
        // 	keyword: "https://cjhy-isv.isvjcloud.com/wxDrawActivity/activity/",
        // 	name: "CJ幸运抽奖",
        // 	trans: [{
        // 		ori: "activityId",
        // 		redi: "jd_cjhy_wxDrawActivity_Id"//环保
        // 	}]
        // },
        {
            keyword: /lzkj-isv\.isvj(clou)?d\.com\/wxGameActivity/,
            name: 'LZ游戏活动',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_wxGameActivity_activityId', //环保
                },
            ],
        },
        {
            keyword: /lzkj-isv\.isvj(clou)?d.com\/wxgame/,
            name: 'LZ游戏活动',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'WXGAME_ACT_ID', //环保
                },
            ],
        },
        {
            keyword: 'https://cjhy-isv.isvjcloud.com/wxGameActivity/activity',
            name: 'CJ游戏活动',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhy_wxGameActivity_activityId', //环保
                },
            ],
        },
        {
            keyword: 'https://lzkj-isv.isvjcloud.com/wxKnowledgeActivity/activity',
            name: 'LZ知识超人',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_wxKnowledgeActivity_activityId', //环保
                },
            ],
        },
        {
            keyword: 'https://cjhy-isv.isvjcloud.com/wxKnowledgeActivity/activity',
            name: 'CJ知识超人',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhy_wxKnowledgeActivity_activityId', //环保
                },
            ],
        },

        {
            keyword: 'https://txzj-isv.isvjcloud.com/cart_item',
            name: 'txzj加购有礼',
            trans: [
                {
                    ori: 'a',
                    redi: 'jd_txzj_cart_item_id',
                },
            ],
        },
        {
            keyword: 'https://txzj-isv.isvjcloud.com/collect_item',
            name: 'txzj关注有礼',
            trans: [
                {
                    ori: 'a',
                    redi: 'jd_txzj_collect_item_id',
                },
            ],
        },
        {
            keyword: 'https://txzj-isv.isvjcloud.com/sign_in',
            name: 'txzj签到',
            trans: [
                {
                    ori: 'a',
                    redi: 'jd_txzj_sign_in_id',
                },
            ],
        },
        {
            keyword: 'https://txzj-isv.isvjcloud.com/lottery',
            name: 'txzj抽奖',
            trans: [
                {
                    ori: 'a',
                    redi: 'jd_txzj_lottery_id',
                },
            ],
        },

        {
            keyword: 'https://cjhy-isv.isvjcloud.com/activity/daily/',
            name: 'cjhy每日抢',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhy_daily_ids',
                },
            ],
        },
        {
            keyword: 'https://cjhy-isv.isvjcloud.com/mc/wxMcLevelAndBirthGifts/activity',
            name: 'CJ生日礼包和会员等级礼包',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhy_wxMcLevelAndBirthGifts_ids',
                },
            ],
        },
        {
            keyword: /(cjhy|lzkj)-isv\.isvj(clou)?d\.com\/sign/,
            name: '超级店铺无线签到',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_sevenDay_activityUrl',
                },
            ],
        },
        {
            keyword: /cjhy-isv\.isvjcloud\.com\/sign\/signActivity/,
            name: 'CJ超级店铺无线签到',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhy_signActivity_ids',
                },
            ],
        },
        {
            keyword: /cjhy-isv.isvj(clou)?d.com\/sign\/sevenDay\/signActivity/,
            name: 'CJ超级店铺无线签到',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhy_sevenDay_ids',
                },
            ],
        },
        {
            keyword: /lzkj-isv.isvj(clou)?d.com\/sign\/signActivity/,
            name: 'LZ超级店铺无线签到',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_signActivity2_ids',
                },
            ],
        },
        {
            keyword: /lzkj-isv.isvj(clou)?d.com\/sign\/sevenDay/,
            name: 'LZ超级店铺无线签到',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_sevenDay_ids',
                },
            ],
        },
        {
            keyword: /lzkj-isv.isvj(clou)?d.com\/wxBuildActivity/,
            name: 'LZ盖楼有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_wxBuildActivity_activityId',
                },
            ],
        },
        {
            keyword: /lzkj-isv\.isvj(clou)?d.com\/wxShopGift/,
            name: 'lzkj店铺礼包',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_wxShopGift_ids',
                },
            ],
        },
        {
            keyword: /cjhy-isv\.isvjcloud\.com\/wxShopGift/,
            name: 'cjhy店铺礼包',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_cjhy_wxShopGift_ids',
                },
            ],
        },
        {
            keyword: /interact\/index\?activityType=10006/,
            name: 'loreal邀请入会有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_loreal_interact_yqrhyl_activityId',
                },
            ],
        },
        {
            keyword: /interactsaas\/index\?activityType=10006/,
            name: '邀请入会有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_yqrhyl_activityId',
                },
            ],
        },
        {
            keyword: /interactsaas\/index\?activityType=10024/,
            name: 'lzkj_interactsaas加购有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_jgyl_activityId',
                },
            ],
        },
        {
            keyword: /interactsaas\/index\?activityType=10069/,
            name: 'lzkj_interactsaas关注店铺有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_gzyl_activityId',
                },
            ],
        },
        {
            keyword: /interactsaas\/index\?activityType=10053/,
            name: 'lzkj_interactsaas关注商品有礼',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_gzspyl_activityId',
                },
            ],
        },

        /******************* 自定义 ********************* */
        {
            keyword: 'https://wqs.jd.com/promote/2023/spring2023/index.html',
            name: '团团领红包助力【Doraemon】',
            trans: [
                {
                    ori: 'shareId',
                    redi: 'krtycode',
                },
            ],
        },
        {
            keyword: 'https://lzdz-isv.isvjd.com/categoryUnion/categoryUnionActivity/',
            name: '品类联合【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_categoryUnion_activityId',
                },
            ],
        },
        {
            keyword: /interactsaas\/\?activityType=10024/,
            name: 'lzkj_interactsaas加购有礼【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_jgyl_activityId',
                },
            ],
        },

        // lzkj_interactsaas日历签到
        {
            keyword: /interactsaas\/index\?activityType=10023/,
            name: 'lzkj_interactsaas日历签到【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_rlqd_Ids',
                },
            ],
        },
        {
            keyword: /interactsaas\/\?activityType=10023/,
            name: 'lzkj_interactsaas日历签到【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_rlqd_Ids',
                },
            ],
        },

        // lzkj_interactsaas签到
        {
            keyword: /interactsaas\/index\?activityType=10040/,
            name: 'lzkj_interactsaas签到【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_qrqd_Ids',
                },
            ],
        },
        {
            keyword: /interactsaas\/\?activityType=10040/,
            name: 'lzkj_interactsaas签到【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_qrqd_Ids',
                },
            ],
        },

        // loreal_interact签到
        {
            keyword: /interactsaas\/index\?activityType=10001/,
            name: 'loreal_interact签到【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_loreal_interact_ljqdysl_Ids',
                },
            ],
        },
        {
            keyword: /interactsaas\/\?activityType=10001/,
            name: 'loreal_interact签到【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_loreal_interact_ljqdysl_Ids',
                },
            ],
        },

        // loreal_interact  10047
        {
            keyword: /interactsaas\/index\?activityType=10047/,
            name: 'lzkj_interactsaas盖楼有礼【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_glyl_Ids',
                },
            ],
        },
        {
            keyword: /interactsaas\/\?activityType=10047/,
            name: 'lzkj_interactsaas盖楼有礼【Doraemon】',
            trans: [
                {
                    ori: 'activityId',
                    redi: 'jd_lzkj_interactsaas_glyl_Ids',
                },
            ],
        },
    ];
}

/* 诺兰口令解析接口 */
async function nolanDecode(code) {
    try {
        return (
            await request({
                url: `https://api.nolanstore.top/JComExchange`,
                method: 'post',
                body: {
                    code,
                },
                json: true,
            })
        )?.body?.data?.jumpUrl;
    } catch (e) {
        console.log('nolanDecode ' + e);
        return void 0;
    }
}
/* 解析函数 ,改于白眼 */
function urlToExport(url) {
    // console.log('urlToExport', url);
    let ResArr = [];
    const listS = ListS();
    for (const oneList of listS) {
        if (!url.match(oneList.keyword)) continue;
        for (const r of oneList.trans) {
            let temp = {
                act: oneList.name,
                name: r.redi,
            };
            if (+r.ori === -1) {
                temp['value'] = encodeURI(url);
            } else if (r.ori.indexOf(' ') !== -1) {
                //提取多参数作为变量值
                let pn = r.ori.split(' ');
                let pv = [];
                pn.forEach(ele => {
                    console.log(ele);
                    if (!ele) return;
                    let reg = new RegExp('(?<=' + ele + '(=|%3D))[^&%]+'),
                        actid = url.match(reg);
                    if (actid) pv.push(actid[0]);
                    else console.log(url + '\n中未找到活动参数:' + ele);
                });
                if (!pv.length) break;
                if (r.sep) temp['value'] = pv.join(r.sep);
                else console.log('内置解析规则' + JSON.stringify(oneList) + '缺少分割符');
            } else {
                // 提取参数作为变量
                let reg = new RegExp(`(?<=${r.ori}(=|%3D))[^&%]+`),
                    actid = url.match(reg);
                if (!actid) break;
                temp['value'] = actid[0];
            }
            temp['value'] && ResArr.push(temp);
        }
    }
    return ResArr;
}
