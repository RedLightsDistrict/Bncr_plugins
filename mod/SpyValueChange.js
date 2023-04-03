/**
 * @name SpyValueChange
 * @version v1.0.0
 * @author Aming
 * @origin 红灯区
 * @create_at 2033-10-27 11:12:09
 * @description 篡改监听到的变量
 * @module true
 * @public false
 */

module.exports = async envObject => {
    // console.log('需要改变的变量:', envObject);
    /* 格式为key变量名,val变量值
    {
        key: 'M_WX_POINT_DRAW_URL',
        val: 'https://cjhy-isv.isvjcloud.com/mc/wxPointShopView/pointExgShiWu?giftId=109668ef5a7f4e80ab88fd396087ec04&giftType=3&adsource=cjhdc&venderId=1000003168'
    } 
    */

    /*
    写你的判断逻辑
    
    */


    /* 判断完毕返回一个 {key:xxx,val:xxx}对象 
    如果返回值格式 有问题/逻辑判断超过60s/报错 均会强制返回原始Object
    */
    return envObject;
};
