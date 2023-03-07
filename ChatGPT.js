/**
 * @author zhx47
 * @name ChatGPT
 * @origin 红灯区
 * @version 1.0.0
 * @description 感谢知了大佬的Python项目，只是简单的转换了一下。原项目地址：https://github.com/pengzhile/pandora
 * @rule ^ai ([^ \n]+)
 * @admin false
 * @public false
 * @priority 9999
 * @disable false
 */

module.exports = async s => {
    const request = require('util').promisify(require('request'));
    const chatGPTStorage = new BncrDB('ChatGPT');

    // 请在ChatGPT官网登陆完成后，打开F12查看https://chat.openai.com/api/auth/session请求返回的accessToken，并使用命令'set ChatGPT Token ?'设置accessToken
    let baseHeaders;

    async function main() {
        // 校验accessToken
        let accessToken = await chatGPTStorage.get('Token');
        if (!accessToken) {
            await s.reply("请使用命令'set ChatGPT Token ?,设置ChatGPT的accessToken");
            return;
        }

        baseHeaders = {
            'Authorization': 'Bearer ' + accessToken,
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
            'Origin': 'https://home.apps.openai.com',
            'Referer': 'https://home.apps.openai.com/',
        };

        // 初始化变量
        let userId = s.getUserId();
        let platform = s.getFrom();
        let key = platform + '_' + userId;
        console.log(key);
        let conversationId, model, lastUserMessageId, prompt, lastParentMessageId;
        if (await chatGPTStorage.get(key)) {
            // 加载旧的配置文件
            let userConfiguration = JSON.parse(await chatGPTStorage.get(key));
            conversationId = userConfiguration['conversationId'];
            model = userConfiguration['model'];
            lastUserMessageId = userConfiguration['lastUserMessageId'];
            prompt = userConfiguration['prompt'];
            lastParentMessageId = userConfiguration['lastParentMessageId'];
        }
        let command = s.param(1);
        switch (command) {
            case '帮助':
                await s.reply(
                    "输入'ai ?'进行与ChatGPT互动。脚本为每个用户创建单独的会话，可以保持上下文进行调教，参考：https://github.com/PlexPt/awesome-chatgpt-prompts-zh\n\n特殊指令：\n'ai 清空上下文'：抛弃已有会话，创建全新会话。\n'ai 重新生成回答'：对问题的回答不满意，可以重新获取一份新的回答。\n\n输入'ai 帮助'即可再次查看指南。"
                );
                break;
            case '清空上下文':
                if (!conversationId) {
                    await s.reply(
                        '你再无中生有，暗度陈仓，凭空想象，凭空捏造。都没有创建过会话，你猴急个🔨，我要开始打人了！'
                    );
                } else {
                    if (await delConversation(conversationId)) {
                        // 如果删除掉会话，就清空本地配置，否则就算了吧
                        await chatGPTStorage.del(key);
                        await s.reply('清空成功！');
                    }
                }
                break;
            case '重新生成回答':
                if (!conversationId) {
                    await s.reply(
                        '你再无中生有，暗度陈仓，凭空想象，凭空捏造。都没有创建过会话，你猴急个🔨，我要开始打人了！'
                    );
                } else {
                    let replyContent = await regenerateReply(
                        conversationId,
                        model,
                        lastUserMessageId,
                        prompt,
                        lastParentMessageId
                    );
                    if (replyContent['error']) {
                        await s.reply(`嗨嗨嗨，接口报错了：${replyContent['error']}`);
                    }
                    if (!replyContent['message']) {
                        await s.reply(`嗨嗨嗨，没有获取到接口返回的消息，等会再试试叭`);
                    } else {
                        await s.reply(replyContent['message']['content']['parts'][0]);
                        userConfiguration['lastParentMessageId'] = replyContent['message']['id'];
                        await chatGPTStorage.set(key, JSON.stringify(userConfiguration));
                    }
                }
                break;
            default:
                if (!(await chatGPTStorage.get(key))) {
                    // 第一次，无配置文件，需要创建新会话
                    await s.reply("创建新会话，使用'ai 帮助'命令查看帮助");
                    let models = await listModels();
                    if (!models) {
                        await s.reply(`未获取到可用模型，886`);
                        return;
                    }
                    model = models[0]['slug'];
                    await s.reply(`使用模型：${model}`);
                    lastParentMessageId = '';
                }
                let userMessageId = uuidv4();
                let replyContent = await talk(conversationId, model, userMessageId, command, lastParentMessageId);
                if (replyContent['error']) {
                    await s.reply(`嗨嗨嗨，接口报错了：${replyContent['error']}`);
                }
                if (!replyContent['message']) {
                    await s.reply(`嗨嗨嗨，没有获取到接口返回的消息，等会再试试叭`);
                } else {
                    await s.reply(replyContent['message']['content']['parts'][0]);
                    let userConfiguration = {
                        conversationId: replyContent['conversation_id'],
                        model: replyContent['message']['metadata']['model_slug'],
                        lastUserMessageId: userMessageId,
                        prompt: command,
                        lastParentMessageId: replyContent['message']['id'],
                    };
                    await chatGPTStorage.set(key, JSON.stringify(userConfiguration));
                    if (!conversationId) {
                        console.log('第一次生成会话，将用户ID设置为会话ID防止删除');
                        await setConversationTitle(replyContent['conversation_id'], key);
                    }
                }
                break;
        }
    }

    /**
     * 列取ChatGPT可用模型
     */
    async function listModels() {
        var { body, statusCode } = await request({
            url: `https://apps.openai.com/api/models`,
            method: 'get',
            headers: baseHeaders,
            dataType: 'json',
            json: true,
        });
        // console.log('listModels');
        // console.log('body', body);
        // console.log('body', body['models']);
        // console.log('statusCode', statusCode);

        // {"models":[{"slug":"text-davinci-002-render-sha","max_tokens":4097,"title":"Turbo (Default for free users)","description":"The standard ChatGPT model","tags":[]}]}
        if (statusCode != 200) {
            await s.reply(`获取可用模型出错，返回状态码：${statusCode}`);
            return;
        }
        return body['models'];
    }

    /**
     * 分页获取会话列表
     *
     * @param {int} offset 页码
     * @param {int} limit  页大小
     */
    async function listConversations(offset, limit) {
        let result = await request({
            url: `https://apps.openai.com/api/conversations?offset=${offset}&limit=${limit}`,
            method: 'get',
            headers: baseHeaders,
        });
        console.log('result', result.body);
    }

    /**
     * 加载会话历史内容
     *
     * @param {string} conversationId 会话ID
     */
    async function loadConversation(conversationId) {
        let result = await request({
            url: `https://apps.openai.com/api/conversation/${conversationId}`,
            method: 'get',
            headers: baseHeaders,
        });
        result = JSON.parse(result.body);
        let currentNodeId = result['current_node'];
        let nodes = [];
        while (true) {
            let node = result['mapping'][currentNodeId];
            if (!node['parent']) break;
            nodes.unshift(node);
            currentNodeId = node['parent'];
        }
        for (let node of nodes) {
            let message = node['message'];
            if (message['metadata']['model_slug']) {
                let modelSlug = message['metadata']['model_slug'];
                // console.log(`model_slug:${model_slug}`);
            }
            if ('user' === message['role']) {
                console.log('You:');
                console.log(message['content']['parts'][0]);
            } else {
                console.log('ChatGPT:');
                console.log(message['content']['parts'][0]);
            }
            console.log(node['id']);
        }
    }

    /**
     * 发送消息
     *
     * @param {string} conversationId 会话ID，新建会话时传入null
     * @param {string} model 模型
     * @param {string} messageId 消息ID
     * @param {string} prompt 消息内容
     * @param {string} parentMessageId 父消息ID，新建会话时传入空串
     * @returns
     */
    async function talk(conversationId, model, messageId, prompt, parentMessageId) {
        let data = {
            action: 'next',
            messages: [
                {
                    id: messageId,
                    role: 'user',
                    content: {
                        content_type: 'text',
                        parts: [prompt],
                    },
                },
            ],
            model: model,
            parent_message_id: parentMessageId,
        };
        if (conversationId) {
            data['conversation_id'] = conversationId;
        }
        return requestConversationContent(data);
    }

    /**
     * 重新生成回答
     *
     * @param {string} conversationId 会话ID
     * @param {string} model 模型
     * @param {string} lastUserMessageId 用户上一个消息ID
     * @param {string} prompt 消息内容
     * @param {string} lastParentMessageId 父消息ID
     * @returns
     */
    async function regenerateReply(conversationId, model, lastUserMessageId, prompt, lastParentMessageId) {
        let data = {
            action: 'variant',
            messages: [
                {
                    id: lastUserMessageId,
                    role: 'user',
                    content: {
                        content_type: 'text',
                        parts: [prompt],
                    },
                },
            ],
            model: model,
            conversation_id: conversationId,
            parent_message_id: lastParentMessageId,
        };
        return await requestConversationContent(data);
    }

    /**
     * 发送会话请求
     *
     * @param {object} data 请求内容
     */
    async function requestConversationContent(data) {
        let { body, statusCode } = await request({
            url: `https://apps.openai.com/api/conversation`,
            method: 'post',
            body: data,
            headers: baseHeaders,
            json: true,
        });
        // body = JSON.stringify(body)
        console.log('statusCode', statusCode);
        console.log('body', body);
        // console.log('body', typeof body);
        // console.log('body.loc', body.detail[0].loc);
        
        if (statusCode != 200) {
            await s.reply(`发送消息请求出错，返回状态码：${statusCode}`);
            return;
        }
        // console.log(body);
        let reply = {};

        for (let line of body.split('\n')) {
            if ('data: {' === line.slice(0, 7)) {
                reply = JSON.parse(line.slice(6));
            }
            if ('data: [DONE]' === line.slice(0, 12)) {
                break;
            }
        }
        console.log('reply',reply);
        return reply;
    }

    /**
     * 构建删除会话请求
     *
     * @param {string} conversationId 会话ID
     */
    async function delConversation(conversationId) {
        let data = {
            is_visible: false,
        };
        return await updateConversation(conversationId, data);
    }

    /**
     * 设置会话标题
     *
     * @param {string} conversationId 会话ID
     * @param {string} title 标题名称
     */
    async function setConversationTitle(conversationId, title) {
        let data = {
            title: title,
        };
        return await updateConversation(conversationId, data);
    }

    /**
     * 更新会话
     *
     * @param {string} conversationId 会话ID
     * @param {object} data 更新内容
     */
    async function updateConversation(conversationId, data) {
        let { body, statusCode } = await request({
            url: `https://apps.openai.com/api/conversation/${conversationId}`,
            method: 'patch',
            body: data,
            headers: baseHeaders,
            dataType: 'json',
            json:true
        });
        console.log(data);
        console.log(statusCode);
        console.log(body);
        if (statusCode != 200) {
            await s.reply(`更新会话请求出错，返回状态码：${statusCode}`);
            return;
        }
        if (!body.success) {
            await s.reply(`更新会话请求出错，返回原因：${body.text}`);
        }
        return body.success;
    }

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    await main();
};
