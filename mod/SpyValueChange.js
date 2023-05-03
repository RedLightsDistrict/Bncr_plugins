/**
 * @name SpyValueChange
 * @version v1.0.1
 * @author Aming
 * @origin 红灯区
 * @create_at 2033-10-27 11:12:09
 * @description 篡改监听到的变量
 * @module true
 * @public false
 * @disable true
 */

 module.exports = async envObject => {
  console.log('需要改变的变量:', envObject);
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
  return await valueTransferUrl(envObject);
};

/**
* id转url 暂时只支持单个变量转换
* 修改记录
* 版本号[1.0.1] 修订日期[2023/5/3 9:57 PM] author[Doraemon] 修改内容 [适配多变量篡改]
* @author Doraemon
* @param {*} envObject envObject
* @returns 
*/
async function valueTransferUrl (envObject) {
  let envKey = envObject.key;
  let envVal = envObject.val;

  list().some((item) => {
      const transArr = item.trans;
      return transArr.some((transItem) => {
          if (envKey === transItem.redi && envKey.startsWith(transItem.redi) && item.fullUrl) {
           if (transItem.ori.includes(' ')) {
             const [paramNames, fullUrl] = [transItem.ori.split(' '), item.fullUrl];
             if (!fullUrl) return true;
         
             const envValArr = envVal.split(transItem.sep);
             const paramMap = new Map();
             paramNames.forEach((paramName, i) => {
               if (paramName) paramMap.set(paramName, envValArr[i]);
             });
         
             let processedUrl = fullUrl;
             paramMap.forEach((paramValue, paramName) => {
               const placeholder = '${' + paramName + '}';
               processedUrl = processedUrl.replace(placeholder, paramValue);
             });
         
             return true;
           } else {
             envVal = `${item.fullUrl}${envVal}`;
             return true;
           }
          }
      });
  });
  return {
      key: envKey,
      val: envVal
  };
}

/**
* 配置需要id转url的数组
* 主要参数：
* redi 需要转换的id
* fullUrl 对应的地址
* 修改记录
* 版本号[1.0.1] 修订日期[2023/5/3 9:57 PM] author[Doraemon] 修改内容 [增加jinggeng邀请入会有礼篡改示例]
* @author Doraemon
* 
*/
function list() {
 return [
     {
         name: 'CJ组队瓜分',
         trans: [
             {
                 redi: 'jd_cjhy_activityId',
             },
             {
                 redi: 'cjzlzd_custom',
             },
             {
                 redi: 'jd_task_sdzd8_custom',
             },
             {
                 redi: 'jd_task_cjzlzd_custom',
             },
         ],
         fullUrl: 'https://cjhydz-isv.isvjcloud.com/wxTeam/activity?activityId=',
     },
     {
       name: 'jinggeng邀请入会有礼',
       trans: [
         {
           ori: 'id user_id',
           redi: 'jinggengInviteJoin',
           sep: '&',
         },
       ],
       fullUrl: 'http://jinggeng-isv.isvjcloud.com/ql/front/showInviteJoin?id=${id}&user_id=${user_id}'
     },
 ]
}