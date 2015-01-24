/*
* 专门负责通讯的
* 获取记录集、元数据等
 
*/

//对ajax的封装 //最基础的一层封装
Nature.Ajax = function(ajaxInfo) {

    //定义默认值
    //type: "GET",                        //访问方式：如果dataPata不为空，自动设置为POST；如果为空设置为GET。
    //dataType: Nature.AjaxConfig.ajaxDataType,      //数据类型：JSON、JSONP、text
    //cache: true,                        //是否缓存，默认缓存
    //urlPara: {},//url后面的参数。一定会加在url后面，不会加到form里。
    //formData: {},//表单里的参数。如果dataType是JSON，一定加在form里，不会加在url后面；如果dataType是JSONP的话，只能加在url后面。
    //url:  //依靠上层指定

    //补全ajaxInfo
    //dataType 
    if (typeof ajaxInfo.dataType == "undefined") ajaxInfo.dataType = Nature.AjaxConfig.ajaxDataType;
    //cache
    if (typeof ajaxInfo.cache == "undefined") ajaxInfo.cache = false;

    //type
    if (typeof ajaxInfo.formData == "undefined") {
        ajaxInfo.type = "GET";
    } else {
        ajaxInfo.type = "POST";
        ajaxInfo.data = ajaxInfo.formData;
    }
   
    //处理URL和参数
    if (typeof ajaxInfo.urlPara != "undefined") {
        var tmpUrlPara = "";
        var para = ajaxInfo.urlPara;
        for (var key in para) {
            tmpUrlPara += "&" + key + "=" + para[key];
        }

        if (ajaxInfo.url.indexOf('?') >= 0) {
            //原地址有参数，直接加
            ajaxInfo.url += tmpUrlPara;
        } else {
            //原地址没有参数，变成?再加
            ajaxInfo.url += tmpUrlPara.replace('&', '?');
        }
        
       
    }

    //加webappId的参数
    if (ajaxInfo.url.indexOf('?') >= 0) {
        //原地址有参数，直接加
        ajaxInfo.url += "&webappid=" + Nature.WebConfig.WebAppId;
    } else {
        //原地址没有参数，变成?再加
        ajaxInfo.url += "?webappid=" + Nature.WebConfig.WebAppId;
    }

    //处理xhrFields
    if (typeof ajaxInfo.xhrFields == "undefined") {
        ajaxInfo.xhrFields = {
            //允许cors跨域访问时添加cookie
            withCredentials: true
        };
    } else {
        if (typeof ajaxInfo.xhrFields.withCredentials == "undefined") {
            ajaxInfo.xhrFields.withCredentials = true;
        }
    }
    //使用cors的方式实现跨域
    jQuery.support.cors = true;
    
    //处理error
    var error = ajaxInfo.error;
    ajaxInfo.error = function(request, textStatus, errorThrown) {
        //访问失败，自动停止加载动画，并且给出提示
        alert("提交" + ajaxInfo.title + "的时候发生错误！");
        if (typeof top.spinStop != "undefined")
            top.spinStop();
        if (typeof error == "function") error();
    };

    //处理success
    var success = ajaxInfo.success;
    ajaxInfo.success = function(data) {
        //显示调试信息
        if (typeof(parent.DebugSet) != "undefined")
            parent.DebugSet(data.debug);

        if (typeof(ajaxInfo.ctrlId) == "undefined")
            success(data);
        else {
            success(ajaxInfo.ctrlId, data);
        }
    };

    //开始执行ajax
    $.ajax(ajaxInfo);

    //$.ajax({
    //    type: ajaxInfo.type,
    //    dataType: ajaxInfo.dataType,
    //    cache: ajaxInfo.cache,
    //    xhrFields: {
    //        //允许跨域访问时添加cookie
    //        withCredentials: true
    //    },
    //    url: ajaxInfo.url,  
    //    data: ajaxInfo.data,
    //    //timeout: 2000,
    //    error: function (request, textStatus, errorThrown) { //访问失败，自动停止加载动画，并且给出提示
    //        alert("提交" + ajaxInfo.title + "的时候发生错误！");
    //        if (typeof top.spinStop != "undefined")
    //            top.spinStop();
    //        if (typeof ajaxInfo.error == "function") ajaxInfo.error();
    //    },

    //    success: function (data) {
    //        if (typeof(parent.DebugSet) != "undefined")
    //            parent.DebugSet(data.debug);

    //        if (typeof (ajaxInfo.ctrlId) == "undefined")
    //            ajaxInfo.success(data);
    //        else {
    //            ajaxInfo.success(ajaxInfo.ctrlId, data);
    //        }

    //    }
    //});
};
  
 