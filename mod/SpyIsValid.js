/**
 * @name SpyIsValid
 * @version v1.0.0
 * @author Aming
 * @origin 红灯区
 * @create_at 2033-10-27 11:12:09
 * @description 判断是否有效线报
 * @module true
 * @public false
 */

module.exports = async envObj => {
    // console.log('需要判断的变量:', envObj);
    /* 格式为key变量名,val变量值
    {
        key: 'M_WX_POINT_DRAW_URL',
        val: 'https://cjhy-isv.isvjcloud.com/mc/wxPointShopView/pointExgShiWu?giftId=109668ef5a7f4e80ab88fd396087ec04&giftType=3&adsource=cjhdc&venderId=1000003168'
    } 
    */
    
    /*
    写你的判断逻辑
    
    */


    /* 
    如果该导出的函数返回值为false,该变量不会被加入队列 
    注意 
    变量到该模块后 限定时间为60秒,60秒后强制返回true
    如果该模块中的代码报错,将强制返回的true */
    return true
};
