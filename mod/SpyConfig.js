let RspyList = {
    /* 监控信息配置 */
    SpyList: [
        {
            /* 任务名 确保任务名唯一性,因为id根据任务名计算生成*/ 
			Name: 'Spy测试1',
            /* 执行的脚本名 */
            Script: 'spy/test.js',
            /* 监听变量 */
            ListenEnv: ['jdzz', 'jdhb', 'mtgh'],
            /* 转换变量 */
            SetEnv: {
                jdzz: 'zhuanzhuan',
                jdhb: 'hongbao',
            },
            /* 超时退出 (秒)*/
            TimeOut: 0,
            /* 间隔时间(秒) */
            Interval: 30,
            /* 运行面板 0 代表 面板管理中的第一个容器 以此类推 */
            RunPanel: [0, 1, 2],
            /* 禁用任务 */
            Disable: false,
        },
		//以下给出几个示例
        {
            Name: '无线',
            Script: 'jd_task_wuxian.js',
            ListenEnv: [
                'jd_task_wuxian_custom',
                'jd_task_hudong_custom',
                'LUCK_DRAW_URL',
            ],
            SetEnv: {
                jd_task_hudong_custom: 'jd_task_wuxian_custom',
                LUCK_DRAW_URL: 'jd_task_wuxian_custom',
            },
            TimeOut: 50,
            Interval: 0,
            RunPanel: [0],
            Disable: false,
        },
        {
            Name: '集卡',
            Script: 'jd_task_jika.js',
            ListenEnv: ['M_WX_COLLECT_CARD_URL', 'jd_wxCollectCard_activityId'],
            SetEnv: {
                M_WX_COLLECT_CARD_URL: 'jd_task_jika_custom',
                jd_wxCollectCard_activityId: 'jd_task_jika_custom',
            },
            TimeOut: 80,
            Interval: 0,
            RunPanel: [0],
            Disable: false,
        },
        {
            Name: '组队',
            Script: 'jd_task_cjzlzd.js',
            ListenEnv: ['jd_task_cjzlzd_custom', 'jd_cjhy_activityId', 'jd_zdjr_activityId', 'M_WX_TEAM_URL'],
            SetEnv: {
                jd_cjhy_activityId: 'jd_task_cjzlzd_custom',
                jd_zdjr_activityId: 'jd_task_cjzlzd_custom',
                M_WX_TEAM_URL: 'jd_task_cjzlzd_custom',
            },
            TimeOut: 0,
            Interval: 0,
            RunPanel: [0],
            Disable: false,
        },
    ],
    /* 监控列表 */
    ListenList: [
        {
            Name: '备注1',
            Id: '-1001744932665',
        },
        {
            Name: '备注2',
            Id: '-1001776658413',
        }
    ],

    //非静默触发消息多少秒撤回 0不撤回
    delMsgWaitTime: 10,
    //静默功能  默认false,会在监听到消息的地方回复监听结果 true则推送到静默推送设置的地方
    Taboo: true,
    TabooOriginalMsg: false /* 静默后推送的消息是否显示触发消息 */,
    //1 禁用任何日志输出 改为true后,不会向社交平台推送任何消息,且2 3开关失效 控制台除外
    DisableAllLogs: false,
    //2 禁用错误日志输出 改为true后,不会向社交平台推送任何错误消息 控制台除外
    DisableErrLogs: false,
    //3 禁用正常运行日志输出 改为true后,不会向社交平台推送任何任务运行成功的消息 控制台除外
    DisableRunLogs: false,
    //4 禁用控制台日志 改为true后,控制台不会显示任何消息
    DisableConsoleLog: false,
    //队列模式 1先进先出  2先进后出  其他值均视为 先进先出
    ListMode: 2,
    /* 运行日志输出位置,例如错误运行日志/任务运行成功等日志,只能设置1个 */
    runLogsInfo: {
        platform: 'tgBot', //发送平台
        toGroupOrUser: 'groupId', //通知类型,个人userId //群groupId
        Id: '-1001744932665', //个人id 或群id
    },
    /* 静默后监控结果输出位置  可填多个*/
    TabooLogsInfo: [
        // 	{
        // 	platform: "HumanTG",
        // 	toGroupOrUser: "groupId",   //通知类型,个人userId //群groupId
        // 	Id: "-1001744932665"
        // },
         {
             platform: 'tgBot', //发送平台
             toGroupOrUser: 'groupId', //通知类型,个人userId //群groupId
             Id: '-1001704263871', //个人id 或群id
         },
    ],
};


module.exports = {
    RspyList,
};
