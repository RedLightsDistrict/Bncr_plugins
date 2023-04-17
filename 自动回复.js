/**
 * @author Aming
 * @description 自动回复
 * @origin 红灯区
 * @version v1.0.0
 * @name 自动回复
 * @rule ^(删除自动回复) ([^\n]+)$
 * @rule ^(添加自动回复) ([^\n]+) ([\s\S]+)$
 * @rule ^(自动回复列表)$
 * @rule [\s\S]+
 * @priority 1
 * @admin false
 * @disable false
 */

/*
使用示例 当触发你好无界 回复:我是无界Bot,你好
添加自动回复 你好无界 我是无界Bot,你好
删除自动回复 你好无界
自动回复列表
*/
const { randomUUID } = require('crypto'),
	db = new BncrDB('autoReplyInfo'),
	delMsgTime = 15 /* 触发回复后撤回时间 秒  0不撤回 */,
    head = `自动触发消息:\n`; /* 头部消息 不需要='' */


/* mian */
module.exports = async s => {
	const msgInfo = s.msgInfo,
		keys = await db.keys();
	switch (s.param(1)) {
		case '添加自动回复':
			if (!(await s.isAdmin())) return;
			if (!+msgInfo.groupId) return s.reply('非群组禁用');

			let logs0 = '添加成功',
				uuid = randomUUID();
			for (const e of keys) {
				let r = await db.get(e, '');
				if (msgInfo.from === r.from && msgInfo.groupId === r.groupId && r.listen === s.param(2)) {
					logs0 = '已存在该关键词,更新成功';
					uuid = e;
					break;
				}
			}
			/* 设置数据 */
			db.set(uuid, {
				groupId: msgInfo.groupId,
				from: msgInfo.from,
				listen: s.param(2),
				reply: s.param(3),
			});
			return s.delMsg(await s.reply(logs0), { wait: 10 });
		case '自动回复列表':
			if (!(await s.isAdmin())) return;
			let logs = ``;
			let i = 1;
			for (const e of keys) {
				let r = await db.get(e, '');
				logs += `${i}. ${r.from}:${r.groupId}=>${r.listen}|${r.reply}\n`;
				i++;
			}
			return s.delMsg(await s.reply(logs || '空列表'), { wait: 10 });
		case '删除自动回复':
			if (!(await s.isAdmin())) return;
			let logs1 = `没有该关键词回复列表`;
			for (const e of keys) {
				let r = await db.get(e, '');
				if (r.listen !== s.param(2)) continue;
				logs1 = `已删除:${r.listen}`;
				db.del(e);
			}
			return s.delMsg(await s.reply(logs1), { wait: 10 });
	}

	/* 异步处理 */
	new Promise(async resolve => {
		if (!+msgInfo.groupId) return;
		for (const key of keys) {
			let r = await db.get(key, '');
			if (msgInfo.msg.search(r.listen) === -1) continue;
			let toMsg = head + r.reply;
			let id = await s.reply(toMsg);
			delMsgTime && s.delMsg(id, { wait: delMsgTime });
		}
		resolve(void 0);
	});

	return 'next';
};
