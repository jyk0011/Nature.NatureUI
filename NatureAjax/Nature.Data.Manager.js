
/*
* meta的维护，调用ajax实现。
* 其实就是加上URL地址，和设置cache

*/

/*参数格式：*/

//var ajaxData = {
//    title: "",              /* 如果访问出错，弹出提示框的标题和提示信息，建议不要省略 */
//    url: "",                /* 访问的url地址，省略的话采用默认值 “/Data/GetData.ashx” */
//    cache: true,            /* false \ true*/
//    urlPara: {},               /* url参数 */
//    formData: {},               /* 发送的数据 */
//    success: function () {   /* 访问成功执行的函数 */
//    },
//    error: function () {   /* 访问失败执行的函数 */
//    }
//};

Nature.Data.Manager = function () {

    var ajax = Nature.Ajax;//简化一下

    //==============元数据部分============================
    /*获取页面视图的元数据*/
    this.ajaxGetMeta = function (ajaxData) {
        ajaxData.url = Nature.AjaxConfig.UrlResource + "/MetaData/GetMeta.ashx";
        ajax(ajaxData);
    };

    /*修改字段排序*/
    this.ajaxModOrderForColMeta = function (ajaxData) {
        ajaxData.url = Nature.AjaxConfig.UrlResource + "/MetaData/PostMeta.ashx";
        ajax(ajaxData);
    };


    //似乎是权限的地方
    this.ajaxSaveDataSSOApp = function (ajaxData) {

        ajaxData.url = "/SSOapp/PostData.ashx?url=data&" + ajaxData.urlPara;
        ajaxData.formData = ajaxData.data;

        ajax(ajaxData);

    };

    //==============客户数据部分============================
    //保存数据，可以跨域post
    this.ajaxSaveData = function (ajaxData) {
        
        var url = Nature.AjaxConfig.UrlResource;
        if (typeof ajaxData.url == "undefined") url += "/Data/PostData.ashx";
        else url += ajaxData.url;

        ajaxData.url = url;
        if (typeof ajaxData.urlPara.action == "undefined") ajaxData.urlPara.action = "savedata";

        ajax(ajaxData);
         
    };
    
    //获取客户数据
    this.ajaxGetData = function (ajaxData) {

        //增删改查服务的网址
        var url = Nature.AjaxConfig.UrlResource;
        if (typeof ajaxData.url == "undefined") url += "/Data/GetData.ashx";
        else url += ajaxData.url;

        ajaxData.url = url;
        ajax(ajaxData);

    };

    /*删除数据*/
    this.ajaxDeleteData = function (ajaxData) {
        var url = Nature.AjaxConfig.UrlResource;

        if (typeof ajaxData.url == "undefined") url += "/Data/GetData.ashx";
        else url += ajaxData.url;

        ajaxData.url = url;
        
        ajax(ajaxData);
    };
}