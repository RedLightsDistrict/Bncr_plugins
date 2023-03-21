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

module.exports = async msg => {
    /* 
     当触发的消息中没有 export格式变量时,触发的消息会经过此模块解析
     因此,你可以在此模块中添加你对export以外的消息进行解析,返回一个export线报 
    */
    console.log('需要解析的msg:', msg);

    /*
    写你的判断逻辑
    
    */

    /* 
    如果该导出的函数返回值不是一个string或不是一个 export格式的线报时,该msg会被放弃 
    如果该模块中的代码报错 将强制返回'' */
    return '';
};
