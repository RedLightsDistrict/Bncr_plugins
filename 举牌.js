/**
 * @author Aming
 * @name 举牌
 * @origin 红灯区
 * @version 1.0.1
 * @description 任务监控
 * @rule ^(举牌|jp)([^\n]+)$
 * @admin true
 * @public false
 * @priority 99999
 * @disable false
 */

// const request = require('util').promisify(require('request'));
const request = require('request');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

module.exports = async s => {
    let jpgURL = `https://juapi.org/api/zt.php?msg=${encodeURIComponent(s.param(2))}`,
        open = false;
    ["tgBot", "HumanTG"].includes(s.getFrom()) && (jpgURL = await writeToJpg(jpgURL)), open = true;   /* 存储图片 */
    s.delMsg(s.getMsgId());
    await s.reply({
        type: 'image',
        path: jpgURL
    });
    open && fs.unlinkSync(jpgURL);
};


async function writeToJpg(url) {
    const paths = path.join(process.cwd(), `BncrData/public/${randomUUID().split('-').join('') + '.jpg'}`);
    return new Promise((resolve) => {
        request(url).pipe(
            fs.createWriteStream(paths)
        ).on('finish', () => {
            resolve(paths);
        });
    });
};

