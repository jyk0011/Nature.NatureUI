
/*
* ajax获取数据，
* 

*/

/*
参数格式：
*/

ajaxData = {
    title: "",              /* 如果访问出错，弹出提示框的标题和提示信息，建议不要省略 */
    url: "",                /* 访问的url地址，省略的话采用默认值 “/Data/GetData.ashx” */
    cache: true,            /* false \ true*/
    data: {},               /* 发送的数据 */
    success: function() {   /* 访问成功执行的函数 */
    },
    error: function () {   /* 访问失败执行的函数 */
    }
};

Nature.Data.LoadData = function () {

    /*访问失败后调用的共用函数*/
    var myError = function (ajaxData) {
        alert("获取" + ajaxData.title + "的时候发生错误！");
        if (typeof top.spinStop != "undefined")
            top.spinStop();
    };
    
    /*访问成功后调用的共用函数*/
    var mySuccess = function (ajaxData, data) {
        //如果有debug信息，调用显示debug的函数显示信息
        if (typeof (parent.DebugSet) != "undefined")
            parent.DebugSet(data.debug);

        if (typeof (ajaxData.ctrlId) == "undefined")
            ajaxData.success(data);
        else {
            ajaxData.success(ajaxData.ctrlId, data);

        }
    };

    /*保存，不跨域的情况*/
    this.ajaxSaveData = function(ajaxData) {
        $.ajax({
            type: "POST",
            dataType: "json",
            cache: false,
            url: "/SSOapp/PostData.ashx?url=data&" + ajaxData.urlPara,
            data: ajaxData.data,
            error: function () {
                myError(ajaxData);
                
            },

            success: function (data) {
                mySuccess(ajaxData, data);

            }
        });
    };
    
    //获取客户数据
    this.ajaxGetData = function(ajaxData) {

        //增删改查服务的网址
        var url = Nature.resourceUrl;
        if (typeof ajaxData.url == "undefined")
            url += "/Data/GetData.ashx";
        else
            url += ajaxData.url;

        $.ajax({
            dataType: Nature.sendDataType,
            data: ajaxData.data,
            cache: false,
            url: url,               
            error: function() {
                myError(ajaxData);
            },

            success: function (data) {
                mySuccess(ajaxData, data);
                 
            }
        });
    };
    
    /*删除数据*/
    this.ajaxDeleteData = function (ajaxData) {
        var url = Nature.resourceUrl;
        if (typeof ajaxData.url == "undefined")
            url += "/Data/GetData.ashx";
        else
            url += ajaxData.url;
        
        $.ajax({
            dataType: Nature.sendDataType,
            url: url,
            data: ajaxData.data,
            error: function () {
                myError(ajaxData);
            },

            success: function (data) {
                mySuccess(ajaxData, data);

            }
        });
    };
    
    /*获取页面视图的元数据*/
    this.ajaxGetMeta = function (ajaxData) {

        $.ajax({
            dataType: Nature.sendDataType,
            data: ajaxData.data,
            cache: false,
            xhrFields: {    //允许跨域访问是添加cookie
                withCredentials: true
            },
            url: Nature.resourceUrl + "/MetaData/GetMeta.ashx",
            error: function() {
                myError(ajaxData);
            },

            success: function (data) {
                mySuccess(ajaxData, data);
            }
        });
    };
    
    /*修改字段排序*/
    this.ajaxModOrderForColMeta = function (ajaxData) {

        $.ajax({
            dataType: Nature.sendDataType,
            data: ajaxData.data,
            cache: false,
            xhrFields: {    //允许跨域访问是添加cookie
                withCredentials: true
            },
            url: Nature.resourceUrl + "/MetaData/PostMeta.ashx",
            error: function () {
                myError(ajaxData);
            },

            success: function (data) {
                mySuccess(ajaxData, data);
            }
        });
    };

    

}