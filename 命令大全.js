/**
 * @author Doraemon
 * @name 命令大全
 * @origin 红灯区
 * @version 1.0.0
 * @description 无界命令大全
 * @rule ^(命令)$
 * @admin true
 * @public false
 * @priority 1000
 */


 var link = '：' //连接符

 var basics = { //基础命令
     'set ? ? ?': '*设置存储桶-名-值',
     'del ? ?': '*删除存储桶-名',
     'get ? ?': '*获取存储桶-名的值',
     'time': '*查看无界时间.',
     '我的id': '*我的ID.',
     '群id': '*群聊ID.',
     'name': '*无界昵称.',
     'bncr版本': '*查看bncr版本',
     '启动时间': '*查看启动时间',
     '监听该群': '*监听当前群聊',
     '屏蔽该群': '*不监听当前群聊',
     '回复该群': '*别人可以调戏你',
     '不回复该群': '*别人不可以调戏你',
     '拉黑这个b': '*别人私聊不可以调戏你',
     '拉出小黑屋': '*别人私聊可以调戏你',
     'npm i ?': '*安装指定npm依赖',
     'set groupWhitelist HumanTG:xxxx true': '*监听频道',
     'set noReplylist HumanTG:xxxx true': '*不回复频道',
     '监听该群': '*监听群聊',
     'set qq admin xxx': '*设置内置qq管理员 多个&连接',
     'set tgBot admin xxx': '*设置tgBot管理员 多个&连接',
     'set HumanTG admin xxx': '*设置人形管理员 多个&连接',
     'set qqOutside admin xxx': '*设置外置qq管理员 多个&连接',
     'set wxKeAImao admin xxx': '*设置可爱猫管理员 多个&连接',
     'set wxQianxun admin xxx': '*设置千寻管理员 多个&连接',
     'set wxXyo admin xxx': '*设置西瓜管理员 &连接'
 }
 
 //插件入口
module.exports = async s => {
    let newBasics = ''
    for (let [key, value] of Object.entries(basics)) {
        newBasics += `${key}${link}${value}\n`
    }
    s.delMsg(await s.reply(`基础命令：\n${newBasics}`), {wait: 10});
};
