/**
 * @author Aming
 * @description 监听某个人或群,当触发关键字,转发到指定目的地
 * @origin 红灯区
 * @version v1.0.0
 * @name 消息转发
 * @rule [\s\S]+
 * @priority 100000
 * @admin false
 * @disable false
 */

/* 
这个插件会拦截所有消息进行处理,控制台日志会由此增多
*/

/* 配置 */
const configs = [
	{
		listen: {
			/* 监听的群 */
			id: 277243301,
			from: 'qq',
			type: 'groupId',
		},
		rule: ['你好', '明天', '测试'] /* 触发到关键词将进行转发 */,
		toSender: [
			/* 转发目的地,可以是人,可以是群,可多个 */
			{
				id: 1629887728 /* id */,
				from: 'tgBot',
				type: 'userId',
			},
			{
				id: -1001744932665 /* id */,
				from: 'tgBot',
				type: 'groupId',
			},
		],
		replace: [
			/* 需要替换的信息 */
			{
				old: '你好',
				new: '你不好',
			},
		],
		addText: `\n\nBncr的转发消息` /* 尾部增加的消息 */,
	},
];

/* mian */
module.exports = async s => {
	/* 异步处理 */
	new Promise(resolve => {
		const msgInfo = s.msgInfo;
		/* 头部消息 */
		let head = `来自${msgInfo.from}
群:${msgInfo.groupId}
人:${msgInfo.userId}

`;
		for (const config of configs) {
			let msgStr = msgInfo.msg,
				open = false;
			if (msgInfo.from !== config.listen.from || +msgInfo[config.listen.type] !== config.listen.id) continue;
			for (const rule of config.rule)
				if (msgInfo.msg.includes(rule))
					(open = true), config.replace.forEach(e => (msgStr = msgStr.replace(new RegExp(e.old, 'g'), e.new)));
			if (!open) break;
			msgStr = `${head}${msgStr}${config.addText}`;
			config.toSender.forEach(e => {
				let obj = {
					platform: e.from,
					msg: msgStr,
				};
				obj[e.type] = e.id;
				return sysMethod.push(obj);
			});
		}
		resolve(void 0);
	});
	return 'next';
};
